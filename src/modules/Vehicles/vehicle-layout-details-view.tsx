import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from '@/routes/paths';
import { useParams } from '@/routes/hooks';
import { RouterLink } from '@/routes/components';

import Iconify from '@/components/iconify';
import EmptyContent from '@/components/empty-content';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';

import SeatLayoutBoard from '@/modules/Tickets/seat-layout-board';
import {
  buildLayoutSeats,
  findSeatLayout,
  layoutSeatCount,
  layoutSeatSummary,
  type LayoutSeatInfo,
} from '@/modules/Tickets/seat-layouts';

// ----------------------------------------------------------------------

const EMPTY = '—';

export default function VehicleLayoutDetailsView() {
  const { t } = useTranslation();
  const { layoutId } = useParams();
  const layout = findSeatLayout(layoutId);

  const seats = useMemo(() => (layout ? buildLayoutSeats(layout) : []), [layout]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!layout) {
      return;
    }

    setSelectedId(null);
    setPrices(
      Object.fromEntries(buildLayoutSeats(layout).map((seat) => [seat.id, seat.defaultPrice]))
    );
  }, [layout]);

  if (!layout) {
    return (
      <Container maxWidth={false} disableGutters>
        <EmptyContent
          filled
          title="LAYOUT_NOT_FOUND"
          description="LAYOUT_NOT_FOUND_DESC"
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.vehicles.layout}
              variant="contained"
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
              sx={{ mt: 3 }}
            >
              {t('BACK_TO_LAYOUTS')}
            </Button>
          }
          sx={{ py: 10 }}
        />
      </Container>
    );
  }

  const selected = seats.find((seat) => seat.id === selectedId) ?? null;
  const selectedPrice = selected ? prices[selected.id] ?? selected.defaultPrice : undefined;

  return (
    <Container maxWidth={false} disableGutters>
      <CustomBreadcrumbs
        heading={layout.label}
        links={[
          { name: 'NAV_DASHBOARD', href: paths.dashboard.root },
          { name: 'NAV_VEHICLES', href: paths.dashboard.vehicles.root },
          { name: 'NAV_LAYOUT', href: paths.dashboard.vehicles.layout },
          { name: layout.label },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.vehicles.layout}
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            {t('BACK')}
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          alignItems: 'start',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 380px' },
        }}
      >
        <Card sx={{ p: 3 }}>
          <Stack spacing={0.5} sx={{ mb: 2.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {layout.caption}
            </Typography>
            <Typography variant="h6">{layout.label}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {layoutSeatSummary(layout)} · {t('SEATS_COUNT', { count: layoutSeatCount(layout) })}
            </Typography>
          </Stack>

          <SeatLayoutBoard
            layout={layout}
            interactive
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          <Typography
            variant="caption"
            sx={{ display: 'block', mt: 2, color: 'text.secondary', fontWeight: 600 }}
          >
            {t('CLICK_SEAT_PRICE_HINT')}
          </Typography>
        </Card>

        <SeatPriceCard
          seat={selected}
          price={selectedPrice}
          onPriceChange={(value) => {
            if (!selected) {
              return;
            }
            setPrices((current) => ({ ...current, [selected.id]: value }));
          }}
        />
      </Box>
    </Container>
  );
}

// ----------------------------------------------------------------------

function SeatPriceCard({
  seat,
  price,
  onPriceChange,
}: {
  seat: LayoutSeatInfo | null;
  price?: number;
  onPriceChange: (value: number) => void;
}) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    setEditing(false);
    setConfirmOpen(false);
    setDraft(price !== undefined ? String(price) : '');
  }, [seat?.id, price]);

  const parsedDraft = Number(draft);
  const draftValid = Boolean(draft.trim()) && Number.isFinite(parsedDraft) && parsedDraft >= 0;
  const nextPrice = draftValid ? Math.round(parsedDraft) : null;

  const handleStartEdit = () => {
    if (!seat) {
      return;
    }
    setDraft(String(price ?? seat.defaultPrice));
    setEditing(true);
  };

  const handleOpenConfirm = () => {
    if (!seat || nextPrice === null) {
      setDraft(String(price ?? seat?.defaultPrice ?? ''));
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    if (!seat || nextPrice === null) {
      return;
    }

    onPriceChange(nextPrice);
    setConfirmOpen(false);
    setEditing(false);
  };

  return (
    <Card sx={{ p: 3, position: { md: 'sticky' }, top: { md: 96 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h6">{seat ? `${t('SEAT')} ${seat.id}` : t('SEAT_DETAILS')}</Typography>

        {seat ? (
          <IconButton
            aria-label={t('EDIT_PRICE')}
            color={editing ? 'primary' : 'default'}
            onClick={handleStartEdit}
            disabled={editing}
          >
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        ) : (
          <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>
            {t('SELECT_A_SEAT')}
          </Typography>
        )}
      </Stack>

      <Box
        display="grid"
        gridTemplateColumns="repeat(2, minmax(0, 1fr))"
        columnGap={2}
        rowGap={1.75}
      >
        <Box sx={{ gridColumn: '1 / -1', minWidth: 0 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {t('PRICE')}
          </Typography>
          {seat ? (
            editing ? (
              <TextField
                autoFocus
                fullWidth
                size="small"
                type="number"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                inputProps={{ min: 0 }}
                sx={{ mt: 0.75 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        ৳
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
            ) : (
              <Typography variant="subtitle2" sx={{ mt: 0.5 }}>
                {price !== undefined ? `৳${price.toLocaleString('en-BD')}` : EMPTY}
              </Typography>
            )
          ) : (
            <Typography variant="subtitle2" sx={{ mt: 0.5, color: 'text.disabled' }}>
              {EMPTY}
            </Typography>
          )}
        </Box>

        <SeatField label={t('ROW')} value={seat ? String(seat.row) : undefined} />
        <SeatField label={t('DECK')} value={seat?.deckLabel} />
        <SeatField label={t('SIDE')} value={seat?.side} />
        <SeatField label={t('POSITION')} value={seat?.position} />

        <Divider sx={{ gridColumn: '1 / -1' }} />

        <SeatField
          label={t('DEFAULT_FARE')}
          value={seat ? `৳${seat.defaultPrice.toLocaleString('en-BD')}` : undefined}
        />
        <SeatField
          label={t('CURRENT_FARE')}
          value={price !== undefined ? `৳${price.toLocaleString('en-BD')}` : undefined}
        />
      </Box>

      {seat && editing && (
        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={<Iconify icon="solar:tag-price-bold" />}
          sx={{ mt: 3, fontWeight: 700 }}
          onClick={handleOpenConfirm}
          disabled={!draftValid}
        >
          {t('SAVE_PRICE')}
        </Button>
      )}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t('SAVE_SEAT_PRICE_QUESTION')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('UPDATE_SEAT_PRICE_CONFIRM', { seat: seat?.id, price: (nextPrice ?? 0).toLocaleString('en-BD') })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={() => setConfirmOpen(false)}>
            {t('CANCEL')}
          </Button>
          <Button variant="contained" onClick={handleConfirmSave} sx={{ fontWeight: 700 }}>
            {t('CONFIRM')}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

function SeatField({ label, value }: { label: string; value?: string }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="subtitle2" sx={{ color: value ? 'text.primary' : 'text.disabled' }}>
        {value || EMPTY}
      </Typography>
    </Box>
  );
}


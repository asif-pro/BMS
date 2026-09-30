import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import SeatLayoutBoard from './seat-layout-board';
import { layoutSeatCount, type LayoutConfig } from './seat-layouts';

// ----------------------------------------------------------------------

type Props = {
  layout: LayoutConfig;
};

export default function LayoutPreview({ layout }: Props) {
  const { t } = useTranslation();
  const seatCount = layoutSeatCount(layout);
  const previewScale =
    layout.id === 'double-decker'
      ? 0.32
      : layout.id === '1+1'
        ? 0.55
        : layout.id === '2+2-classic'
          ? 0.36
          : 0.4;

  return (
    <Card sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Stack spacing={0.25}>
          <Typography variant="subtitle2">{layout.label}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {layout.caption} · {t('SEATS_COUNT', { count: seatCount })}
          </Typography>
        </Stack>

        <Box
          sx={{
            borderRadius: 1.5,
            overflow: 'auto',
            bgcolor: 'background.neutral',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1,
          }}
        >
          <Box sx={{ zoom: previewScale }}>
            <SeatLayoutBoard layout={layout} />
          </Box>
        </Box>
      </Stack>
    </Card>
  );
}

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Theme, alpha, SxProps, useTheme } from '@mui/material/styles';

import { useBoolean } from '@/hooks/use-boolean';

import { fTaka } from '@/utils/format-number';

import { bgGradient } from '@/theme/css';

import Iconify from '@/components/iconify';

import type { IWalletCard } from './types';

// ----------------------------------------------------------------------

type Props = {
  card: IWalletCard;
  sx?: SxProps<Theme>;
};

export default function AccountBalanceCard({ card, sx }: Props) {
  const theme = useTheme();

  const { cardType, balance, cardHolder, cardNumber, cardValid } = card;

  const hidden = useBoolean();

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.grey[900], 0.8),
          imgUrl: '/assets/background/overlay_2.jpg',
        }),
        height: 262,
        borderRadius: 2,
        position: 'relative',
        color: 'common.white',
        '&:before, &:after': {
          left: 0,
          mx: 2.5,
          right: 0,
          zIndex: -2,
          height: 200,
          bottom: -16,
          content: "''",
          opacity: 0.16,
          borderRadius: 2,
          bgcolor: 'grey.500',
          position: 'absolute',
        },
        '&:after': {
          mx: 1,
          bottom: -8,
          opacity: 0.24,
        },
        ...sx,
      }}
    >
      <Stack justifyContent="space-between" sx={{ height: 1, p: 3 }}>
        <div>
          <Typography sx={{ mb: 2, typography: 'subtitle2', opacity: 0.48 }}>
            Current Balance
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography sx={{ typography: 'h3' }}>
              {hidden.value ? '********' : fTaka(balance)}
            </Typography>

            <IconButton color="inherit" onClick={hidden.onToggle} sx={{ opacity: 0.48 }}>
              <Iconify icon={hidden.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
            </IconButton>
          </Stack>
        </div>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ typography: 'subtitle1' }}
        >
          <Box
            sx={{
              bgcolor: 'white',
              lineHeight: 0,
              px: 0.75,
              borderRadius: 0.5,
              mr: 1,
            }}
          >
            {cardType === 'mastercard' && <Iconify width={24} icon="logos:mastercard" />}
            {cardType === 'visa' && <Iconify width={24} icon="logos:visa" />}
          </Box>
          {cardNumber}
        </Stack>

        <Stack direction="row" spacing={5}>
          <Stack spacing={1}>
            <Typography sx={{ typography: 'caption', opacity: 0.48 }}>Account Holder</Typography>
            <Typography sx={{ typography: 'subtitle1' }}>{cardHolder}</Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography sx={{ typography: 'caption', opacity: 0.48 }}>Valid Dates</Typography>
            <Typography sx={{ typography: 'subtitle1' }}>{cardValid}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

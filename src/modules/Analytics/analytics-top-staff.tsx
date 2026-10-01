import orderBy from 'lodash/orderBy';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';

import { fShortenNumber } from '@/utils/format-number';

import Iconify from '@/components/iconify';
import Label from '@/components/label';

// ----------------------------------------------------------------------

type StaffItem = {
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
  score: number;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  list: StaffItem[];
}

export default function AnalyticsTopStaff({ title, subheader, list, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Stack spacing={3} sx={{ p: 3 }}>
        {orderBy(list, ['score'], ['desc']).map((staff, index) => (
          <StaffItemRow key={staff.id} staff={staff} index={index} />
        ))}
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

type StaffItemRowProps = {
  staff: StaffItem;
  index: number;
};

function StaffItemRow({ staff, index }: StaffItemRowProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar alt={staff.name} src={staff.avatarUrl} />

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" noWrap>
          {staff.name}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
          <Label variant="soft" color="default">
            {staff.role}
          </Label>
          <Typography
            variant="caption"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'text.secondary',
            }}
          >
            <Iconify icon="solar:medal-ribbons-star-bold" width={14} sx={{ mr: 0.5 }} />
            {fShortenNumber(staff.score)} pts
          </Typography>
        </Stack>
      </Box>

      <Iconify
        icon="solar:cup-star-bold"
        sx={{
          p: 1,
          width: 40,
          height: 40,
          borderRadius: '50%',
          color: 'primary.main',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          ...(index === 1 && {
            color: 'info.main',
            bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
          }),
          ...(index === 2 && {
            color: 'warning.main',
            bgcolor: (theme) => alpha(theme.palette.warning.main, 0.08),
          }),
        }}
      />
    </Stack>
  );
}

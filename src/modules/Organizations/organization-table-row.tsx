import { useTranslation } from 'react-i18next';

import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

import { fTaka } from '@/utils/format-number';
import { fDate } from '@/utils/format-time';

import Label from '@/components/label';

import {
  ORGANIZATION_STATUS_COLORS,
  ORGANIZATION_STATUS_LABEL_KEYS,
} from '@/constants/organization.constant';
import type { IOrganizationItem } from '@/interfaces/organization.interface';

// ----------------------------------------------------------------------

type Props = {
  row: IOrganizationItem;
  onViewRow: VoidFunction;
};

export default function OrganizationTableRow({ row, onViewRow }: Props) {
  const { t } = useTranslation('index');

  const {
    title,
    company,
    createdAt,
    vehicleCount,
    ticketsSold,
    staffCount,
    totalEarned,
    totalPaid,
    subscriptionPlan,
    status,
  } = row;

  return (
    <TableRow
      hover
      onClick={onViewRow}
      sx={{
        cursor: 'pointer',
        '& td': { cursor: 'pointer' },
      }}
    >
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          alt={company.name}
          src={company.logo}
          variant="rounded"
          sx={{ width: 40, height: 40, mr: 2, bgcolor: 'background.neutral' }}
        >
          {company.name.charAt(0)}
        </Avatar>

        <ListItemText
          primary={title}
          secondary={t('JOINED_DATE', { date: fDate(createdAt) })}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            component: 'span',
            typography: 'caption',
            color: 'text.disabled',
            noWrap: true,
          }}
        />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{company.phoneNumber}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{vehicleCount}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{ticketsSold}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{staffCount}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap', color: 'success.main', fontWeight: 600 }}>
        {fTaka(totalEarned)}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{fTaka(totalPaid)}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{subscriptionPlan}</TableCell>

      <TableCell>
        <Label variant="soft" color={ORGANIZATION_STATUS_COLORS[status]}>
          {t(ORGANIZATION_STATUS_LABEL_KEYS[status])}
        </Label>
      </TableCell>
    </TableRow>
  );
}

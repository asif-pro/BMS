import { useTranslation } from 'react-i18next';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { alpha } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
import TableContainer from '@mui/material/TableContainer';

import { fTaka } from '@/utils/format-number';
import { fDate, fTime } from '@/utils/format-time';

import Label from '@/components/label';
import Iconify from '@/components/iconify';
import EmptyContent from '@/components/empty-content';
import Scrollbar from '@/components/scrollbar';
import { TableHeadCustom } from '@/components/table';

import { useGetOrganizationTransactions } from '@/hooks/useGetOrganizations.hook';
import type {
  IOrganizationTransaction,
  IOrganizationTransactionCategory,
  IOrganizationTransactionStatus,
} from '@/interfaces/organization.interface';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'description', label: 'DESCRIPTION' },
  { id: 'date', label: 'DATE', width: 160 },
  { id: 'amount', label: 'AMOUNT', width: 140 },
  { id: 'paymentMethod', label: 'PAYMENT_METHOD', width: 160 },
  { id: 'invoiceNumber', label: 'INVOICE_NUMBER', width: 160 },
  { id: 'status', label: 'STATUS', width: 140 },
];

const CATEGORY_ICONS: Record<IOrganizationTransactionCategory, string> = {
  Subscription: 'solar:crown-bold',
  Commission: 'solar:chart-bold',
  Settlement: 'solar:wad-of-money-bold',
  'Setup Fee': 'solar:settings-bold',
  Penalty: 'solar:danger-triangle-bold',
};

const STATUS_LABEL_KEYS: Record<IOrganizationTransactionStatus, string> = {
  completed: 'COMPLETED',
  pending: 'PENDING',
  failed: 'FAILED',
};

type Props = {
  organizationId: string;
};

export default function OrganizationAccountsView({ organizationId }: Props) {
  const { data: transactions = [] } = useGetOrganizationTransactions(organizationId);

  return (
    <Card>
      {transactions.length ? (
        <TableContainer sx={{ overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 1080 }}>
              <TableHeadCustom
                headLabel={TABLE_HEAD}
                sx={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 2,
                  bgcolor: 'background.paper',
                  boxShadow: (theme) => theme.customShadows.z8,
                  '& .MuiTableCell-head': {
                    bgcolor: 'background.paper',
                    borderBottom: (theme) =>
                      `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
                  },
                }}
              />

              <TableBody>
                {transactions.map((row) => (
                  <OrganizationTransactionRow key={row.id} row={row} />
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      ) : (
        <EmptyContent title="NO_DATA" filled sx={{ py: 10, m: 3 }} />
      )}
    </Card>
  );
}

// ----------------------------------------------------------------------

type RowProps = {
  row: IOrganizationTransaction;
};

function OrganizationTransactionRow({ row }: RowProps) {
  const { t } = useTranslation('index');

  return (
    <TableRow hover>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            mr: 2,
            color: 'text.secondary',
            bgcolor: 'background.neutral',
          }}
        >
          <Iconify icon={CATEGORY_ICONS[row.category]} width={24} />
        </Avatar>

        <ListItemText
          primary={row.description}
          secondary={`${row.category} · ${row.ref}`}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            component: 'span',
            typography: 'caption',
            color: 'text.disabled',
            noWrap: true,
          }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(row.date)}
          secondary={fTime(row.date)}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap', color: 'success.main', fontWeight: 600 }}>
        {fTaka(row.amount)}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.paymentMethod}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.invoiceNumber}</TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 'completed' && 'success') ||
            (row.status === 'pending' && 'warning') ||
            'error'
          }
        >
          {t(STATUS_LABEL_KEYS[row.status])}
        </Label>
      </TableCell>
    </TableRow>
  );
}

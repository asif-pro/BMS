import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';
import Badge, { badgeClasses } from '@mui/material/Badge';
import TableContainer from '@mui/material/TableContainer';

import { fTaka } from '@/utils/format-number';
import { fDate, fTime } from '@/utils/format-time';

import Label from '@/components/label';
import Iconify from '@/components/iconify';
import Scrollbar from '@/components/scrollbar';
import { TableHeadCustom } from '@/components/table';

import { CATEGORY_ICONS } from './_mock';
import type { ITransactionItem } from './types';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'description', label: 'Description' },
  { id: 'date', label: 'Date' },
  { id: 'amount', label: 'Amount' },
  { id: 'status', label: 'Status' },
];

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  tableData: ITransactionItem[];
}

export default function AccountRecentTransactions({
  title,
  subheader,
  tableData,
  ...other
}: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 720 }}>
            <TableHeadCustom headLabel={TABLE_HEAD} />

            <TableBody>
              {tableData.map((row) => (
                <AccountRecentTransactionsRow key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <Divider sx={{ borderStyle: 'dashed' }} />
    </Card>
  );
}

// ----------------------------------------------------------------------

type RowProps = {
  row: ITransactionItem;
};

function AccountRecentTransactionsRow({ row }: RowProps) {
  const isIncome = row.type === 'Income';

  return (
    <TableRow>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ position: 'relative', mr: 2 }}>
          <Badge
            overlap="circular"
            color={isIncome ? 'success' : 'error'}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Iconify
                icon={
                  isIncome
                    ? 'eva:diagonal-arrow-left-down-fill'
                    : 'eva:diagonal-arrow-right-up-fill'
                }
                width={16}
              />
            }
            sx={{
              [`& .${badgeClasses.badge}`]: {
                p: 0,
                width: 20,
              },
            }}
          >
            <Avatar
              sx={{
                width: 48,
                height: 48,
                color: 'text.secondary',
                bgcolor: 'background.neutral',
              }}
            >
              <Iconify icon={CATEGORY_ICONS[row.category]} width={24} />
            </Avatar>
          </Badge>
        </Box>

        <ListItemText primary={row.description} secondary={`${row.category} · ${row.ref}`} />
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
          }}
        />
      </TableCell>

      <TableCell sx={{ color: isIncome ? 'success.main' : 'text.primary', whiteSpace: 'nowrap' }}>
        {isIncome ? '+' : '-'}
        {fTaka(row.amount)}
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 'completed' && 'success') ||
            (row.status === 'pending' && 'warning') ||
            'error'
          }
        >
          {row.status}
        </Label>
      </TableCell>
    </TableRow>
  );
}

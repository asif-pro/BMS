import { useTranslation } from 'react-i18next';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import TableContainer from '@mui/material/TableContainer';

import { fDate } from '@/utils/format-time';
import { fCurrency } from '@/utils/format-number';

import Label from '@/components/label';
import EmptyContent from '@/components/empty-content';
import Scrollbar from '@/components/scrollbar';
import { TableHeadCustom } from '@/components/table';

import type { ICustomerTripHistoryItem } from './types';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'route', label: 'ROUTE' },
  { id: 'traveledAt', label: 'DATE' },
  { id: 'busNumber', label: 'BUS' },
  { id: 'seat', label: 'SEAT' },
  { id: 'price', label: 'PRICE' },
  { id: 'status', label: 'STATUS' },
];

type Props = {
  trips: ICustomerTripHistoryItem[];
};

function statusColor(status: ICustomerTripHistoryItem['status']) {
  if (status === 'completed') {
    return 'success';
  }
  if (status === 'upcoming') {
    return 'info';
  }
  return 'error';
}

function statusLabel(status: ICustomerTripHistoryItem['status'], t: (key: string) => string) {
  if (status === 'canceled') {
    return t('CANCELLED');
  }
  return t(status.toUpperCase());
}

export default function CustomerTripHistory({ trips }: Props) {
  const { t } = useTranslation('index');

  return (
    <Card>
      <CardHeader title={t('TRIP_HISTORY')} sx={{ mb: 2 }} />

      {trips.length ? (
        <TableContainer sx={{ overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 720 }}>
              <TableHeadCustom headLabel={TABLE_HEAD} />

              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={trip.id} hover>
                    <TableCell>{trip.route}</TableCell>
                    <TableCell>{fDate(trip.traveledAt)}</TableCell>
                    <TableCell>{trip.busNumber}</TableCell>
                    <TableCell>{trip.seat}</TableCell>
                    <TableCell>{fCurrency(trip.price)}</TableCell>
                    <TableCell>
                      <Label variant="soft" color={statusColor(trip.status)}>
                        {statusLabel(trip.status, t)}
                      </Label>
                    </TableCell>
                  </TableRow>
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

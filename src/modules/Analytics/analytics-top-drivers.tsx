import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import TableContainer from '@mui/material/TableContainer';

import { fNumber, fTaka } from '@/utils/format-number';

import Label from '@/components/label';
import Scrollbar from '@/components/scrollbar';
import { TableHeadCustom } from '@/components/table';

// ----------------------------------------------------------------------

export type TopDriverRow = {
  id: string;
  name: string;
  avatarUrl: string;
  route: string;
  trips: number;
  rating: number;
  revenue: number;
  rank: string;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  tableData: TopDriverRow[];
  tableLabels: {
    id: string;
    label: string;
    align?: 'left' | 'right' | 'center';
  }[];
}

export default function AnalyticsTopDrivers({
  title,
  subheader,
  tableData,
  tableLabels,
  ...other
}: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 720 }}>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData.map((row) => (
                <TopDriverRowItem key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}

// ----------------------------------------------------------------------

type TopDriverRowItemProps = {
  row: TopDriverRow;
};

function TopDriverRowItem({ row }: TopDriverRowItemProps) {
  return (
    <TableRow>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={row.name} src={row.avatarUrl} sx={{ mr: 2 }} />
        {row.name}
      </TableCell>

      <TableCell>{row.route}</TableCell>

      <TableCell align="center">{fNumber(row.trips)}</TableCell>

      <TableCell align="center">
        <Rating size="small" value={row.rating} precision={0.1} readOnly />
      </TableCell>

      <TableCell align="right">{fTaka(row.revenue)}</TableCell>

      <TableCell align="right">
        <Label
          variant="soft"
          color={
            (row.rank === 'Top 1' && 'primary') ||
            (row.rank === 'Top 2' && 'info') ||
            (row.rank === 'Top 3' && 'success') ||
            (row.rank === 'Top 4' && 'warning') ||
            'error'
          }
        >
          {row.rank}
        </Label>
      </TableCell>
    </TableRow>
  );
}

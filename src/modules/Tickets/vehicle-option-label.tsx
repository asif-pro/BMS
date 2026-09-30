import Box from '@mui/material/Box';

import type { TicketVehicleOption } from './_mock';

// ----------------------------------------------------------------------

type Props = {
  option: TicketVehicleOption;
};

export default function VehicleOptionLabel({ option }: Props) {
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'baseline', gap: 0.75 }}>
      <Box component="span" sx={{ typography: 'body2' }}>
        {option.busNumber}
      </Box>
      <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
        {option.busModel}
      </Box>
    </Box>
  );
}

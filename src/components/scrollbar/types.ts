import { Props as SimpleBarProps } from 'simplebar-react';

import { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface ScrollbarProps extends SimpleBarProps {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

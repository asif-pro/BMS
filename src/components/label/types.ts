// ----------------------------------------------------------------------

export type LabelColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export type LabelVariant = 'filled' | 'outlined' | 'soft';

export type LabelProps = {
  children?: React.ReactNode;
  endIcon?: React.ReactElement;
  startIcon?: React.ReactElement;
  sx?: object;
  color?: LabelColor;
  variant?: LabelVariant;
};

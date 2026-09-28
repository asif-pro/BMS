import { Theme } from '@mui/material/styles';
import { ButtonProps } from '@mui/material/Button';

// ----------------------------------------------------------------------

// Standard MUI utility classes for LoadingButton
const loadingButtonClasses = {
  loadingIndicatorStart: 'MuiLoadingButton-loadingIndicatorStart',
  loadingIndicatorEnd: 'MuiLoadingButton-loadingIndicatorEnd',
};

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingIndicator?: React.ReactNode;
  loadingPosition?: 'start' | 'end' | 'center';
}

export function loadingButton(theme: Theme) {
  return {
    MuiLoadingButton: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: LoadingButtonProps }) => ({
          ...(ownerState.variant === 'soft' && {
            [`& .${loadingButtonClasses.loadingIndicatorStart}`]: {
              left: 10,
            },
            [`& .${loadingButtonClasses.loadingIndicatorEnd}`]: {
              right: 14,
            },
            ...(ownerState.size === 'small' && {
              [`& .${loadingButtonClasses.loadingIndicatorStart}`]: {
                left: 10,
              },
              [`& .${loadingButtonClasses.loadingIndicatorEnd}`]: {
                right: 10,
              },
            }),
          }),
        }),
      },
    },
  };
}

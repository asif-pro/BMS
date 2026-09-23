import { Theme } from '@mui/material/styles';

export function stepper(theme: Theme) {
  return {
    MuiStepConnector: {
      styleOverrides: {
        root: {
          [`&.Mui-active .MuiStepConnector-line`]: {
            borderLeft: `1px dashed ${theme.palette.success.main}`,
          },
          [`&.Mui-completed .MuiStepConnector-line`]: {
            borderLeft: `1px dashed ${theme.palette.success.main}`,
          },
        },
        line: {
          borderLeftColor: theme.palette.divider, 
          borderLeftStyle: 'dashed',
          borderLeftWidth: 1,
        },
      },
    },
   MuiStepIcon: {
      styleOverrides: {
        root: {
          color: theme.palette.grey[300],             
          '&.Mui-active': {
            color: theme.palette.success.main,
          },
          '&.Mui-completed': {
            color: theme.palette.success.main,
          },
        },
      },
    },
  };
}

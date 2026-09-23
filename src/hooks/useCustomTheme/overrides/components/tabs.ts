import { type Theme } from '@mui/material/styles';
import { tabClasses } from '@mui/material/Tab';


export function tabs(theme: Theme) {
  return {
    MuiTabs: {
      styleOverrides: {
        scrollButtons: {
          width: 48,
          borderRadius: '50%',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          ...theme.typography.subtitle2,
          padding: 0,
          opacity: 1,
          minWidth: 48,
          minHeight: 48,
          textTransform: 'none',
          '&:not(:last-of-type)': {
            marginRight: theme.spacing(3),
            [theme.breakpoints.up(0)]: {
              marginRight: theme.spacing(3),
            },
          },
           [`&.${tabClasses.selected}`]: {
            color: theme.palette.text.primary,
          },
          [`&:not(.${tabClasses.selected})`]: {
            ...theme.typography.subtitle2,
            color: theme.palette.text.secondary
          },
        },
      },
    },
  };
}

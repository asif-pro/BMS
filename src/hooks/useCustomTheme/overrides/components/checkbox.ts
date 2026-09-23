import { type Theme } from '@mui/material/styles';
import { checkboxClasses } from '@mui/material/Checkbox';

export function checkbox(theme: Theme) {
  return {
    MuiCheckbox: {
      styleOverrides: {
        root: () => {
          return {
            '& .MuiSvgIcon-root': {
              fontSize: 25,
              borderRadius: 4,
            },
            [`&.${checkboxClasses.checked}`]: {
              color: theme.palette.text.secondary,
            },

            [`&.${checkboxClasses.disabled}`]: {
              color: theme.palette.text.disabled,
            },
          };
        },
      },
    },
  };
}

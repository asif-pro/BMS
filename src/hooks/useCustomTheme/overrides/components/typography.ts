import { type Theme } from '@mui/material/styles';

export function typography(theme: Theme) {
  return {
    MuiTypography: {
      styleOverrides: {
        defaultProps: {
          variantMapping: {
            h1: 'h1',
            h2: 'h2',
            h3: 'h3',
            h4: 'h4',
            h5: 'h5',
            h6: 'h6',
            subtitle1: 'subtitle1',
            subtitle2: 'subtitle12',
            body1: 'body1',
            body2: 'body2',
            body3: 'body',
            caption: 'caption',
            overline: 'overline',
          },
        },

        paragraph: {
          marginBottom: theme.spacing(2),
        },
        gutterBottom: {
          marginBottom: theme.spacing(1),
        },
      },
    },
  };
}

import { buttonClasses, type ButtonProps } from '@mui/material/Button';
import { alpha, type Theme } from '@mui/material/styles';
import { COMMON } from '../../colors/commonColorPalette';

const COLORS = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    soft: true;
  }
}

export function button(theme: Theme) {
  const lightMode = theme.palette.mode === 'light';

  const rootStyles = (ownerState: ButtonProps) => {
    const inheritColor = ownerState.color === 'inherit';

    const containedVariant = ownerState.variant === 'contained';

    const outlinedVariant = ownerState.variant === 'outlined';

    const textVariant = ownerState.variant === 'text';

    const softVariant = ownerState.variant === 'soft';

    const smallSize = ownerState.size === 'small';

    const mediumSize = ownerState.size === 'medium';

    const largeSize = ownerState.size === 'large';

    const defaultStyle = {
      // padding: 0,
      // paddingTop: 3,
      fontFamily: 'RT Rondelle Bold',
      lineHeight: 0,
      ...(inheritColor && {
        // CONTAINED
        ...(containedVariant && {
          color: lightMode ? theme.palette.common.white : theme.palette.grey[800],
          backgroundColor: lightMode ? theme.palette.grey[800] : theme.palette.common.white,
          '&:hover': {
            backgroundColor: lightMode ? theme.palette.grey[700] : theme.palette.grey[400],
          },
        }),
        // OUTLINED
        ...(outlinedVariant && {
          color: theme.palette.primary.main,
        }),
        // SOFT
        ...(softVariant && {
          color: theme.palette.text.primary,
          backgroundColor: alpha(theme.palette.grey[500], 0.08),
          '&:hover': {
            backgroundColor: alpha(theme.palette.grey[500], 0.24),
          },
        }),
      }),

      textTransform: 'none' as const,
    };

    const colorStyle = COLORS.map((color) => ({
      ...(ownerState.color === color && {
        ...(containedVariant && {
          backgroundColor: theme.palette.grey[700],
          color: theme.palette.common.white,
          '&:hover': {
            backgroundColor: theme.palette.grey[800],
          },
        }),
        // OUTLINED
        ...(outlinedVariant && {
          '&:hover': {
            backgroundColor: theme.palette.secondary.lighter,
          },
        }),
        // SOFT
        ...(softVariant && {
          color: theme.palette[color][lightMode ? 'dark' : 'light'],
          backgroundColor: alpha(theme.palette[color].main, 0.16),
          '&:hover': {
            backgroundColor: alpha(theme.palette[color].main, 0.32),
          },
        }),
        // TEXT
        ...(textVariant && {
          '&:hover': {
            backgroundColor: COMMON.grey[200],
          },
        }),
      }),
    }));

    const disabledState = {
      [`&.${buttonClasses.disabled}`]: {
        // SOFT
        ...(softVariant && {
          backgroundColor: theme.palette.action.disabledBackground,
        }),
      },
    };
    const textVariantStyles = {
      height: 'fit-content',
      lineHeight: 1,
      paddingTop: 8,
      paddingBottom: 8,
      paddingRight: 8,
      paddingLeft: 8,
      '&:active, &:focus, &:hover, &:visited, &:focus-visible, &:focus-within, &:checked, &:before, &:after,':
        {
          paddingTop: 8,
          paddingBottom: 8,
          paddingRight: 8,
          paddingLeft: 8,
          textTransform: 'none',
        },
    };

    const size = {
      ...(smallSize && {
        height: 30,
        fontSize: 13,
        paddingTop: 3,
        paddingLeft: 8,
        paddingRight: 8,
        ...(textVariant && textVariantStyles),
      }),
      ...(mediumSize && {
        height: 36,
        paddingLeft: 12,
        paddingRight: 12,
        fontWeight: 800,
        ...(textVariant && textVariantStyles),
      }),
      ...(largeSize && {
        height: 48,
        fontSize: 15,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 6,
        ...(textVariant && textVariantStyles),
      }),
    };

    return [defaultStyle, ...colorStyle, disabledState, size];
  };

  return {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: ButtonProps }) => rootStyles(ownerState),
      },
    },
  };
}

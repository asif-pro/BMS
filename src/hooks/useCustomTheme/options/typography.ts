import { type TypographyVariantsOptions } from '@mui/material/styles';

export function pxToRem(value: number) {
  return `${value / 16}rem`;
}

const primaryFontFamily = 'Mena Grotesk Bold';
const secondaryFontFamily = 'RT Rondelle Book';
export const tertiaryFontFamily = 'RT Rondelle Bold';

const typography: TypographyVariantsOptions = {
  h1: {
    fontFamily: primaryFontFamily,
    fontWeight: 700,
    lineHeight: pxToRem(80),
    fontSize: pxToRem(64),
  },
  h2: {
    fontFamily: primaryFontFamily,
    fontWeight: 700,
    lineHeight: pxToRem(64),
    fontSize: pxToRem(48),
  },
  h3: {
    fontFamily: primaryFontFamily,
    fontWeight: 700,
    lineHeight: pxToRem(48),
    fontSize: pxToRem(32),
  },
  h4: {
    fontFamily: primaryFontFamily,
    fontWeight: 700,
    lineHeight: pxToRem(36),
    fontSize: pxToRem(24),
  },
  h5: {
    fontFamily: secondaryFontFamily,
    fontWeight: 360,
    lineHeight: pxToRem(30),
    fontSize: pxToRem(20),
  },
  h6: {
    fontFamily: tertiaryFontFamily,
    fontWeight: 800,
    lineHeight: pxToRem(28),
    fontSize: pxToRem(18),
  },
  subtitle1: {
    fontFamily: tertiaryFontFamily,
    fontWeight: 800,
    lineHeight: pxToRem(24),
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontFamily: tertiaryFontFamily,
    fontWeight: 800,
    lineHeight: pxToRem(22),
    fontSize: pxToRem(14),
  },
  body1: {
    fontFamily: secondaryFontFamily,
    fontWeight: 360,
    lineHeight: pxToRem(24),
    fontSize: pxToRem(16),
  },
  body2: {
    fontFamily: secondaryFontFamily,
    fontWeight: 360,
    lineHeight: pxToRem(22),
    fontSize: pxToRem(14),
  },
  body3: {
    fontFamily: secondaryFontFamily,
    fontWeight: 360,
    lineHeight: pxToRem(16),
    fontSize: pxToRem(10),
  },
  caption: {
    fontFamily: secondaryFontFamily,
    fontWeight: 360,
    lineHeight: pxToRem(18),
    fontSize: pxToRem(12),
  },
  overline: {
    fontFamily: tertiaryFontFamily,
    fontWeight: 800,
    lineHeight: pxToRem(18),
    fontSize: pxToRem(12),
    textTransform: 'uppercase',
  },
};

export default typography;

import createPalette from '@mui/material/styles/createPalette';
import { COMMON } from './commonColorPalette';
declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    neutral: string;
  }
  interface SimplePaletteColorOptions {
    lighter: string;
    darker: string;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
}

const lightColorPalette = createPalette({
  ...COMMON,
  mode: 'light',
  primary: {
    lighter: COMMON.grey[300],
    light: COMMON.grey[400],
    main: COMMON.grey[700],
    dark: COMMON.grey[800],
    darker: COMMON.grey[900],
  },
  secondary: {
    lighter: '#F4F8FB',
    light: '#E9F1F8',
    main: '#B8D2E7',
    dark: '#A6BDD0',
    darker: '#93A8B9',
  },
  text: {
    primary: '#212B36',
    secondary: '#637381',
    disabled: '#919EAB',
  },
  background: {
    default: '#FFF',
    paper: '#FFF',
    neutral: '#F4F6F8',
  },
  success: {
    lighter: '#D8FBDE',
    light: '#86E8AB',
    main: '#36B37E',
    dark: '#1B806A',
    darker: '#0A5554',
  },
  info: {
    lighter: '#8482B1',
    light: '#6D69A2',
    main: '#48448B',
    dark: '#423E7E',
    darker: '#333063',
  },
  warning: {
    lighter: '#F7EA84',
    light: '#F5E56C',
    main: '#F3DF47',
    dark: '#DDCB41',
    darker: '#AD9E32',
  },
  error: {
    lighter: '#EE6B7D',
    light: '#EB4E64',
    main: '#E6223D',
    dark: '#D11F38',
    darker: '#A3182B',
  },
});

export default lightColorPalette;

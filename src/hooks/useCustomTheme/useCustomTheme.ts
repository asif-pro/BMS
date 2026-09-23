import { createTheme, type Theme } from '@mui/material/styles';
import lightColorPalette from './colors/lightColorPalette';
import { customShadows } from './options/customShadows';
import typography from './options/typography';
import componentsOverrides from './overrides';
import { shadows } from './overrides/components/shadows';

const useCustomTheme = (): Theme => {
  const mode: 'light' | 'dark' = 'light';
  const currentColorPalette = lightColorPalette;
  const theme = createTheme({
    typography,
    shape: { borderRadius: 8 },
    palette: currentColorPalette,
    customShadows: customShadows(mode),
    shadows: shadows(mode),
  });

  theme.components = componentsOverrides(theme);

  return theme;
};

export default useCustomTheme;

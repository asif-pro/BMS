import { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ThemeProvider from '@/theme';
import { SettingsProvider } from '@/components/settings';

export const renderRootProvider = (children: ReactNode) => {
  return render(
    <SettingsProvider
      defaultSettings={{
        themeMode: 'light',
        themeDirection: 'ltr',
        themeContrast: 'default',
        themeLayout: 'vertical',
        themeColorPresets: 'default',
        themeStretch: false,
      }}
    >
      <ThemeProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </ThemeProvider>
    </SettingsProvider>
  );
};

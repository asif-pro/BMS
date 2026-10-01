import Box from '@mui/material/Box';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import '@/fonts.css';
import '@/styles/scrollbar.css';

import ThemeProvider from '@/theme';
import { MotionLazy } from '@/components/animate';
import { SnackbarProvider } from '@/components/snackbar';
import { SettingsDrawer, SettingsProvider, SettingsButton } from '@/components/settings';

import tanStackConfig from './configs/tanstack.config';
import AppRouter from './routes/AppRouter';

function App() {
  return (
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
        <MotionLazy>
          <SnackbarProvider>
            <SettingsDrawer />
            <Box
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 1200,
                bgcolor: 'background.paper',
                borderRadius: '50%',
                boxShadow: (theme) => theme.customShadows.z20,
              }}
            >
              <SettingsButton />
            </Box>
            <QueryClientProvider client={tanStackConfig}>
              <ReactQueryDevtools initialIsOpen={false} />
              <AppRouter />
            </QueryClientProvider>
          </SnackbarProvider>
        </MotionLazy>
      </ThemeProvider>
    </SettingsProvider>
  );
}

export default App;

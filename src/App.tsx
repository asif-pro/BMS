import AppRouter from './routes/AppRouter';
import { ThemeProvider } from '@emotion/react';
import useCustomTheme from './hooks/useCustomTheme/useCustomTheme';
import { CssBaseline } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import tanStackConfig from './configs/tanstack.config';

function App() {
  const theme = useCustomTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={tanStackConfig}>
        <ReactQueryDevtools initialIsOpen={false} />
        <AppRouter />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

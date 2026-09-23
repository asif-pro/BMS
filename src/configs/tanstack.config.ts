import { QueryClient } from '@tanstack/react-query';

const tanStackConfig = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default tanStackConfig;

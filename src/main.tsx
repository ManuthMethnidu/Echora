import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NeonAuthProvider } from './context/NeonAuthContext';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';
import '@material/web/all.js';
import '@material/web/typography/md-typescale-styles.css';

// TanStack Query Client for caching server state and avoiding React context repaint lag
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache validity
      gcTime: 1000 * 60 * 30, // 30 minutes garbage collection time
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AppRoot = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <NeonAuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </NeonAuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>
);

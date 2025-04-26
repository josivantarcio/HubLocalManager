import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store, persistor } from '@/store';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Layout } from '@/components/layout/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <Layout>
            <Component {...pageProps} />
            <ToastContainer position="top-right" autoClose={3000} />
          </Layout>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
} 
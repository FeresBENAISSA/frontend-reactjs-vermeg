// import { BrowserRouter } from 'react-router-dom';
// import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store';
// import { AuthProvider } from './context/AuthProvider';
import { PersistGate } from 'redux-persist/integration/react';

// ----------------------------------------------------------------------

export default function App() {
  const [auth, setAuth] = useState('');
  return (
    <ThemeProvider>
      <ScrollToTop />
      <StyledChart />
      <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}
          <Router />
        {/* </PersistGate> */}
      </Provider>
    </ThemeProvider>
  );
}

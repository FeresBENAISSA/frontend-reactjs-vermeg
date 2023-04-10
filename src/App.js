// import { BrowserRouter } from 'react-router-dom';
// import { HelmetProvider } from 'react-helmet-async';
// routes

import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store';
// import { AuthProvider } from './context/AuthProvider';

// ----------------------------------------------------------------------
import { CometChat } from '@cometchat-pro/chat';
import { APP_ID, REGION } from './Constants';


  const appSetting = new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(REGION).build();
  CometChat.init(APP_ID, appSetting).then(
    () => {
      console.log('Initialization completed successfully');
      // You can now call login function.
    },
    (error) => {
      console.log('Initialization failed with error:', error);
      // Check the reason for error and take appropriate action.
    }
  );


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

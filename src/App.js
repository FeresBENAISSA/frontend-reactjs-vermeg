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
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
// ----------------------------------------------------------------------
import { CometChat } from '@cometchat-pro/chat';
import { APP_ID, REGION } from './Constants';
import { PersistGate } from 'redux-persist/integration/react';
import { messaging } from './firebase';
import { getToken } from 'firebase/messaging';

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
  // const [auth, setAuth] = useState('');
  // //  const persistor = persistStore(store);
  // const requestPemission = async()=>{
  //   const permisssion = await  Notification.requestPermission()
  //   if(permisssion ==='granted'){
  //     const token = await getToken(messaging,{vapidKey:''})
  //     console.log("token generated",token)
  //   }else{ 
  //     console.log("not granted")   }
  // }
  // useEffect(()=>{

  // },[])
  
  return (
    <ThemeProvider>
      <ScrollToTop />
      <StyledChart />
      <Provider store={store}>
        {/* without persist gate */}
        <PersistGate loading={null} persistor={persistor}>
          <Router /> 
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}

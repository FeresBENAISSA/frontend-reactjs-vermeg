import ReactDOM from 'react-dom/client';
import App from './App';
import React from 'react';
// import { AuthProvider } from './context/AuthProvider';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// import { Provider } from 'react-redux';
// import { store } from './api/store';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    {/* <Provider store={store}> */}
      <BrowserRouter>
        {/* <AuthProvider> */}
        <App />
        {/* </AuthProvider> */}
      </BrowserRouter>
    {/* </Provider> */}
  </HelmetProvider>
);

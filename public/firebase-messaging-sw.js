importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: 'AIzaSyAuipDx7D4AF7aQi4mG95oztECysILDjf0',
  authDomain: 'pfe-vermeg.firebaseapp.com',
  projectId: 'pfe-vermeg',
  storageBucket: 'pfe-vermeg.appspot.com',
  messagingSenderId: '240176503626',
  appId: '1:240176503626:web:2bc659edd24c85dc2effb3',
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

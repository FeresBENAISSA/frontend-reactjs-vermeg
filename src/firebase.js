import { initializeApp } from 'firebase/app';
import { getMessaging} from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyAuipDx7D4AF7aQi4mG95oztECysILDjf0',
  authDomain: 'pfe-vermeg.firebaseapp.com',
  projectId: 'pfe-vermeg',
  storageBucket: 'pfe-vermeg.appspot.com',
  messagingSenderId: '240176503626',
  appId: '1:240176503626:web:2bc659edd24c85dc2effb3',
};

export const app = initializeApp(firebaseConfig);
export const messaging =getMessaging(app)

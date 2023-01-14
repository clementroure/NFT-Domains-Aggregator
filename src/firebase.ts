import { initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Auth, getAuth, GoogleAuthProvider } from 'firebase/auth';
import {initializeFirestore} from 'firebase/firestore';
import { getMessaging, onMessage, getToken as getTokenMessage, Messaging } from "firebase/messaging";
import { FirebasePerformance, getPerformance } from "firebase/performance";
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaV3Provider, getToken, AppCheck } from "firebase/app-check"
import secureLocalStorage from 'react-secure-storage';

declare global {
  var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string | undefined;
}

if (process.env.NODE_ENV !== 'production') {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

const firebaseConfig = {
  apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
  authDomain: `${process.env.REACT_APP_FIREBASE_AUTH_DOMAIN}`,
  projectId: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}`,
  storageBucket: `${process.env.REACT_APP_FIREBASE_STORAGE_BUCKET}`,
  messagingSenderId: `${process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID}`,
  appId: `${process.env.REACT_APP_FIREBASE_APP_ID}`,
  measurementId: `${process.env.REACT_APP_FIREBASE_MEASUREMENT_ID}`
};

// Initialize Firebase
let auth: Auth;
let storage: FirebaseStorage;
let provider: GoogleAuthProvider;
// let functions: Functions;
let db: Firestore;
let appCheck: AppCheck;
let perf: FirebasePerformance;
let messaging: Messaging;
// try / catch  else  Crash if open In-app-browser (insta / fb)
try{
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  storage = getStorage(app);
  provider = new GoogleAuthProvider();
  // functions = getFunctions(app);
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
  appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(`${process.env.REACT_APP_RECAPTCHA_V3_KEY}`),
    isTokenAutoRefreshEnabled: true
  });
  // Initialize Performance Monitoring and get a reference to the service
  perf = getPerformance(app);
  messaging = getMessaging(app);
}
catch(e:any){}

const getTokenNotif = async (setTokenFound : any) => {

  let currentToken = "";

  try{
    currentToken = await getTokenMessage(messaging, { vapidKey: `${process.env.REACT_APP_MESSAGING_KEY}` });
    secureLocalStorage.setItem("fcm_token", currentToken)
    if(currentToken){
      //setTokenFound(true);
    }
    else{
      //setTokenFound(false);
    }
  }
  catch(error){
    console.log("An error occured while retrieving token. ", error);
  }

  return currentToken;
}

const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload: any) => {
      console.log("payload", payload)
      resolve(payload);
    });
  });

export {auth, db, storage, provider, appCheck, perf, messaging, onMessageListener, getTokenNotif};
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY?.trim() || 'AIzaSyAwAz7_PZJdPhv3-RzBlpyJAeNMjzYF958',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim() || 'alumniappeventsurvey.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim() || 'alumniappeventsurvey',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim() ||
    'alumniappeventsurvey.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim() || '757040815252',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID?.trim() || '1:757040815252:web:63310b388c735b997ce881',
};

export const firebaseFunctionsRegion =
  import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION?.trim() || 'us-central1';

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const firestore = getFirestore(firebaseApp);
export const firebaseFunctions = getFunctions(firebaseApp, firebaseFunctionsRegion);

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

if (!firebaseConfig.apiKey) {
  console.error('[Firebase] Missing Firebase configuration. Please check your .env file.');
  throw new Error('Firebase configuration is incomplete');
}

console.log('[Firebase] Initializing with config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey,
  platform: Platform.OS
});

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  
  console.log('[Firebase] Firebase initialized successfully');
  
  if (Platform.OS === 'web') {
    enableMultiTabIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('[Firebase] Multiple tabs open, persistence enabled in first tab only.');
      } else if (err.code === 'unimplemented') {
        console.warn('[Firebase] Browser does not support persistence.');
      } else {
        console.warn('[Firebase] Failed to enable persistence:', err);
      }
    });
  }
} else {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}

export const storage = getStorage(app);
export { db, auth };

export default app;

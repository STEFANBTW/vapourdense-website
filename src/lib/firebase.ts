import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore, Firestore, setLogLevel } from 'firebase/firestore';
import bundledConfig from '../../firebase-applet-config.json';

// Silence Firestore internal network connection warnings in offline/isolated environments
try {
  setLogLevel('silent');
} catch {
  // ignore
}

/**
 * Firebase web config. If VITE_FIREBASE_PROJECT_ID is set (e.g. in Vercel's Environment
 * Variables), the VITE_FIREBASE_* variables are used. Otherwise the bundled
 * firebase-applet-config.json (the original AI Studio project) is used.
 * These are public web identifiers, not secrets; access is enforced by firestore.rules.
 */
const env = import.meta.env;
const useEnvConfig = Boolean(env.VITE_FIREBASE_PROJECT_ID);

const firebaseConfig = useEnvConfig
  ? {
      apiKey: env.VITE_FIREBASE_API_KEY as string,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN as string,
      projectId: env.VITE_FIREBASE_PROJECT_ID as string,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET as string,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
      appId: env.VITE_FIREBASE_APP_ID as string,
      firestoreDatabaseId: (env.VITE_FIREBASE_DATABASE_ID as string | undefined) || '(default)',
    }
  : bundledConfig;

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const databaseId =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? firebaseConfig.firestoreDatabaseId
    : undefined;

let firestoreDb: Firestore;

try {
  firestoreDb = initializeFirestore(
    app,
    {
      experimentalForceLongPolling: true,
      ignoreUndefinedProperties: true,
    },
    databaseId
  );
} catch {
  firestoreDb = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
}

export const db = firestoreDb;
export { app };

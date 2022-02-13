import { initializeApp } from 'firebase/app';
import {
	getAuth,
	signInAnonymously,
	onAuthStateChanged,
	connectAuthEmulator,
} from 'firebase/auth';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import { connectFunctionsEmulator } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';

import config, { isDev } from './config';

const app = initializeApp(config.firebase);
export const auth = getAuth(app);
console.log(auth);

// Get a reference to the database service
export const database = getDatabase(app);

if (isDev) {
	connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
	connectDatabaseEmulator(database, 'localhost', 9000);
	// connectFunctionsEmulator(function,"localhost",5001);
} else {
	getAnalytics(app);
}

export { signInAnonymously, onAuthStateChanged };
// export { ref, onValue, off, child, update };

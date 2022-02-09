/** This file contains all public configuration variables for different environments. */

const config = {
	development: {
		firebase: {
			apiKey: 'AIzaSyAFq3rd_Eq9KDbENiImKH8QaL5BA3AjgVE',
			authDomain: 'fishy-eqb-df549.firebaseapp.com',
			databaseURL:
				'https://fishy-eqb-df549-default-rtdb.asia-southeast1.firebasedatabase.app',
			projectId: 'fishy-eqb-df549',
			storageBucket: 'fishy-eqb-df549.appspot.com',
			messagingSenderId: '858307839607',
			appId: '1:858307839607:web:c39ff1e9fab68f67fc6872',
		},
	},
	production: {
		firebase: {},
	},
};

/** The environment of the application. */
export const env = process.env.REACT_APP_ENV || 'development';

/** Indicates whether the app is running in development. */
export const isDev = env === 'development';

export default config[env];

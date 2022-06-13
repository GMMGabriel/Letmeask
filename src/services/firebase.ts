import * as firebase from 'firebase/app';

import * as Auth from 'firebase/auth';
import * as Database from 'firebase/database';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
};

const app = firebase.initializeApp(firebaseConfig);

const auth = Auth.getAuth(app);
const database = Database.getDatabase(app);

export { firebase, Auth, auth, Database, database };
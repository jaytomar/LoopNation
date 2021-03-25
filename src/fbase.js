import firebase from "firebase/app"
import "firebase/auth";
import "firebase/firestore"
import 'firebase/storage';

var firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    // databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_URL,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_ID,
    appId: process.env.REACT_APP_APP_ID 
  };

firebase.initializeApp(firebaseConfig)

const firebaseInstance = firebase;
export default firebaseInstance
export const authService = firebase.auth()
export const dbService = firebase.firestore()
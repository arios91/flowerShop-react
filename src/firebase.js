import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
const { initializeAppCheck, ReCaptchaV3Provider, getToken } = require("firebase/app-check");


const firebaseConfig = {
  apiKey: "AIzaSyDRv5LVfWc0icCVb0OwoUQ25jgkipjTCWU",
  authDomain: "petalosarteprod.firebaseapp.com",
  databaseURL: "https://petalosarteprod.firebaseio.com",
  projectId: "petalosarteprod",
  storageBucket: "petalosarteprod.appspot.com",
  messagingSenderId: "1039687597381",
  appId: "1:1039687597381:web:4fb27936c8f0d78f92522c"
};

  const firebase = initializeApp(firebaseConfig);

  const projectFirestore = getFirestore(firebase);



  export {firebase, projectFirestore};
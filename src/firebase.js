import {initializeApp} from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyAMiNHNKa_gzQKuivRwFydgMAZNqB8K9hs",
    authDomain: "petalos-arte.firebaseapp.com",
    databaseURL: "https://petalos-arte.firebaseio.com",
    projectId: "petalos-arte",
    storageBucket: "petalos-arte.appspot.com",
    messagingSenderId: "220047130772",
    appId: "1:220047130772:web:b70df6e5da9d328a643481"
  };

  const firebase = initializeApp(firebaseConfig);
  const projectFirestore = getFirestore(firebase);



  export {firebase, projectFirestore};
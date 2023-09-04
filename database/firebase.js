import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyBQzboP7LWuoNaKlImgPcRazxWbLO1sZMw",
  authDomain: "react-firebase-89082.firebaseapp.com",
  projectId: "react-firebase-89082",
  storageBucket: "react-firebase-89082.appspot.com",
  messagingSenderId: "596318787971",
  appId: "1:596318787971:web:eba34f59c9c9fcdbd5feb6",
  measurementId: "G-3HL6MJ0JVF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export default {
  firebase,
  db
};
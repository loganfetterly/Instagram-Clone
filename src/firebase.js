import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDY8nMD9peU89teQUGM4ZFnmu1pESSknXc",
    authDomain: "instargam-clone.firebaseapp.com",
    databaseURL: "https://instargam-clone.firebaseio.com",
    projectId: "instargam-clone",
    storageBucket: "instargam-clone.appspot.com",
    messagingSenderId: "226624918342",
    appId: "1:226624918342:web:ed47ec961a7283975b4b47",
    measurementId: "G-MLKBF1PBVM"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage, firebase };
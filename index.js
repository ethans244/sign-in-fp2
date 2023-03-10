// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInAnonymously,
  onAuthStateChanged,
  GoogleAuthProvider,
  signOut,
  inMemoryPersistence,
  setPersistence
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import { html, render } from "lit-html";


// TODO: Add SDKs for Firebase products that you want to use


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web firebaseApp's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCw11jrqwWZZl24yqDBdLoS9H3OkNX8VCE",
  authDomain: "my-app-beb62.firebaseapp.com",
  projectId: "my-app-beb62",
  storageBucket: "my-app-beb62.appspot.com",
  messagingSenderId: "38292691836",
  appId: "1:38292691836:web:50df4ebe3462958c8822f9",
  measurementId: "G-MQXEPTYRKZ"
};



const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
console.log(db.toJSON)
const ref = db.ref;
console.log(ref)
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();


// firebaseApp.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
const dbRef = collection(db, "users");
var data = {}

function signInUser() {
  signInWithRedirect(auth, provider);
}

function signInAnon() {
  signInAnonymously(auth)
    .then(() => {

    })
    .catch((error) => {
      console.error(`Error ${error.code}: ${error.message}.`);
    });
}

// This function is called if the Sign Out button is clicked
function signOutUser() {
  signOut(auth)
    .then(() => {
      console.info("Sign out was successful");
    })
    .catch((error) => {
      console.error(`Error ${error.code}: ${error.message}.`);
    });
}

// This function returns a template with the sign in view - what the user sees when they're signed out
function signInView() {
  return html`<button class="sign-in" @click=${signInUser}>
      Sign in with Google
    </button>
    <button class="sign-in" @click=${signInAnon}>Anonymous Sign in</button>`;
}



onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("AUTH STATE CHANGED");
    const uid = user.uid;
    console.log(user.uid);
    data = {
      'UID': uid,
      'name': user.displayName,
      'blocksStacked': 0 
    }
    const docRef = doc(collection(db, "users"))

    
    
   setDoc(docRef, data)
      .then(doc => {
      console.log("Document has been added successfully");
    })
      .catch(error => {
      console.log(error);
    })
    // If there is an authenticated user, we render the normal view
    render(view(), document.body);
  } else {
    // Otherwise, we render the sign in view
    render(signInView(), document.body);
  }
});





// This function returns a template with the sign in view - what the user sees when they're signed out
function view() {
  return html`
      <p>Successful Sign in!</p>
      <button @click=${signOutUser}>Sign Out</button> 
      <a href = ./App.html> Tetris </a>`;
}





render(view(), document.body);
//await setDoc(docRef, data);


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
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  QuerySnapshot,
} from "firebase/firestore";

import { html, render } from "lit-html";
import {styleMap} from 'lit-html/directives/style-map.js';




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
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();
// firebaseApp.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
const dbRef = collection(db, "users");
var docRef = null
var data = {}
var userBlocks = 0;
var topUsers = []





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

  let style1 = {
    marginLeft: '30%',
    marginRight: '30%'
  };

  return html`
  <div style=${styleMap(style1)}>
  <button class="sign-in" @click=${signInUser}>
      Sign in with Google
    </button>
  </div>`
    
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
    docRef = doc(collection(db, "users"), uid)

    console.log(docRef)
    


    getDoc(doc(db, 'users', uid)).then((fields) => {
      userBlocks = fields.data().blocksStacked
      console.log(userBlocks);
      
        
      render(view(userBlocks), document.body);
    }).catch(error => {
      // if user hasn't signed in before, create new doc for them
      console.log(error);
      setDoc(docRef, data)
      render(view(0), document.body);
    });

    

    // If there is an authenticated user, we render the normal view
  } else {
    // Otherwise, we render the sign in view
    render(signInView(), document.body);
  }
});


const q = query(collection(db, "users"), orderBy("blocksStacked", "desc"), limit(3))
const querySnapshot = await getDocs(q)
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  var user = {'name': doc.data().name, 'score': doc.data().blocksStacked}
  topUsers.push(user)
  console.log(doc.id, " => ", doc.data());
});

console.log(user)



// This function returns a template with the sign in view - what the user sees when they're signed out
function view(userBlocks) {
  let styles = {
    color: 'black',
    marginLeft: '30%',
    marginRight: '30%'
  };
  let tableStyles = {
    border: '1px solid black', color: 'white'
  }

  return html`
  <div style=${styleMap(styles)}>
      <p>Successful sign in ${auth.currentUser.displayName}!</p>
      <p>You have stacked a total of ${userBlocks} blocks!</p>
      <button @click=${signOutUser}>Sign Out</button> 
      <button onclick = "window.location.href='App.html';"> Play Tetris </button>
      
      <h2>Top users</h2>
      <table style="background-color: gray; ${styleMap(tableStyles)}">
        <tr>
          <th style=${styleMap(tableStyles)}>Username</th>
          <th style=${styleMap(tableStyles)}>Score</th> 
        </tr>
        <tr style=${styleMap(tableStyles)}>
          <td style=${styleMap(tableStyles)}>${topUsers[0].name}</td>
          <td style=${styleMap(tableStyles)}>${topUsers[0].score}</td> 
        </tr>
        <tr>
          <td style=${styleMap(tableStyles)}>${topUsers[1].name}</td>
          <td style=${styleMap(tableStyles)}>${topUsers[1].score}</td> 
        </tr>
        <tr>
          <td style=${styleMap(tableStyles)}>${topUsers[2].name}</td>
          <td style=${styleMap(tableStyles)}>${topUsers[2].score}</td> 
        </tr>
      </table>
    </div>
      
      
      
      
      `;
}




render(view(), document.body);
//await setDoc(docRef, data);


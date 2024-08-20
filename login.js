// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHpUFRe3EHVhEOba5hcgXwgLh7hKtYVKE",
  authDomain: "apna-wheels.firebaseapp.com",
  projectId: "apna-wheels",
  storageBucket: "apna-wheels.appspot.com",
  messagingSenderId: "29153661889",
  appId: "1:29153661889:web:0d9cfd255f1d81fe9cd540",
  measurementId: "G-XC5GHWD7T6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();

let email = document.getElementById("email");
let password = document.getElementById("password");

window.loginUser = () => {
  let obj = {
    email: email.value,
    password: password.value,
  };
  signInWithEmailAndPassword(auth, obj.email, obj.password)
    .then(async (res) => {
      const id = res.user.uid;
      const refernce = doc(db, "users", id);
      const snap = await getDoc(refernce);
      if (snap.exists()) {
        localStorage.setItem("user", JSON.stringify(snap.data()));
        window.location.replace("../index.html");
      } else {
        alert("Data Not Found");
      }
    })
    .catch((error) => {
      alert(error);
    });
};

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
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

let name = document.getElementById("name");
let email = document.getElementById("email");
let password = document.getElementById("password");

window.signupUser = () => {
  let obj = {
    name: name.value,
    email: email.value,
    password: password.value,
  };
  console.log(obj);

  createUserWithEmailAndPassword(auth, obj.email, obj.password)
    .then((res) => {
      obj.id = res.user.uid;
      obj.userType = "user";
      delete obj.password;

      const refernce = doc(db, "users", obj.id);
      setDoc(refernce, obj)
        .then(() => {
          const userObj = JSON.stringify(obj);
          localStorage.setItem("user", userObj);
          window.location.replace("../index.html");
        })
        .catch((err) => {
          alert(err.message);
        });
    })
    .catch((error) => {
      alert(error);
    });
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Your web app's Firebase configuration
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
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.getElementById("loginLink");
    const signupLink = document.getElementById("signupLink");
    const logoutBtn = document.getElementById("logoutBtn");
    const uploadLink = document.getElementById("uploadLink"); 

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            if (loginLink) loginLink.style.display = "none";
            if (signupLink) signupLink.style.display = "none";
            if (uploadLink) uploadLink.style.display = "block"; 
            if (logoutBtn) logoutBtn.style.display = "inline-block";
        } else {
            // User is not signed in
            if (loginLink) loginLink.style.display = "inline-block";
            if (signupLink) signupLink.style.display = "inline-block";
            if (uploadLink) uploadLink.style.display = "none"; 
            if (logoutBtn) logoutBtn.style.display = "none";
        }
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            signOut(auth).then(() => {
                window.location.replace('/login/login.html');
            }).catch((error) => {
                console.error('Logout failed:', error);
            });
        });
    }
});

// Function to render blog posts
const renderBlogPosts = (posts) => {
    const blogContainer = document.getElementById("blogContainer");
    if (!blogContainer) return;

    blogContainer.innerHTML = "";
    posts.forEach((post) => {
        blogContainer.innerHTML += `
        <div class="bg-white shadow-md rounded-lg overflow-hidden mb-4">
            <div class="p-4">
                <h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">By ${post.author}</h3>
                <h2 class="text-gray-900 title-font text-lg font-medium">${post.title}</h2>
                <p class="mt-1 text-gray-700">${post.description}</p>
            </div>
        </div>
        `;
    });
};

// Function to fetch blog posts from Firestore
const fetchBlogPosts = async () => {
    const blogPosts = [];
    const querySnapshot = await getDocs(collection(db, "blogPosts"));
    querySnapshot.forEach((doc) => {
        blogPosts.push({
            id: doc.id,
            ...doc.data()
        });
    });
    renderBlogPosts(blogPosts);
};

fetchBlogPosts();

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', async function () {
    const postForm = document.getElementById('postForm');
    const userPosts = document.getElementById('userPosts');
    const signOutButton = document.getElementById('signOutButton');
    let currentUser;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            loadUserPosts(user.uid);
        } else {
            window.location.href = "login.html";
        }
    });

    signOutButton.addEventListener('click', async function () {
        try {
            await signOut(auth);
            window.location.href = "Login/login.html";
        } catch (error) {
            alert(error);
        }
    });

    postForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        createPost();
    });

    async function createPost() {
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        if (title && content) {
            try {
                await addDoc(collection(db, 'posts'), {
                    title: title,
                    content: content,
                    author: currentUser.email,
                    userId: currentUser.uid,
                    createdAt: new Date(),
                });
                postForm.reset();
                loadUserPosts(currentUser.uid);
            } catch (error) {
                console.error("Error adding post: ", error);
            }
        }
    }

    async function loadUserPosts(uid) {
        userPosts.innerHTML = '';
        try {
            const postsSnapshot = await getDocs(collection(db, 'posts'));
            postsSnapshot.forEach((doc) => {
                const post = doc.data();
                if (post.userId === uid) {
                    const postElement = document.createElement('div');
                    postElement.classList.add('bg-white', 'p-4', 'rounded', 'shadow');

                    postElement.innerHTML = `
                        <h2 class="text-2xl font-bold mb-2">${post.title}</h2>
                        <p class="mb-4">${post.content}</p>
                        <p class="text-gray-500 text-sm">Author: ${post.author}</p>
                        <button class="editPost bg-yellow-500 text-white p-2 rounded mr-2" data-id="${doc.id}">Edit</button>
                        <button class="deletePost bg-red-500 text-white p-2 rounded" data-id="${doc.id}">Delete</button>
                    `;

                    postElement.querySelector('.editPost').addEventListener('click', () => editPost(doc.id, post));
                    postElement.querySelector('.deletePost').addEventListener('click', () => deletePost(doc.id));

                    userPosts.appendChild(postElement);
                }
            });
        } catch (error) {
            console.error("Error loading user posts: ", error);
        }
    }

    async function deletePost(id) {
        if (confirm("Are you sure you want to delete this post?")) {
            try {
                await deleteDoc(doc(db, 'posts', id));
                loadUserPosts(currentUser.uid);
            } catch (error) {
                console.error("Error deleting post: ", error);
            }
        }
    }

    function editPost(id, post) {
        document.getElementById('title').value = post.title;
        document.getElementById('content').value = post.content;

        postForm.removeEventListener('submit', createPost);
        postForm.addEventListener('submit', async function updatePost(e) {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const content = document.getElementById('content').value;

            try {
                await updateDoc(doc(db, 'posts', id), {
                    title: title,
                    content: content,
                });
                postForm.reset();
                loadUserPosts(currentUser.uid);
                postForm.removeEventListener('submit', updatePost);
                postForm.addEventListener('submit', createPost);
            } catch (error) {
                console.error("Error updating post: ", error);
            }
        });
    }
});

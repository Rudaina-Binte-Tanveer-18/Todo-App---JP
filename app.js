import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyATNORpqmhIU8ZoAbd5NuqJmyw8sN7TZjI",
    authDomain: "todo-app-6bc8f.firebaseapp.com",
    projectId: "todo-app-6bc8f",
    storageBucket: "todo-app-6bc8f.firebasestorage.app",
    messagingSenderId: "904028218196",
    appId: "1:904028218196:web:765e6a5899c98ef0b41ec1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Authentication functions
window.signup = function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
        window.location.replace("login.html");
    })
    .catch((error) => {
      alert(error.message);
    });
}

window.login = function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
        window.location.replace("todo.html");
    })
    .catch((error) => {
      alert(error.message);
    });
}

// To-Do functions
window.addTodo = function addTodo() {
  const userId = auth.currentUser.uid;
  const todoText = document.getElementById("todoInput").value; // Moved inside addTodo
  
  if (!todoText) return; // Check for empty input
  
  const todoRef = push(ref(database, "todos/" + userId));
  set(todoRef, { text: todoText, completed: false })
    .then(() => {
      document.getElementById("todoInput").value = "";
      loadTodos(); // Optionally reload todos after adding
    })
    .catch((error) => {
      console.error("Error adding todo:", error);
    });
}

// Load To-Dos function
window.loadTodos = function loadTodos() {
  const userId = auth.currentUser?.uid;
 
  if (!userId) return; // Ensure user is logged in
  const todoRef = ref(database, "todos/" + userId);
  onValue(todoRef, (snapshot) => {
    const todos = snapshot.val();
    console.log("Todos retrieved:", todos);
    
    const todoList = document.getElementById("todoList");
    todoList.innerHTML = "";

    if (todos) {
      for (let id in todos) {
        const todo = todos[id];
        const li = document.createElement("li");
        li.textContent = todo.text;
        todoList.appendChild(li);
      }
    } else {
      console.log("No todos found.");
    }
  });
}

// Monitor auth state and load todos on login
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadTodos(); // Load todos if user is authenticated
    document.getElementById("todoApp").style.display = "block";
  } else {
    document.getElementById("todoApp").style.display = "none";
    if (window.location.pathname.endsWith("todo.html")) {
      window.location.replace("login.html"); // Redirect if not logged in
    }
  }
});

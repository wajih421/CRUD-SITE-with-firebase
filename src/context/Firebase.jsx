import { createContext, useContext, useEffect, useState } from "react";

import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAb3aKkqCvEjQz9gVUTSR4UBi-pRJO29AY",
  authDomain: "crud-site-c5fad.firebaseapp.com",
  projectId: "crud-site-c5fad",
  storageBucket: "crud-site-c5fad.firebasestorage.app",
  messagingSenderId: "339572646134",
  appId: "1:339572646134:web:488d302a56790a282f0cd7",
  databaseURL: "https://crud-site-c5fad-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);
const database = getDatabase(app);

const googleProvider = new GoogleAuthProvider();

const FirebaseContext = createContext(null);

export function FirebaseProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState([]);

  // ===========================
  // Authentication
  // ===========================

  function signupUserWithEmailAndPassword(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function loginUserWithEmailAndPassword(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signInWithGoogle() {
    return signInWithPopup(auth, googleProvider);
  }

  function logout() {
    return signOut(auth);
  }

  // ===========================
  // Firestore CRUD
  // ===========================

  async function addStudent(data) {
    await addDoc(collection(firestore, "students"), data);
    fetchStudents();
  }

  async function getStudents() {
    return await getDocs(collection(firestore, "students"));
  }

  async function updateStudent(id, data) {
    await updateDoc(doc(firestore, "students", id), data);
    fetchStudents();
  }

  async function deleteStudent(id) {
    await deleteDoc(doc(firestore, "students", id));
    fetchStudents();
  }

  async function fetchStudents() {
    const snapshot = await getStudents();

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setStudents(data);
  }

  // ===========================
  // Auth State
  // ===========================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <FirebaseContext.Provider
      value={{
        user,
        loading,
        students,

        signupUserWithEmailAndPassword,
        loginUserWithEmailAndPassword,
        signInWithGoogle,
        logout,

        addStudent,
        getStudents,
        updateStudent,
        deleteStudent,
        fetchStudents,

        firestore,
        database,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  return useContext(FirebaseContext);
}
//Web version 8
// Import the functions you need from the SDKs you need

import firebase from "firebase/compat/app";
import "firebase/firestore";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";

import "firebase/compat/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDB6smWT1AOmxqhtne8RwjiiyqoonuM9Pk',
  authDomain: 'messagemobileapp.firebaseapp.com',
  databaseURL: 'https://messagemobileapp-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'messagemobileapp',
  storageBucket: 'messagemobileapp.appspot.com',
  messagingSenderId: '442606130770',
  appId: '1:442606130770:web:db7e939557995d5175b18b',
  measurementId: 'G-DZGZ1PBE7C',
};

firebase.initializeApp(firebaseConfig);
// Initialize Cloud Storage and get a reference to the service
const storage = firebase.storage();
// Create a storage reference from our storage service
export const storageRef = storage.ref();

export default firebase;

// //storage
// export async function upload(file, currentUser, setLoading) {
//   const fileRef = ref(storage, currentUser.uid + ".png");

//   const snapshot = await uploadBytes(fileRef, file);
// }

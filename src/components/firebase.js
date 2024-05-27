import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAZf747sG5-2v93kQL7bZkokVKaKxsy68k",
  authDomain: "alfapac-omega.firebaseapp.com",
  databaseURL: "https://alfapac-omega-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "alfapac-omega",
  storageBucket: "alfapac-omega.appspot.com",
  messagingSenderId: "10306486100",
  appId: "1:10306486100:web:4da8c84e5ed3b8fa6092c1",
  measurementId: "G-7159Y6NHGX"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };

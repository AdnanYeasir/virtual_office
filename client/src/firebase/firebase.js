// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDauC5xywKpwLy_WBOj6aaIVr0tAa0z4Rs",
//   authDomain: "oa-virtoffice-project.firebaseapp.com",
//   projectId: "oa-virtoffice-project",
//   storageBucket: "oa-virtoffice-project.appspot.com",
//   messagingSenderId: "416890512159",
//   appId: "1:416890512159:web:59d7b08b2333270e6f062a",
//   measurementId: "G-JDJCEPS4YH"
// };
const firebaseConfig = {
  apiKey: "AIzaSyAi-oegQBHPyxuIl48CX17a82kDQKmae78",
  authDomain: "oa-openavenue-charactermove.firebaseapp.com",
  databaseURL: "https://oa-openavenue-charactermove-default-rtdb.firebaseio.com",
  projectId: "oa-openavenue-charactermove",
  storageBucket: "oa-openavenue-charactermove.appspot.com",
  messagingSenderId: "367061697718",
  appId: "1:367061697718:web:1e3a59bb8bf6e325559217",
  measurementId: "G-WL0VLNT1Z8"
};


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const firebaseDatabase = getDatabase(firebaseApp);

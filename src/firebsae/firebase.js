// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCo36653_q9st4pjka96PVS3-Au7oBrxbc",
  authDomain: "crushes-c0878.firebaseapp.com",
  projectId: "crushes-c0878",
  storageBucket: "crushes-c0878.firebasestorage.app",
  messagingSenderId: "319058586718",
  appId: "1:319058586718:web:3fdfda46ffa90c6cf3d8cf",
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

module.exports = {
  firebaseConfig,
};

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Votre configuration Firebase sera insérée ici
const firebaseConfig = {
    apiKey: "AIzaSyDbXZWq09UuHOc8F_6gi74l4ETNuTlttgg",
    authDomain: "budget-app-5b778.firebaseapp.com",
    projectId: "budget-app-5b778",
    storageBucket: "budget-app-5b778.firebasestorage.app",
    messagingSenderId: "206521021044",
    appId: "1:206521021044:web:c2773ca87ebcb508c3d721"  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 
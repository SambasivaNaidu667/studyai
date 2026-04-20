import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics, isSupported } from 'firebase/analytics'


const firebaseConfig = {
  apiKey: "AIzaSyB3SQT3q4GdlnfuprUfhlUyWwugArTGSMo",
  authDomain: "studyai-d7953.firebaseapp.com",
  projectId: "studyai-d7953",
  storageBucket: "studyai-d7953.firebasestorage.app",
  messagingSenderId: "727290966308",
  appId: "1:727290966308:web:78eff2ef141e406ab6c3b1",
  measurementId: "G-4HJ8Y7JY4H"
};


const app = initializeApp(firebaseConfig)


isSupported().then(yes => yes ? getAnalytics(app) : null).catch(() => {})

export const auth = getAuth(app)
export const db = getFirestore(app)
export default app

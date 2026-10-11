import { initializeApp } from 'firebase/app'
import { getFirestore, deleteDoc, doc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDeDUkfBiRRqYQqFLZROCFXHYKS6me7pLk',
  authDomain: 'sharan-24586.firebaseapp.com',
  projectId: 'sharan-24586',
  storageBucket: 'sharan-24586.firebasestorage.app',
  messagingSenderId: '187873106688',
  appId: '1:187873106688:web:46caaab84802bd533731e5',
  measurementId: 'G-VPFHM2YEZW',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

await deleteDoc(doc(db, 'bookings', 't53xOLPbaYLlWYJEGHeE'))
console.log('Deleted test bookings doc.')
process.exit(0)

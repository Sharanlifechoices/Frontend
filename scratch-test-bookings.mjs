import { initializeApp } from 'firebase/app'
import { getFirestore, addDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore'

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

try {
  const docRef = await addDoc(collection(db, 'bookings'), {
    name: 'TEST_PERMISSION_CHECK',
    email: 'test@example.com',
    phone: '+65 0000 0000',
    service: 'Numerology',
    date: '2099-01-01',
    slot: '11:00 AM',
    status: 'paid',
    paymentId: 'TEST_BYPASS_' + Date.now(),
    createdAt: new Date().toISOString(),
  })
  console.log('SUCCESS writing to bookings, doc id:', docRef.id)
} catch (err) {
  console.log('FAILED writing to bookings:', err.code, err.message)
}

try {
  const snap = await getDocs(query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(1)))
  console.log('Read back bookings ok, count sample:', snap.docs.length)
} catch (err) {
  console.log('FAILED reading bookings:', err.code, err.message)
}

process.exit(0)

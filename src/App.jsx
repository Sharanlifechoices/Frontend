import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, Suspense, lazy } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BookSession from './components/BookSession'
import ContactUs from './components/ContactUs'
import RetreatsContact from './components/RetreatsContact'
import RequireAuth from './components/auth/RequireAuth'

const Home = lazy(() => import('./pages/Home'))
const Numerology = lazy(() => import('./pages/Numerology'))
// TODO: BioGeometry temporarily removed, re-enable when ready
// const BioGeometry = lazy(() => import('./pages/BioGeometry'))
const MeditationBreathwork = lazy(() => import('./pages/MeditationBreathwork'))
const ChakraReading = lazy(() => import('./pages/ChakraReading'))
const Retreats = lazy(() => import('./pages/Retreats'))
const About = lazy(() => import('./pages/About'))
const ComingSoon = lazy(() => import('./pages/ComingSoon'))
const Books = lazy(() => import('./pages/Books'))
const BookDetail = lazy(() => import('./pages/BookDetail'))
const Admin = lazy(() => import('./pages/Admin'))
const WizTec = lazy(() => import('./pages/WizTec'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Login = lazy(() => import('./pages/auth/Login'))
const Signup = lazy(() => import('./pages/auth/Signup'))
const VerifyOtp = lazy(() => import('./pages/auth/VerifyOtp'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'))
const Profile = lazy(() => import('./pages/auth/Profile'))
const Cart = lazy(() => import('./pages/Cart'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname === '/secretadmin'
  const isRetreats = pathname === '/retreats'

  if (isAdmin) {
    return (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    )
  }

  return (
    <>
      <div className="stars-bg" />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundImage: 'url(https://res.cloudinary.com/dbb5nj0ht/image/upload/f_auto,q_auto,w_1920,c_limit/v1781609382/site/backgrounds/bg1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.30, pointerEvents: 'none' }} />
      <ScrollToTop />
      <Navbar />
      <main>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/numerology" element={<Numerology />} />
            {/* TODO: BioGeometry temporarily removed, re-enable when ready */}
            {/* <Route path="/biogeometry" element={<BioGeometry />} /> */}
            <Route path="/meditation-breathwork" element={<MeditationBreathwork />} />
            <Route path="/chakra-reading" element={<ChakraReading />} />
            <Route path="/retreats" element={<Retreats />} />
            <Route path="/about" element={<About />} />
            <Route path="/books" element={<Books />} />
            <Route path="/books/:bookId" element={<BookDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/wiztec" element={<WizTec />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email" element={<VerifyOtp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      {isRetreats ? <RetreatsContact /> : <ContactUs />}
      <BookSession />
    </>
  )
}

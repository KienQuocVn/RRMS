import { lazy } from 'react'
import { Route } from 'react-router-dom'

const Detail = lazy(() => import('../pages/detail/Detail'))
const Home = lazy(() => import('../pages/Home/Home'))
const Chart = lazy(() => import('../pages/charts/Chart'))
const Search = lazy(() => import('../pages/search/Search'))
const GoogleLoginRedirect = lazy(() => import('../pages/auth/Login/GoogleLoginRedirect'))
const Login = lazy(() => import('../pages/auth/Login/Login'))
const Register = lazy(() => import('../pages/auth/Register/Register'))
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword/ForgotPassword'))
const Support = lazy(() => import('../pages/Support/Support'))
const Contact = lazy(() => import('../pages/contact/Contact'))
const Introduce = lazy(() => import('../pages/Introduce/Introduce'))
const Profile = lazy(() => import('../pages/Profile/Profile'))
const PaymentPage = lazy(() => import('../pages/cart/PaymentPage'))
const Heart = lazy(() => import('../pages/cart/Heart'))
const RRMS = lazy(() => import('../pages/RRMS/RRMS'))
const Audio = lazy(() => import('../pages/ai/Audio'))
const Recognition = lazy(() => import('../pages/ai/Recognition'))
const FaceMatch = lazy(() => import('../pages/ai/FaceMatch'))
const ImageComparison = lazy(() => import('../pages/ai/ImageComparison'))
const PassportRecognition = lazy(() => import('../pages/ai/PassportRecognition'))
const RatingHistory = lazy(() => import('../pages/RatingHistory/RatingHistory'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage/NotFoundPage.jsx'))

const PublicRoutes = ({ auth }) => {
  const { username, setUsername, setAvatar, setIsAdmin } = auth

  return (
    <>
      <Route path="*" element={<NotFoundPage styled />} />
      <Route path="/" element={<Home setIsAdmin={setIsAdmin} />} />
      <Route path="/login" element={<Login setUsername={setUsername} setAvatar={setAvatar} setIsAdmin={setIsAdmin} />} />
      <Route path="/oauth2/redirect" element={<GoogleLoginRedirect />} />
      <Route path="/forgot-password" element={<ForgotPassword setIsAdmin={setIsAdmin} />} />
      <Route path="/register" element={<Register setIsAdmin={setIsAdmin} />} />
      <Route path="/search" element={<Search setIsAdmin={setIsAdmin} />} />
      <Route path="/detail/:bulletinBoardId" element={<Detail setIsAdmin={setIsAdmin} />} />
      <Route path="/contact" element={<Contact setIsAdmin={setIsAdmin} />} />
      <Route path="/introduce" element={<Introduce setIsAdmin={setIsAdmin} />} />
      <Route path="/profile" element={<Profile setIsAdmin={setIsAdmin} username={username} />} />
      <Route path="/payment" element={<PaymentPage setIsAdmin={setIsAdmin} />} />
      <Route path="/support" element={<Support setIsAdmin={setIsAdmin} />} />
      <Route path="/heart" element={<Heart setIsAdmin={setIsAdmin} />} />
      <Route path="/RRMS" element={<RRMS setIsAdmin={setIsAdmin} />} />
      <Route path="/rating-history" element={<RatingHistory setIsAdmin={setIsAdmin} />} />
      <Route path="/chart" element={<Chart setIsAdmin={setIsAdmin} />} />
      <Route path="/audio" element={<Audio setIsAdmin={setIsAdmin} />} />
      <Route path="/image" element={<ImageComparison setIsAdmin={setIsAdmin} />} />
      <Route path="/recognition" element={<Recognition setIsAdmin={setIsAdmin} />} />
      <Route path="/facematch" element={<FaceMatch setIsAdmin={setIsAdmin} />} />
      <Route path="/passport" element={<PassportRecognition setIsAdmin={setIsAdmin} />} />
    </>
  )
}

export default PublicRoutes

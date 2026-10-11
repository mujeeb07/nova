import { Routes, Route } from 'react-router-dom';
import './App.css'
import { ForgotPasswordPage } from './pages/shared/ForgotPasswordPage';
import { ForgotPasswordVerifyPage } from './pages/shared/ForgotPasswordVerifyPage';
import { ForgotPasswordCreatePage } from './pages/shared/ForgotPasswordCreatePage';
import { roleConfigs } from './config/roleConfig';
// pages.
import { UserLoginPage } from './pages/user/UserLoginPage';
import { UserHomePage } from './pages/user/UserHomePage';
import { UserVerifyOtpPage } from './pages/user/UserVerifyOtpPage';
import { UserRegisterPage } from './pages/user/UserRegisterPage';
import { useSessionBootstrap } from './features/auth/hooks/useSessionBootstrap';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { VendorLoginPage } from './pages/vendor/VendorLoginPage';
import { VendorRegisterPage } from './pages/vendor/VendorRegisterPage';
import { VendorVerifyOtpPage } from './pages/vendor/VendorVerifyOtpPage';
import VendorsLandingPage from './pages/vendor/VendorsLandingPage';

function App() {
  useSessionBootstrap()
  return (
    <Routes>
      {/* ---------USER--------- */}
      <Route path="/login" element={<UserLoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage config={roleConfigs.user} routeBase="/forgot-password" />} />
      <Route path="/forgot-password/verify" element={<ForgotPasswordVerifyPage config={roleConfigs.user} routeBase="/forgot-password" />} />
      <Route path="/forgot-password/create" element={<ForgotPasswordCreatePage config={roleConfigs.user} routeBase="/forgot-password" loginPath="/login" />} />
      <Route path="/home" element={<UserHomePage />} />
      <Route path="/register" element={<UserRegisterPage />} />
      <Route path="/verify-otp" element={<UserVerifyOtpPage />} />


      {/* ---------VENDOR--------- */}
      <Route path="/vendor/login" element={<VendorLoginPage />} />
      <Route path='/vendor/register' element={<VendorRegisterPage/>} />
      <Route path='/vendor/verify-otp' element={<VendorVerifyOtpPage/>} />
      <Route path="/vendor/forgot-password" element={<ForgotPasswordPage config={roleConfigs.vendor} routeBase="/forgot-password" />} />
      <Route path="/vendor/forgot-password/verify" element={<ForgotPasswordVerifyPage config={roleConfigs.vendor} routeBase="/forgot-password" />} />
      <Route path="/vendor/forgot-password/create" element={<ForgotPasswordCreatePage config={roleConfigs.vendor} routeBase="/forgot-password" loginPath="/login" />} />

    {/* PROTECTED ROUTES */}
    <Route element={<ProtectedRoute role="vendor" loginPath="/vendor/login" />}>
      <Route path="/vendor/home" element={<VendorsLandingPage />}/>
    </Route>
    </Routes>
  )
}

export default App;
import { Routes, Route } from 'react-router-dom';
import './App.css'
import { UserLoginPage } from './pages/user/UserLoginPage';
import { ForgotPasswordPage } from './pages/shared/ForgotPasswordPage';
import { ForgotPasswordVerifyPage } from './pages/shared/ForgotPasswordVerifyPage';
import { ForgotPasswordCreatePage } from './pages/shared/ForgotPasswordCreatePage';
import { roleConfigs } from './config/roleConfig';

function App() {
  return (
    <Routes>
      {/* ---------USER--------- */}
      <Route path="/login" element={<UserLoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage config={roleConfigs.user} routeBase="/forgot-password" />} />
      <Route path="/forgot-password/verify" element={<ForgotPasswordVerifyPage config={roleConfigs.user} routeBase="/forgot-password" />} />
      <Route path="/forgot-password/create" element={<ForgotPasswordCreatePage config={roleConfigs.user} routeBase="/forgot-password" loginPath="/login" />} />

      {/* ---------VENDOR--------- */}
      {/* <Route path="/vendor/login" element={<VendorLoginPage />} /> */}
      <Route path="/vendor/login" element={<UserLoginPage />} />
      <Route path="/vendor/forgot-password" element={<ForgotPasswordPage config={roleConfigs.vendor} routeBase="/forgot-password" />} />
      <Route path="/vendor/forgot-password/verify" element={<ForgotPasswordVerifyPage config={roleConfigs.vendor} routeBase="/forgot-password" />} />
      <Route path="/vendor/forgot-password/create" element={<ForgotPasswordCreatePage config={roleConfigs.vendor} routeBase="/forgot-password" loginPath="/login" />} />


    </Routes>
  )
}

export default App;
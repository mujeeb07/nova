import { Routes, Route } from 'react-router-dom';
import './App.css'
import { UserLoginPage } from './pages/user/UserLoginPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<UserLoginPage />} />
    </Routes>
  )
}

export default App;
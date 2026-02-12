import { BrowserRouter, Routes, Route } from 'react-router';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import HomePage from './pages/HomePage';
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Signup" element={<SignUpPage />} />
        <Route path="/Signin" element={<SignInPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { BrowserRouter, Routes, Route } from 'react-router';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/auth/protectedRoute';
import { useEffect } from 'react';

import { useThemeStore } from './stores/useThemeStore';


function App() {
  const { isDarkMode, setTheme } = useThemeStore();
  useEffect(() => {
    setTheme(isDarkMode);
  }, [isDarkMode]);
  


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

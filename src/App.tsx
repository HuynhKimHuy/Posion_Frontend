import { BrowserRouter, Routes, Route } from 'react-router';
import { useEffect } from 'react';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/auth/protectedRoute';
import { useAuthStore } from './stores/useAuthStore';

function App() {
  useEffect(() => {
    const initAuth = async () => {
      const savedAuth = localStorage.getItem('auth-storage');
      if (savedAuth) {
        try {
          const authData = JSON.parse(savedAuth);
          const { accessToken, user } = authData?.state || {};

          // Restore saved state
          if (accessToken) {
            useAuthStore.setState({ accessToken });
          }
          if (user) {
            useAuthStore.setState({ user });
          }

          // If has token but no user, fetch user info
          if (accessToken && !user) {
            await useAuthStore.getState().fetchMe(accessToken);
          }
        } catch (error) {
          console.log('Error restoring auth:', error);
        }
      }
    };

    initAuth();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Signup" element={<SignUpPage />} />
        <Route path="/Signin" element={<SignInPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

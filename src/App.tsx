import { Suspense,  } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import { BrowserRouter, Navigate } from 'react-router-dom';
import Home from "./pages/home";
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import routes from "tempo-routes";

function App() {
  const { user } = useAuth();
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
      <Routes>
        {/* If not logged in, redirect / → /login */} 
        <Route path="/" element={<LandingPage />} />

        {/* If already logged in, redirect /login → /notes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/home" replace /> : <LoginPage />}
        />

        {/* If already logged in, redirect /register → /notes */}
        <Route
          path="/register"
          element={user ? <Navigate to="/home" replace /> : <RegisterPage />}
        />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Page />
            </PrivateRoute>
          }
        />

        {/* Catch-all redirects to either /notes or /login */}
        <Route
          path="*"
          element={<Navigate to={user ? '/notes' : '/login'} replace />}
        />
      </Routes>
      </Suspense>
        { import.meta.env.VITE_TEMPO === "true" && useRoutes(routes) }
      </>
    </Suspense >
  );
}

export default App;

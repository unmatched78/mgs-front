import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Home from "./pages/shop-dashboard";
import VetDashboard from "./pages/vet-dashboard";
import ClientDashboard from "./pages/client-dashboard";  
import SupplierDashboard from "./pages/supplier-dashboard";
// Importing the necessary components and hooks

function App() {
  const { user } = useAuth();
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/home" replace /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/home" replace /> : <RegisterPage />} />
        <Route
          path="/home"
          element={<PrivateRoute allowedRole="shop" children={<Home />} />}
        />
        <Route path="*" element={<Navigate to={user ? "/home" : "/login"} replace />} />
        {/* <Route
          path="/vet-dashboard"
          element={<PrivateRoute allowedRole="vet" children={<VetDashboard />} />}
        />
        <Route
          path="/client-dashboard"
          element={<PrivateRoute allowedRole="client" children={<ClientDashboard />} />}
        />
        <Route
          path="/supplier-dashboard"
          element={<PrivateRoute allowedRole="supplier" children={<SupplierDashboard />} />}
        /> */}
      </Routes>
    </Suspense>
  );
}

export default App;
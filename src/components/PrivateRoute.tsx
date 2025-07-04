// // src/components/PrivateRoute.tsx
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import type { ReactNode } from 'react';

// interface PrivateRouteProps {
//   children: ReactNode;
// }

// export default function PrivateRoute({ children }: PrivateRouteProps) {
//   const { user, loading } = useAuth();
//   const location = useLocation();

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-gray-500">Loading…</p>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return <>{children}</>;
// }
// src/components/PrivateRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
  allowedRole: 'shop' | 'vet' | 'client' | 'supplier';
}

export default function PrivateRoute({ children, allowedRole }: PrivateRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (!user) {
    console.log("No user, redirecting to /login from:", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to the user's role-specific dashboard if role doesn't match
  if (user.role !== allowedRole) {
    console.log(`User role ${user.role} does not match allowed role ${allowedRole}, redirecting`);
    const target =
      user.role === 'shop' ? '/shop-dashboard' :
      user.role === 'vet' ? '/vet-dashboard' :
      user.role === 'client' ? '/client-dashboard' :
      user.role === 'supplier' ? '/supplier-dashboard' : '/';
    return <Navigate to={target} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ThreeCinemaBackground from "./ThreeCinemaBackground";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-[#080911] text-gray-100 selection:bg-primary selection:text-white">
      {/* 3D WebGL Three.js Particle Galaxy & Depth Field */}
      <ThreeCinemaBackground />

      {/* Floating 3D Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 z-10 relative">
        <Outlet />
      </main>

      {/* 3D Themed Cinema Footer */}
      <Footer />
    </div>
  );
}

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-bold text-sm">Authenticating 3D Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function AdminRoute() {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-bold text-sm">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

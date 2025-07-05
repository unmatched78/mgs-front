// src/components/LogoutButton.tsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out…");
    try {
      // 1) Clear auth state & tokens
      logout();

      // 2) Redirect
      navigate("/");

      // 3) Success feedback
      toast.success("Logged out successfully", { id: toastId });
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed. Please try again.", { id: toastId });
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      Logout
    </Button>
  );
};

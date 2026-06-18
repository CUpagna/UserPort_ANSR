import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import your new context!

export default function ProtectedRoute({ children }) {
  const { user } = useAuth(); // Check if a user actually exists

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
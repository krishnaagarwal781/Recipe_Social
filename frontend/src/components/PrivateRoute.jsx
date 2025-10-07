import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-xl font-semibold">Loading...</div>; // Or a spinner
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

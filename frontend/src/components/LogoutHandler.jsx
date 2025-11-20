import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Initiating logout process...');
    // Clear authentication tokens
    localStorage.removeItem('token');
    console.log('Token removed. Redirecting to home page...');
    // Redirect to home page with replace to reset history
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
};

export default LogoutHandler;
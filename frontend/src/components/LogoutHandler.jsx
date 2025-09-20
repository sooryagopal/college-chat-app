import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutHandler = ({ handleLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    handleLogout();
    navigate('/login');
  }, [handleLogout, navigate]);

  return null;
};

export default LogoutHandler;
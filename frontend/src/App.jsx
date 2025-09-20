import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSocket } from './lib/socket';
import LoginCard from './components/LoginCard';
import ChatInterface from './components/ChatInterface';
import HomePage from './components/HomePage';
import CreateAccount from './components/CreateAccount';
import LogoutHandler from './components/LogoutHandler';
import Account from './components/Account';
import Navigation from './components/Navigation'; // Added this import
import { loginUser, registerUser, fetchCurrentUser } from './lib/api';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]); // 🟢 MENTOR ADVICE: Keep messages state here
  const [error, setError] = useState(null);
  const socket = useSocket('http://localhost:5001');

  // This useEffect now handles session persistence
  useEffect(() => {
    const checkSession = async () => {
      try {
        const userData = await fetchCurrentUser();
        setCurrentUser(userData);
      } catch (err) {
        console.error('No valid session found.');
        localStorage.removeItem('token');
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (currentUser && socket) {
      socket.on('receiveMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
    return () => {
      if (socket) {
        socket.off('receiveMessage');
      }
    };
  }, [currentUser, socket]);

  const handleLogin = async (email, password) => {
    try {
      const userData = await loginUser(email, password);
      localStorage.setItem('token', userData.token);
      setCurrentUser(userData);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  const handleSignup = async (name, email, password, role) => {
    try {
      const userData = await registerUser(name, email, password, role);
      localStorage.setItem('token', userData.token);
      setCurrentUser(userData);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Sign up failed.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setMessages([]);
  };

  return (
    <Router>
      <Navigation currentUser={currentUser} handleLogout={handleLogout} /> {/* Added Navigation component here */}
      <Routes>
        <Route path="/" element={<HomePage currentUser={currentUser} />} />
        <Route 
          path="/login" 
          element={
            currentUser ? 
            <Navigate to="/" /> : 
            <LoginCard handleLogin={handleLogin} error={error} />
          } 
        />
        <Route 
          path="/chat" 
          element={
            currentUser ? 
            <ChatInterface
              currentUser={currentUser}
              messages={messages}
              handleLogout={handleLogout}
              setMessages={setMessages}
            /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/create-account" 
          element={
            currentUser?.role === 'Admin' ? 
            <CreateAccount currentUser={currentUser} /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/account" 
          element={
            currentUser ? 
            <Account currentUser={currentUser} handleLogout={handleLogout} /> : 
            <Navigate to="/login" />
          }
        />
        <Route 
          path="/logout" 
          element={
            <LogoutHandler handleLogout={handleLogout} />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
import { useState, useEffect } from 'react';
import { useSocket } from './lib/socket';
import LoginCard from './components/LoginCard';
import ChatInterface from './components/ChatInterface';
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

  if (!currentUser) {
    return <LoginCard handleLogin={handleLogin} handleSignup={handleSignup} error={error} />;
  }

  return (
    <ChatInterface
      currentUser={currentUser}
      messages={messages} // 🟢 MENTOR ADVICE: Pass the messages state down
      handleLogout={handleLogout}
      setMessages={setMessages} // 🟢 MENTOR ADVICE: Pass setMessages down
    />
  );
};

export default App;
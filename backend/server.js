import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import chatRoutes from './src/routes/chat.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Get the client URL from environment variables for production
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Socket.IO server setup
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({
  origin: CLIENT_URL,
}));
app.use(express.json());

// Pass the 'io' instance to the request object so routes can access it.
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is running' });
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a group (e.g., a specific batch or department)
  socket.on('joinGroup', (groupName) => {
    socket.join(groupName);
    console.log(`User ${socket.id} joined group: ${groupName}`);
  });

  // Leave a group
  socket.on('leaveGroup', (groupName) => {
    socket.leave(groupName);
    console.log(`User ${socket.id} left group: ${groupName}`);
  });

  // Handle read receipts
  socket.on('markAsRead', ({ messageId, userId }) => {
    io.emit('readReceipt', { messageId, userId });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
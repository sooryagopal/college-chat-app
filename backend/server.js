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

// Socket.IO server setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Allow frontend to connect
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

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

  // Listen for new messages
  socket.on('sendMessage', (message) => {
    const { group, ...msgData } = message;
    // Broadcast the message to all clients in the group
    io.to(group).emit('receiveMessage', msgData);
    console.log(`Message sent to group ${group}: ${msgData.text}`);
  });

  // Handle read receipts (conceptual)
  socket.on('markAsRead', ({ messageId, userId }) => {
    // In a real application, you would update the message in the database
    // to mark it as read by the user.
    io.emit('readReceipt', { messageId, userId });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

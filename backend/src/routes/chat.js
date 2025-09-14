import express from 'express';
import User from '../models/User.js';
import Message from '../models/Message.js';
import Group from '../models/Group.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all users (for sidebar)
router.get('/users', protect, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all groups for a specific user
router.get('/groups', protect, async (req, res) => {
  try {
    const { role, department, batch } = req.user;
    let groups = [];

    if (role === 'Admin') {
      groups = await Group.find({});
    } else if (role === 'HOD') {
      groups = await Group.find({
        $or: [
          { type: 'Global' },
          { type: 'Department', department: department }
        ]
      });
    } else if (role === 'Advisor') {
      groups = await Group.find({
        $or: [
          { type: 'Global' },
          { type: 'Batch', batch: batch }
        ]
      });
    } else if (role === 'Student') {
      groups = await Group.find({
        $or: [
          { type: 'Global' },
          { type: 'Batch', batch: batch }
        ]
      });
    }

    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a specific group with permission checks
router.get('/messages/:groupName', protect, async (req, res) => {
  try {
    const { groupName } = req.params;
    const { role, department, batch } = req.user;

    // Check user's permission to view the group
    const group = await Group.findOne({ name: groupName });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    let hasPermission = false;
    if (role === 'Admin' || group.type === 'Global') {
      hasPermission = true;
    } else if (role === 'HOD' && group.department === department) {
      hasPermission = true;
    } else if ((role === 'Advisor' || role === 'Student') && group.batch === batch) {
      hasPermission = true;
    }

    if (!hasPermission) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to view this group.' });
    }

    const messages = await Message.find({ group: groupName }).populate('sender', 'name role department');
    res.json(messages);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to send a new message
router.post('/messages', protect, async (req, res) => {
  try {
    const { groupName, text } = req.body;
    const sender = req.user._id;

    // Find the group
    const group = await Group.findOne({ name: groupName });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Add permission checks based on your project idea
    const userRole = req.user.role;
    const userDepartment = req.user.department;
    const userBatch = req.user.batch;

    let hasPermission = false;

    // Admin can send to any group
    if (userRole === 'Admin') {
      hasPermission = true;
    }
    // HODs can send to their department's groups and Global
    else if (userRole === 'HOD' && (group.type === 'Global' || group.department === userDepartment)) {
      hasPermission = true;
    }
    // Advisors can send to their batch group and Global
    else if (userRole === 'Advisor' && (group.type === 'Global' || group.batch === userBatch)) {
      hasPermission = true;
    }

    // Students are read-only
    if (!hasPermission) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to send messages to this group.' });
    }

    // Save the message to the database
    const newMessage = await Message.create({
      sender,
      text,
      group: groupName
    });

    // Populate sender info for the broadcast
    const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'name role department');

    // Broadcast the message via Socket.IO
    req.io.to(groupName).emit('receiveMessage', populatedMessage);

    res.status(201).json(populatedMessage);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
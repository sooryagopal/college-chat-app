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

    // MENTOR ADVICE: We will fetch messages based on the user's role and the selected group
    let messages = [];

    // Check if the user has permission to view the requested group
    let hasPermission = false;
    if (role === 'Admin') {
      hasPermission = true;
    } else if (role === 'HOD') {
      hasPermission = (groupName === 'Global' || groupName === department);
    } else if (role === 'Advisor' || role === 'Student') {
      // Students can view Global, their department, and their batch
      hasPermission = (groupName === 'Global' || groupName === department || groupName === `${batch}${department}`);
    }

    if (!hasPermission) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to view this group.' });
    }

    // MENTOR ADVICE: Fetch messages from the batch group and the department group
    if (role === 'Student' || role === 'Advisor') {
      const batchGroup = `${batch}${department}`;

      // If the user selects their batch group, get both batch and department messages
      if (groupName === batchGroup) {
        const batchMessages = await Message.find({ group: batchGroup }).populate('sender', 'name role department');
        const departmentMessages = await Message.find({ group: department }).populate('sender', 'name role department');

        // Combine and sort messages by creation date
        messages = [...batchMessages, ...departmentMessages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else {
        // If the user selects a different group (like 'AID' or 'Global'), just get messages from that group
        messages = await Message.find({ group: groupName }).populate('sender', 'name role department');
      }
    } else {
      // For other roles (Admin, HOD), just get messages from the selected group
      messages = await Message.find({ group: groupName }).populate('sender', 'name role department');
    }

    res.json(messages);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
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

    // Create a new message and save it to the database
    const newMessage = await Message.create({
      sender,
      text,
      group: groupName,
    });

    // Populate the sender details for the real-time broadcast
    const populatedMessage = await newMessage.populate('sender', 'name role department');

    // Broadcast the message via Socket.IO
    req.io.to(groupName).emit('receiveMessage', populatedMessage);

    res.status(201).json(populatedMessage);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
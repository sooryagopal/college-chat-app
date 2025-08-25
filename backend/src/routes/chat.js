import express from 'express';
import User from '../models/User.js';
import Message from '../models/Message.js';
import Group from '../models/Group.js';
import { protect } from '../middleware/authMiddleware.js';

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

// Get all groups
router.get('/groups', protect, async (req, res) => {
  try {
    const groups = await Group.find({});
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a specific group
router.get('/messages/:groupName', protect, async (req, res) => {
  try {
    const { groupName } = req.params;
    const messages = await Message.find({ group: groupName }).populate('sender', 'name role department');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

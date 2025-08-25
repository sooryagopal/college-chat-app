import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Message from './src/models/Message.js';
import Group from './src/models/Group.js';
import bcrypt from 'bcryptjs';
import connectDB from './src/config/db.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Message.deleteMany({});
    await Group.deleteMany({});
    console.log('Existing data cleared.');

    // Create initial users
    const users = [
      { name: 'Admin User', email: 'admin.00adm@kongu.edu', password: 'password123', role: 'Admin', batch: '2000', department: 'ADM' },
      { name: 'HOD User', email: 'hod.23aid@kongu.edu', password: 'password123', role: 'HOD', batch: '2023', department: 'AID' },
      { name: 'Advisor User', email: 'advisor.24ece@kongu.edu', password: 'password123', role: 'Advisor', batch: '2024', department: 'ECE' },
      { name: 'Soorya G', email: 'sooryag.23aid@kongu.edu', password: 'password123', role: 'Student', batch: '2023', department: 'AID' },
      { name: 'Alice', email: 'alice.24ece@kongu.edu', password: 'password123', role: 'Student', batch: '2024', department: 'ECE' },
      { name: 'Rahul', email: 'rahul.25cse@kongu.edu', password: 'password123', role: 'Student', batch: '2025', department: 'CSE' },
    ];

    for (const user of users) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }

    const createdUsers = await User.insertMany(users);
    console.log('Users seeded.');

    // Create initial groups
    const groups = [
      { name: 'Global', type: 'Global' },
      { name: '23AID', type: 'Batch', department: 'AID', batch: '2023' },
      { name: '24ECE', type: 'Batch', department: 'ECE', batch: '2024' },
      { name: '25CSE', type: 'Batch', department: 'CSE', batch: '2025' },
      { name: 'AID', type: 'Department', department: 'AID' },
      { name: 'ECE', type: 'Department', department: 'ECE' },
      { name: 'CSE', type: 'Department', department: 'CSE' },
    ];
    await Group.insertMany(groups);
    console.log('Groups seeded.');

    // Create initial messages
    const messages = [
      {
        sender: createdUsers[0]._id, // Admin
        text: 'Welcome to the Kongu College Chat App! This is a global announcement.',
        group: 'Global',
      },
      {
        sender: createdUsers[1]._id, // HOD
        text: 'Important notice for all AID students. Please check your timetable.',
        group: 'AID',
      },
      {
        sender: createdUsers[2]._id, // Advisor
        text: 'ECE 2024 students, class tomorrow is at 10 AM.',
        group: '24ECE',
      },
    ];
    await Message.insertMany(messages);
    console.log('Messages seeded.');

    console.log('Database seeding complete!');
  } catch (err) {
    console.error(`Seeding error: ${err.message}`);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();

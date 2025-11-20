# College Chat Application

A real-time chat application designed specifically for college communication, featuring role-based access control and domain-specific authentication. This full-stack application is built using the MERN stack (MongoDB, Express.js, React, Node.js) with real-time messaging capabilities using Socket.IO.

## 🚀 Features

### Authentication & Authorization
- Domain-specific email authentication (restricted to `kongu.edu` domain)
- Role-based access control
- Secure JWT-based authentication
- Password encryption using bcrypt

### Real-time Communication
- Instant messaging using WebSocket (Socket.IO)
- Group chat functionality
- Real-time message updates
- Message history preservation

### User Interface
- Modern, responsive design using Tailwind CSS
- Intuitive chat interface
- Role badges for user identification
- Clean and user-friendly message composition
- Navigation with React Router

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Real-time Communication**: Socket.IO
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt
- **Environment Variables**: dotenv

### Frontend
- **Framework**: React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **WebSocket Client**: Socket.IO Client
- **Routing**: React Router DOM

## 📁 Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── config/
│   │   └── db.js           # Database configuration
│   ├── constants/
│   │   └── roles.js        # User role definitions
│   ├── middleware/
│   │   └── authMiddleware.js # Authentication middleware
│   ├── models/
│   │   ├── Group.js        # Group schema
│   │   ├── Message.js      # Message schema
│   │   └── User.js         # User schema
│   ├── routes/
│   │   ├── auth.js         # Authentication routes
│   │   └── chat.js         # Chat-related routes
│   └── utils/
│       └── parseEmail.js    # Email validation utilities
├── server.js               # Main server file
└── seed.js                 # Database seeding script
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Account.jsx        # User account management
│   │   ├── ChatInterface.jsx  # Main chat interface
│   │   ├── Composer.jsx       # Message composition
│   │   ├── CreateAccount.jsx  # Registration form
│   │   ├── HomePage.jsx       # Landing page
│   │   ├── LoginCard.jsx      # Login form
│   │   ├── MessageFeed.jsx    # Message display
│   │   ├── MessageItem.jsx    # Individual message
│   │   ├── Navigation.jsx     # Navigation bar
│   │   └── RoleBadge.jsx      # User role display
│   ├── lib/
│   │   ├── api.js            # API integration
│   │   └── socket.js         # WebSocket configuration
│   └── utils/
│       └── groupLogic.js     # Group management logic
├── App.jsx                    # Main application component
└── main.jsx                   # Application entry point
```

## 🔧 Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn package manager

### Environment Variables
Create a `.env` file in the backend directory with the following variables:
```
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
DOMAIN=kongu.edu
```

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/sooryagaid/college-chat-app.git
cd college-chat-app
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Start the backend server:
```bash
cd ../backend
npm run dev
```

5. Start the frontend development server:
```bash
cd ../frontend
npm run dev
```

## 🔐 Security Features

- Domain-restricted email validation
- JWT token-based authentication
- Password hashing using bcrypt
- Protected API routes using middleware
- Secure WebSocket connections

## 💻 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Chat
- `GET /api/chat/messages` - Fetch chat messages
- `POST /api/chat/message` - Send new message
- `GET /api/chat/groups` - Fetch user groups

## 🎮 Socket Events

### Client Events
- `join_room` - Join a chat room
- `send_message` - Send a new message
- `typing` - User typing indication

### Server Events
- `receive_message` - New message received
- `user_joined` - User joined notification
- `typing_status` - Typing status update

## 👥 User Roles

- **Student**: Basic chat access
- **Faculty**: Additional moderation capabilities
- **Admin**: Full system access

## 🛡️ Future Enhancements

1. End-to-end encryption for messages
2. File sharing capabilities
3. Voice and video chat integration
4. Message search functionality
5. User presence indicators
6. Message read receipts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

- **Soorya** - *Initial work* - [sooryagaid](https://github.com/sooryagaid)

---

## 🙏 Acknowledgments

- Thanks to all contributors who helped in developing this application
- Special thanks to Kongu Engineering College for the support
- React and Node.js communities for excellent documentation and resources

For additional information or queries, please open an issue in the repository.
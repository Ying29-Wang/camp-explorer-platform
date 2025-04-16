# Camp Explorer Platform

A comprehensive platform for discovering and managing summer camps, built with React, Node.js, and MongoDB.

## Authors

### Backend Developer
- **Ying Wang**
  - Email: wang.ying17@northeastern.edu

### Frontend Developer
- **Dominic Ejiogu**
  - Email: ejiogu.d@northeastern.edu

## Live Demo

- https://camp-explorer-platform.onrender.com/

## Features

### Core Features
- User registration and authentication
- Role-based access control (Parents, Camp Owners, Admin)
- Profile management
- Camp search and discovery
- Interactive map integration with OpenStreetMap
- Review and rating system
- Responsive design for all devices

### User Management
- Profile customization
- Child profile management for parents
- Review management (create, edit, delete)
- Bookmarks and recently viewed camps

### Camp Management
- Create and manage camp listings
- Detailed camp information display
- Location-based camp discovery
- Image upload and management
- Contact information management
- Activity and schedule management

### Admin Features
- User management and role control
- Camp listing moderation
- System monitoring and maintenance

## Tech Stack

### Frontend
- React.js with Vite
- React Router for navigation
- Context API for state management
- Material-UI (MUI) components
- Axios for API communication
- OpenStreetMap integration
- CSS Modules for styling

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- RESTful API design
- Image processing and storage
- Geolocation services

## API Features

### Authentication
- JWT-based secure authentication
- Session management
- Protected routes
- Role-based access control

### Data Operations
- CRUD operations for camps
- User profile management
- Review system
- Bookmark functionality
- Search and filtering
- Geolocation services

### Security
- Input validation
- Data sanitization
- Error handling
- Rate limiting
- CORS protection

## Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- OpenStreetMap API key

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/camp-explorer-platform.git
cd camp-explorer-platform
```

2. Install dependencies:
```bash
npm run install-all
```

3. Set up environment variables:
   - Create `.env` files in both client and server directories
   - Add required environment variables (see Environment Variables section)

4. Start the development servers:
```bash
# Option 1: Start both client and server from root directory
npm run dev

# Option 2: Start servers separately
npm run server  # In root directory
npm run client  # In root directory
```

5. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001

## Project Structure

```
camp-explorer-platform/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── assets/             # Static assets (images, fonts, etc.)
│   │   ├── components/         # Reusable React components
│   │   │   ├── common/        # Shared components
│   │   │   ├── features/      # Feature-specific components
│   │   │   └── layout/        # Layout components
│   │   ├── config/            # Configuration files
│   │   ├── constants/         # Constants and enums
│   │   ├── context/           # React Context providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service functions
│   │   ├── utils/             # Utility functions
│   │   ├── App.jsx            # Main App component
│   │   ├── App.css            # Global styles
│   │   ├── main.jsx           # Application entry point
│   │   ├── index.css          # Base styles
│   │   └── routes.jsx         # Route configuration
│   └── public/                # Public static files
│
└── server/                     # Backend Node.js application
    ├── bin/                   # Executable scripts
    ├── config/                # Configuration files
    ├── constants/             # Constants and enums
    ├── controllers/           # Route controllers
    ├── middleware/            # Express middleware
    ├── models/                # Mongoose models
    ├── public/                # Public static files
    ├── routes/                # API routes
    ├── scripts/               # Utility scripts
    ├── seeds/                 # Database seed files
    ├── services/              # Business logic services
    ├── tests/                 # Test files
    ├── uploads/               # File upload directory
    ├── app.js                 # Express application setup
    ├── db.js                  # Database connection
    └── index.js               # Application entry point
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/users` - Get all users (Admin only)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update user profile
- `PUT /api/users/:id/basic-info` - Update user's basic information
- `PUT /api/users/:id/preferences` - Update user's preferences
- `PUT /api/users/:id/status` - Update user status (Admin only)
- `PUT /api/users/:id/children/:childId` - Update a child's information
- `DELETE /api/users/:id` - Delete user (Admin or self)

### Camps
- `GET /api/camps` - Get all camps
- `GET /api/camps/owner` - Get all camps owned by the current user
- `GET /api/camps/:id` - Get camp details
- `POST /api/camps` - Create a new camp
- `PUT /api/camps/:id` - Update camp details
- `PUT /api/camps/:id/status` - Update camp status
- `DELETE /api/camps/:id` - Delete a camp

### Reviews
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/camp/:campId` - Get reviews for a specific camp
- `POST /api/reviews` - Create a new review
- `PUT /api/reviews/:id` - Update a review
- `PUT /api/reviews/:id/status` - Update review status
- `DELETE /api/reviews/:id` - Delete a review

### Maps
- `GET /api/maps/nearby` - Get nearby camps
- `GET /api/maps/camps` - Get all camps with coordinates
- `GET /api/maps/camps/:id` - Get a specific camp by ID

### AI
- `POST /api/ai/recommendations` - Get personalized camp recommendations
- `GET /api/ai/analyze-reviews/:campId` - Analyze reviews for a specific camp
- `POST /api/ai/generate-description` - Generate enhanced camp description
- `POST /api/ai/analyze-camp-image` - Analyze camp image

### Bookmarks
- `GET /api/bookmarks` - Get user's bookmarks
- `POST /api/bookmarks` - Add a camp to bookmarks
- `DELETE /api/bookmarks/:id` - Remove a camp from bookmarks

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or support, please contact: 
wang.ying17@northeastern.edu
ejiogu.d@northeastern.edu
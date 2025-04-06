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

- Frontend: [https://camp-explorer-client.onrender.com/](https://camp-explorer-client.onrender.com/)
- Backend API: [https://camp-explorer-server.onrender.com/api](https://camp-explorer-server.onrender.com/api)

## Features

- **User Management**
  - User registration and authentication
  - Role-based access (Parents, Camp Owners, Admin)
  - Profile management
  - Child profile management for parents
  - Review management (create, edit, and delete reviews)

- **Camp Management**
  - Camp listing and search
  - Detailed camp information
  - Camp registration and management
  - Location-based camp discovery

- **Interactive Features**
  - OpenStreetMap integration for camp locations
  - Distance-based camp search
  - Interactive camp details

- **Admin Dashboard**
  - User management
  - Camp management

## Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Context API for state management
- Material-UI (MUI)
- Axios for API calls


### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose ODM
- JWT Authentication
- CORS enabled
- OpenStreetMap API

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Render account (for deployment)

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5001/api  # Development
# VITE_API_URL=https://camp-explorer-server.onrender.com/api  # Production
```

### Backend (.env)
```
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173  # Development
# CORS_ORIGIN=https://camp-explorer-client.onrender.com  # Production
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/camp-explorer-platform.git
cd camp-explorer-platform
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:
```bash
# Create .env files in both server and client directories
# Add the required environment variables as shown above
```

4. Start the development servers:
```bash
# Start the backend server
cd server
npm run dev

# Start the frontend development server
cd ../client
npm run dev
```

## Deployment

The application is configured for deployment on Render:

### Backend Deployment
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CORS_ORIGIN=https://camp-explorer-client.onrender.com`
4. Deploy

### Frontend Deployment
1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Set the build command: `npm run build`
4. Set the publish directory: `dist`
5. Set the following environment variables:
   - `VITE_API_URL=https://camp-explorer-server.onrender.com/api`
6. Deploy

## Project Structure

```
camp-explorer-platform/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── context/       # Context providers
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
│
├── server/                # Backend Node.js application
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── bin/             # Server startup scripts
│   ├── package.json      # Backend dependencies
│   └── app.js           # Express application setup
│
└── README.md             # Project documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `PUT /api/users/:id/children` - Update user's children information
- `DELETE /api/users/:id` - Delete user (Admin only)

### Camps
- `GET /api/camps` - Get all camps
- `GET /api/camps/:id` - Get camp details
- `POST /api/camps` - Create a new camp
- `PUT /api/camps/:id` - Update camp details
- `DELETE /api/camps/:id` - Delete a camp

### Reviews
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/camp/:campId` - Get reviews for a specific camp
- `POST /api/reviews` - Create a new review
- `PUT /api/reviews/:id` - Update a review
- `DELETE /api/reviews/:id` - Delete a review

### Maps
- `GET /api/maps/nearby` - Get nearby camps
- `GET /api/maps/camps` - Get all camps with coordinates

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
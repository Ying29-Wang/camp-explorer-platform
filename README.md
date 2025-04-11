# Camp Explorer Platform

<<<<<<< HEAD
A comprehensive full-stack web application for discovering, managing, and reviewing camping locations. Built with React, Node.js, Express, and MongoDB.

## 🚀 Features

### Core Functionality

- ✅ Browse and search camping locations
- ✅ View detailed camp information
- ✅ User authentication and authorization
- ✅ Review and rating system
- ✅ Interactive map integration
- ✅ Responsive design for all devices
=======
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
>>>>>>> a403b2879b8f2f5592f2bc00de8d52367392cf69

### API Operations

<<<<<<< HEAD
- **Camps Management**

  - ✅ Create new camp listings
  - ✅ Read camp details and listings
  - ✅ Update camp information
  - ✅ Delete camp listings

- **User Management**

  - ✅ User registration
  - ✅ User profiles
  - ✅ User role management
  - ✅ Admin controls

- **Review System**
  - ✅ Post reviews
  - ✅ Read reviews
  - ✅ Update reviews
  - ✅ Delete reviews

### Authentication & Security

- ✅ Secure user registration
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Protected routes
- ✅ Session management

### External Integrations

- ✅ Google Maps API integration
- ✅ Geocoding service for address conversion
- ✅ Real-time location services

### Pages & UI Components

- ✅ Homepage with featured camps
- ✅ Search results with filters
- ✅ Detailed camp view
- ✅ User profile management
- ✅ Login/Register forms
- ✅ Camp management dashboard
- ✅ Admin control panel

### Data Handling

- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ Data persistence
- ✅ Input sanitization

## Tech Stack

### Frontend

- React.js
- Vite
- React Router
- Tailwind CSS
- Axios
- React Icons
- Google Maps API

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Geocoding API

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Google Maps API key
- Geocoding API key

## Installation

1. Clone the repository:

```bash
git clone [your-repository-url]
cd camp-explorer-platform
```

2. Install dependencies:

```bash
npm run install-all
```

3. Set up environment variables:
   - Create a `.env` file in the server directory with:
     ```
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     GOOGLE_MAPS_API_KEY=your_google_maps_api_key
     GEOCODING_API_KEY=your_geocoding_api_key
     ```
   - Create a `.env` file in the client directory with:
     ```
     VITE_API_URL=http://localhost:5000
     VITE_APP_NAME=Camp Explorer
     VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
     ```

## Running the Application

1. Start both frontend and backend servers:

```bash
npm start
```

Or run them separately:

2. Start the backend server:

```bash
npm run server
```

3. Start the frontend development server:

```bash
npm run client
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
=======
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
>>>>>>> a403b2879b8f2f5592f2bc00de8d52367392cf69

## Project Structure

```
camp-explorer-platform/
├── client/                 # Frontend React application
<<<<<<< HEAD
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── services/      # API services
│   │   └── App.jsx        # Main application component
│   └── vite.config.js     # Vite configuration
├── server/                 # Backend Node.js application
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   └── app.js             # Express application
└── package.json           # Root package.json
=======
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
>>>>>>> a403b2879b8f2f5592f2bc00de8d52367392cf69
```

## API Endpoints

<<<<<<< HEAD
### Camps

- `GET /api/camps` - Get all camps
- `GET /api/camps/:id` - Get camp by ID
- `POST /api/camps` - Create new camp
- `PUT /api/camps/:id` - Update camp
- `DELETE /api/camps/:id` - Delete camp

### Users

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Reviews

- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/:id` - Get review by ID
- `POST /api/reviews` - Create new review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## Security Features

- JWT-based authentication
- Password hashing
- Input validation
- CORS protection
- Rate limiting
- Role-based access control
=======
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
>>>>>>> a403b2879b8f2f5592f2bc00de8d52367392cf69

## Contributing

1. Fork the repository
<<<<<<< HEAD
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
=======
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
>>>>>>> a403b2879b8f2f5592f2bc00de8d52367392cf69
5. Open a Pull Request

## License

<<<<<<< HEAD
This project is licensed under the ISC License.

## Contact

[Your Name] - [Your Email]

Project Link: [https://github.com/yourusername/camp-explorer-platform](https://github.com/yourusername/camp-explorer-platform)
=======
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or support, please contact: 
wang.ying17@northeastern.edu
ejiogu.d@northeastern.edu
>>>>>>> a403b2879b8f2f5592f2bc00de8d52367392cf69

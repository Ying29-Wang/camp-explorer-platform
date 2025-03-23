# Camp Explorer API Documentation

## Base URL
http://localhost:5001/api

## Camps
- GET /camps - Get all camps
- GET /camps/:id - Get camp by ID
- GET /camps/homepage - Get homepage data (featured camps and categories)
- POST /camps - Create a new camp
- PUT /camps/:id - Update a camp
- DELETE /camps/:id - Delete a camp

## Users
- GET /users - Get all users
- GET /users/:id - Get user by ID
- POST /users - Create a new user
- PUT /users/:id - Update a user
- DELETE /users/:id - Delete a user

## Reviews
- GET /reviews - Get all reviews
- GET /reviews/camp/:campId - Get reviews for a specific camp
- POST /reviews - Create a new review
- PUT /reviews/:id - Update a review
- DELETE /reviews/:id - Delete a review
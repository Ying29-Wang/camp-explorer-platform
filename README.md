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


Page Requirements
Your application must have at least these 5 pages:

Homepage
The landing page of your web application. It is the first page users should see when they visit your website. 
Must be mapped to either the root context ("/") or ("/home").
Must display generic content/read functionality for anonymous users.
Must display some specific content for the logged-in user.
The additional content must be dynamic based on the most recent data entered by the logged-in user. For instance, you might display snippets and links to the most recent post or review created by the logged-in user
Must be clear about the purpose of the website and must look polished and finished
Log in/Register page
The login and register page allows users to register (create a new account) with the website and then log in later on
Must force login only when identity is required.
For instance, an anonymous user might search for movies and visit the details page for a particular movie without needing to log in. But if they attempt to like the movie, rate it, comment on it, write a review, or follow someone, the application must request the user to log in. Most of the Web applications must be available without a login 
Profile page
Users can see all the information about themselves. It could have several sections for personal information and links to related content associated with the user.  For instance, display a list of links to all the favourite movies, a  list of links of users they are following, etc.
Must allow users to edit their personal information.  
Must be mapped to "/profile" for displaying the profile of the currently logged-in user
The profile page may be implemented as several pages (based on how you want to display the information)
Search/Search Results page
Search and results can be on the same page or on separate pages. (e.g. the search bar can be on the home page and the results on a separate page, or both on a separate search page). 
Users must be able to see a summary of the search results and navigate to a detail page that shows a detailed view of the result. 
Must be mapped to /search/{search criteria} or /search?criteria={search criteria} when a search has been executed  
Details page
The details page allows users to view a detailed view of the search result. They can see more information when they click on the search result. The details page must fulfill the following requirements.
Must be mapped to /{collection name}/{unique identifier} or /{collection name}?identifier={unique identifier} where unique identifier uniquely identifies the item being displayed

Iteration 1
Your front end and back end should be working together.

Initialize the project using React (frontend) and Express (backend).
Set up a MongoDB database with at least 3 (or 4 if you have 3 members in your group) collections.
Design and implement a basic homepage (/).
Show content for anonymous users.
Routing, links, and the basis of CRUD operations (CRUD API endpoints (GET, POST, PUT, DELETE) should be established.
You need to have CRUD operations related to your main functionality of the app
Editing user profile doesn't count as an update operation related to your main functionality
Iteration 1 has a 20% weight of the group project portion of your grade.

Iteration 2
By the Iteration 2 deadline, you should have an API capable of executing all CRUD operations that are necessary for your app's core functionality and/or making whatever MongoDB queries that are necessary. Your main pages should be implemented and at least one external API should be integrated.

The results of all the CRUD operations should be demonstrated as relevant on the client side (rendered in the browser); thus the required REACT components and any other used front-side technology to render the fetched resources from the server to the client browser have been developed and operate following user interactions seemingly.  Fetched resources should be rendered in the browser in a user-friendly format.

Ensure smooth navigation between pages, data validation and error handling.

Your deployed application may be incomplete but it should not be broken. Don't push breaking code to GitHub.

Iteration 2 has a 25% weight of the group project portion of your grade.


Iteration 3
Iteration 3 represents the completion of the project with authentication, dynamic data for logged in users, and profile page. Your application is done! Your main functionality should be working. At this point your website should have fully responsive design with accessibility improvements.
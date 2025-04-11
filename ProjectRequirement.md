Web development final project requirement:

The goal is to develop a "Software as a Service" web application performing CRUD operations based on the MERN stack (Some examples include an online store, food ordering, personal journal, learning management system, social network, ...). 

Important Considerations:
Your project must support some functionality for anonymous users and only force users to log in if a user identity is required to fulfill a service.
oFor instance, in an online store, anonymous users should be able to search for products, view product details, read product reviews, etc. If a user would like to bookmark a product, comment on a product, or add a product to a shopping cart, then, and only then, would the website ask the user to identify themselves or register.
Page Requirements
Your application must have at least these 5 pages:

Homepage

oThe landing page of your web application. It is the first page users should see when they visit your website. 
oMust be mapped to either the root context ("/") or ("/home").
oMust display generic content/read functionality for anonymous users.
oMust display some specific content for the logged-in user.
The additional content must be dynamic based on the most recent data entered by the logged-in user. For instance, you might display snippets and links to the most recent post or review created by the logged-in user
oMust be clear about the purpose of the website and must look polished and finished

Log in/Register page

oThe login and register page allows users to register (create a new account) with the website and then log in later on
oMust force login only when identity is required.
For instance, an anonymous user might search for movies and visit the details page for a particular movie without needing to log in. But if they attempt to like the movie, rate it, comment on it, write a review, or follow someone, the application must request the user to log in. Most of the Web applications must be available without a login 

Profile page

oUsers can see all the information about themselves. It could have several sections for personal information and links to related content associated with the user.  For instance, display a list of links to all the favourite movies, a  list of links of users they are following, etc.
oMust allow users to edit their personal information.  
oMust be mapped to "/profile" for displaying the profile of the currently logged-in user
oThe profile page may be implemented as several pages (based on how you want to display the information)

Search/Search Results page

oSearch and results can be on the same page or on separate pages. (e.g. the search bar can be on the home page and the results on a separate page, or both on a separate search page). 
oUsers must be able to see a summary of the search results and navigate to a detail page that shows a detailed view of the result. 
oMust be mapped to /search/{search criteria} or /search?criteria={search criteria} when a search has been executed  

Details page

oThe details page allows users to view a detailed view of the search result. They can see more information when they click on the search result. The details page must fulfill the following requirements.
oMust be mapped to /{collection name}/{unique identifier} or /{collection name}?identifier={unique identifier} where unique identifier uniquely identifies the item being displayed
 Responsive design requirements
The web application must be usable on a desktop, tablet (mention the device you tested on), or phone (mention the device you tested on)
Web pages must be responsive at any width of the browser
Elements must never overlap each other unintentionally
Elements must not wrap unintentionally
Scrollbars must not appear unintentionally
Embedded scrollbars must be avoided unless specifically necessary
Must use scrollbars only when it is absolutely necessary
User experience requirements
Navigating between pages must be clearly marked
Currently logged-in users must be clearly marked
Touch or click areas must be as large as possible. For instance, don't force the user to click on small target areas such as a link if there is also the possibility of clicking on a related large icon or image. Clicking on the label of a radio or checkbox button should also toggle the button. Clicking on the label of a text input should cause focus on the input
Errors must be clearly marked and options to fix them must be provided
Navigating to the home page must be clearly marked
Navigating to the profile must be clearly marked
The URL must have a meaningful name
Some resources for project UI design
ohttps://react-bootstrap.github.io/Links to an external site. 
ohttps://mui.com/material-ui/Links to an external site. 
ohttps://www.chakra-ui.com/Links to an external site. 
ohttps://colorhunt.cottps://colorhunt.co/
External Web API requirements
2 External Web APIs
oYou should find 2 external APIs to use in the project. At least one of them has to be an AI-driven API.
oSome AI-driven APIs use-cases and example APIs:
OpenAI GPT (for text generation and processing), Google Cloud Vision (for image recognition), IBM Watson (for a variety of AI tasks e.g. Sentiment Analysis), Amazon Rekognition (for image and video analysis), Microsoft Azure AI Services (for diverse AI functionalities) , etc.
Sample use-cases:
Sentiment analysis of user-generated content (Google Natural Language API, IBM Watson NLU)
Text Summarization/generation (OpenAI GPT, Hugging Face Transformers, Cohere, Claude, TextRazor)
Language translation (Google Cloud Translation, DeepL API) 
Grammar and Spell Check (Grammarly API, ProWritingAid)
Image recognition (Google Cloud Vision, Amazon Rekognition)
Image Filters and Enhancements (Remove.bg, Pixlab)
Optical Character Recognition (OCR): Extract text from scanned images (Tesseract OCR, Google Cloud Vision)
Video Content Analysis (Microsoft Video Indexer)
Speech-to-Text (Google Speech-to-Text, Microsoft Azure Speech Services)
Text-to-Speech (Amazon Polly, Google Text-to-Speech)
Voice Commands (Speechly, OpenAI Whisper)
Chatbots (Dialogflow, OpenAI ChatGPT, Claude)
Art Generation: Allow users to create art from text prompts or modify images (DALL·E, RunwayML)
Dietary Assistance (Edamam Nutrition API, Yummly API)
Mental Health Support: Use sentiment analysis to detect mood and suggest wellness tips or resources (Mindstrong)
https://www.tavus.io/post/ai-apisLinks to an external site. 
o Some Non-AI APIs:
IMDB, YouTube, Yelp, Yahoo, Weather Channel, Yummly, Bestbuy, Amazon, Google Places, Google Geocoding etc.  You need to only use the Web API to do read-only operations
Sample use-cases:
Get weather data based on location
Get recipes based on the country name
Get a business name ba
Note: Google maps static API doesn't satisfy this requirement
https://medium.com/geekculture/10-fun-and-free-apis-to-use-for-your-next-coding-project-7d765f643f08Links to an external site.
https://blog.hubspot.com/website/free-open-apisLinks to an external site. 
https://rapidapi.com/collection/list-of-free-apisLinks to an external site. 
https://www.bannerbear.com/blog/10-public-apis-that-you-can-use-in-your-next-project/Links to an external site. 
https://apilist.fun/Links to an external site. 
Accessibility requirements
You should aim for an accessibility score of 100 (Include an explanation if the score of 100 is not possible). Include accessibility reports from all your pages (on both Desktop and mobile) using https://developers.google.com/web/tools/lighthouseLinks to an external site. 
Database requirements
Your application should include at least 3 collections in the database.  
Additional requirements For groups of 3 students
Your web app should have the following features as well as the ones mentioned above:
Use at least four collections
oat least one of the collections should store a reference to another collection
Give user the option to sort and filter data (in addition to searching)
oGET /items?sort=popularity&filter=recent – Filter & sort results
Create different user roles (e..g. regular users and admins)
oAdd some role-specific capabilities and pages

Project proposal:
Camp Explorer Platform - Project Proposal
Group 7: Dominic Ejiogu, Ying Wang
Brief Description
Camp Explorer is a comprehensive web application that serves as a
centralized platform for parents to discover, research, and save information
about various children's camps. Our platform aggregates camp listings from
both direct owner submissions(so that parents who are interested can place
registration directly on our website directly for the camp) and external
sources(if interested, our website would have access leads to the camp
owner), providing a unified interface for parents to make informed decisions
about camp selections for their children. The goal is to simplify the camp
discovery process by offering detailed information, reviews, and personalized
recommendations in a user-friendly environment.
Target Audience
Our primary audience is parents and guardians of children aged 5-18 who are
searching for appropriate camps for their children in Canada.
User Needs and Pain Points:
1. 2. 3. 4. 5. Information Fragmentation: Parents currently need to visit multiple websites, social
media pages, and local resources to find camp options.
Comparison Difficulty: There's no centralized way to compare camps side-by-side
across different providers.
Reliability Concerns: Parents struggle to determine the quality and reliability of
camps without verified reviews.
Time Constraints: Working parents have limited time to research multiple options
and need efficient ways to find suitable camps.
Specific Requirements: Many children have specific needs (age appropriateness,
special interests, medical considerations) that require detailed filtering.
Problems Addresses:
1. 2. 3. 4. 5. Centralized Information: Consolidates camp data from multiple sources into one
searchable platform.
Informed Decision-Making: Provides detailed camp profiles, verified reviews, and
comprehensive filtering.
Time Savings: Streamlines the research process with powerful search and AI-driven
recommendations.
Personalization: Tailors camp suggestions based on child's age, interests, and
location preferences.
Community Insights: Offers authentic reviews from other parents to assess camp
quality.
Competitor Research
1. ActivityHero
ActivityHero is a platform for finding children's activities and camps with
booking capabilities.
 Strengths: Direct booking system, wide range of activities, integrated payment
processing
 Weaknesses: Limited filtering options, mixed focus (classes, activities, and camps),
minimal personalization, Geographical restrictions(mostly focused on the USA)
2. CampPage
A directory focused specifically on summer camps across the United States.
 Strengths: Comprehensive camp listings, geographical search, detailed camp
profiles
 Weaknesses: Outdated interface, limited comparison tools, no AI-powered features,
minimal review system
3. KidsCamps.com
KidsCamps.com offers listings for summer camps throughout North America
with some international options.
·
 Strengths: Broad coverage, diverse camp types, free service for parents, established
presence, direct contact information ·
 Weaknesses: Inconsistent listing quality, limited reviews, basic search functionality,
outdated interface
Improvements on Existing Solutions
Our platform proposes several innovations beyond current offerings:
Innovative Feature: AI-Powered Match System
Unlike competitors who use basic filtering, we'll implement an advanced AI
recommendation engine that:
 Analyzes the child's interests, age, and past camp experiences(if any)
 Processes review sentiment to understand camp strengths
 Generates personalized camp suggestions with confidence ratings
 Explains why each camp was recommended to build parent trust
 Learns from user interactions to improve future recommendations
This goes beyond the simple keyword matching used by competitors and
creates a more personalized discovery experience, similar to how advanced
streaming platforms recommend content.
What's Innovative
The most innovative aspect of our application is the dual-source camp
information model combined with AI-powered insights:
1. 2. 3. 4. Unified Data Model: We combine owner-submitted listings with aggregated data
from external sources, clearly indicating the source and verification status.
AI-Enhanced Discovery: Rather than just showing search results, we use AI to
generate insights about each camp, highlight key differentiators, and create
customized suggestions.
Community-Powered Intelligence: Our review system uses sentiment analysis to
identify strengths and areas of concern for each camp, extracting insights that might
not be immediately obvious.
Transparent Source Information: Unlike competitors who don't distinguish between
different information sources, we clearly mark the origin of each listing and its
verification status.
User Engagement Strategies
To keep users engaged beyond the initial novelty:
1. Seasonal Relevance: Camps are inherently seasonal, and we'll adjust content to
highlight different types of camps throughout the year (summer camps, winter break
camps, spring programs).
2. Year-Round Planning Tools: We'll provide planning tools for parents to map out
their children's year, including reminders for early registration periods and camp
planning calendars(future feature).
3. Parent Community: A forum for parents to share experiences and advice about
specific camps creates ongoing value beyond just searching(future feature)
4. Camp Outcome Tracking: Parents can document their child's experience after
attending a camp, creating a valuable record for future reference and for sharing with
the community.
5. Personalized Alerts: Notifications about new camps matching their criteria, price
drops, or spaces opening in popular camps provide ongoing utility(future feature).
Third-Party APIs
1. AI API Options:
 OpenAI GPT API for generating camp descriptions, analyzing reviews, and creating
personalized recommendations
2. Non-AI API Options:
 Google Maps API for location visualization and distance calculations
 Weather API (OpenWeatherMap or Weather.gov) to show typical weather for camp
dates/locations(future features)
MongoDB Collections
1. Users Collection
2. Camps Collection
3. Reviews Collection
4. Transaction Collection(future feature)
Collection Relationships
 Users to Camps: One-to-many relationship where a user (camp owner) can own or
save multiple camps
 Camps to Reviews: One-to-many relationship where a camp can have multiple
reviews
 Users to Reviews: One-to-many relationship where a user can write multiple reviews
CRUD Operations
Create
 Users: Register new users (parents, camp owners)
 Camps: Camp owners can submit new camp listings
 Reviews: Parents can write reviews for camps their children attended
Read
Update
Delete
 Users: View user profiles and preferences
 Camps: Search and filter camps by various criteria (location, type, age range, etc.)
 Reviews: View reviews for specific camps
 Users: Edit profile information and preferences
 Camps: Camp owners can update their camp details
 Reviews: Users can edit their own reviews
 Users: Deactivate accounts
 Camps: Camp owners can remove their camp listings
 Reviews: Users can delete their reviews
High-Level Page Sketches
Homepage and profile Page:
In our planning, the Login/Register button would change to Profile tab after user login.
Search Result page, Detail Page and Registration Page:
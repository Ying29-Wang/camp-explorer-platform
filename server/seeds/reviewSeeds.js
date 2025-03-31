const Review = require('../models/review');

// Helper function to generate random integer between min and max (inclusive)
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Sample review texts
const reviewTexts = [
  'My child had an amazing time at this camp! The counselors were friendly and the activities were engaging.',
  'Great experience overall. Would definitely recommend to other parents.',
  'The camp was well-organized and my child learned a lot of new skills.',
  'Good camp but could use better facilities. The activities were fun though.',
  'Excellent camp experience! The staff was professional and very caring.',
  'My child can\'t wait to return next year. They made so many new friends!',
  'The camp exceeded our expectations. Very well run program.',
  'Average experience. Some activities were great while others felt rushed.',
  'My child had a blast at this camp! They came home every day excited about what they learned.',
  'Very educational and fun camp. Worth every penny.'
];

const seedReviews = async (users, camps) => {
  // Create reviews array
  const reviews = [];
  
  // Only parent users should leave reviews
  const parentUsers = users.filter(user => user.role === 'parent');
  
  // Generate reviews
  camps.forEach(camp => {
    // Each camp gets 3-8 reviews
    const numReviews = getRandomInt(3, 8);
    
    for (let i = 0; i < numReviews; i++) {
      // Randomly select a parent user
      const randomUserIndex = getRandomInt(0, parentUsers.length - 1);
      const user = parentUsers[randomUserIndex];
      
      // Randomly select a review text
      const randomReviewIndex = getRandomInt(0, reviewTexts.length - 1);
      const reviewText = reviewTexts[randomReviewIndex];
      
      // Create review with rating between 3-5 (mostly positive reviews)
      reviews.push({
        userId: user._id,
        campId: camp._id,
        rating: getRandomInt(3, 5),
        reviewText: reviewText
      });
    }
  });
  
  // Insert reviews into database
  const createdReviews = await Review.insertMany(reviews);
  console.log(`${createdReviews.length} reviews created`);
  
  return createdReviews;
};

module.exports = seedReviews;
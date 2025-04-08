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
  try {
    const reviews = [];
    
    // Create reviews for each camp
    camps.forEach(camp => {
      // Create 3-5 reviews per camp
      const numReviews = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < numReviews; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const reviewText = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];
        reviews.push({
          userId: user._id,
          campId: camp._id,
          rating: Math.floor(Math.random() * 3) + 3,
          reviewText: reviewText,
          status: 'active',
          helpfulVotes: Math.floor(Math.random() * 10), // Random helpful votes between 0-9
          isSeedReview: true
        });
      }
    });

    const createdReviews = await Review.insertMany(reviews);
    console.log(`${createdReviews.length} reviews created`);
    return createdReviews;
  } catch (error) {
    console.error('Error seeding reviews:', error);
    throw error;
  }
};

module.exports = seedReviews;
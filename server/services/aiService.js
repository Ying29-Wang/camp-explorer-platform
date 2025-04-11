const OpenAI = require('openai');
const Camp = require('../models/camp');
const Review = require('../models/review');

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

class AIService {
    // Generate personalized camp recommendations
    async generateCampRecommendations(userPreferences, pastReviews = []) {
        // Validate required fields
        if (!userPreferences.userId) {
            throw new Error('User ID is required');
        }
        if (!userPreferences.ageRange) {
            throw new Error('Age range is required');
        }
        if (!userPreferences.interests || !Array.isArray(userPreferences.interests)) {
            throw new Error('Interests must be an array');
        }
        if (!userPreferences.location) {
            throw new Error('Location preference is required');
        }
        if (!userPreferences.budgetRange) {
            throw new Error('Budget range is required');
        }

        console.log('Starting camp recommendations with preferences:', userPreferences);
        console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
        console.log('OpenAI API Key length:', process.env.OPENAI_API_KEY?.length);
        
        const camps = await Camp.find({});
        console.log('Found camps:', camps.length);
        
        const reviews = await Review.find({ userId: userPreferences.userId })
            .populate('campId', 'name description')
            .populate('userId', 'username');
        console.log('Found user reviews:', reviews.length);

        // Try OpenAI API first
        try {
            const prompt = `Based on the following user preferences and past reviews, recommend 5 suitable camps:
            User Preferences:
            - Age Range: ${userPreferences.ageRange}
            - Interests: ${userPreferences.interests.join(', ')}
            - Location Preference: ${userPreferences.location}
            - Budget Range: ${userPreferences.budgetRange}
            
            Past Reviews:
            ${reviews.map(review => `- ${review.campId ? review.campId.name : 'Unknown Camp'}: ${review.rating} stars, ${review.reviewText}`).join('\n')}
            
            Available Camps:
            ${camps.map(camp => `- ${camp.name}: ${camp.description.substring(0, 100)}...`).join('\n')}
            
            Please provide detailed recommendations explaining why each camp would be a good fit.`;

            console.log('Calling OpenAI API with prompt:', prompt);

            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful camp recommendation assistant. Provide detailed, personalized camp recommendations based on user preferences and past experiences."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            });

            console.log('OpenAI API response:', response);
            return response.choices[0].message.content;
        } catch (openaiError) {
            console.warn('OpenAI API call failed, falling back to basic recommendations:', openaiError.message);
            // Return basic recommendations directly instead of throwing
            return this.generateBasicRecommendations(camps, userPreferences);
        }
    }

    // Generate basic recommendations based on matching criteria
    async generateBasicRecommendations(camps, userPreferences) {
        try {
            // Parse age range
            const [minAge, maxAge] = userPreferences.ageRange.split('-').map(Number);
            
            // Parse budget range
            const [minBudget, maxBudget] = userPreferences.budgetRange.split('-').map(Number);

            // Score each camp based on matching criteria
            const scoredCamps = camps.map(camp => {
                let score = 0;
                
                // Age range match
                if (camp.ageRange && camp.ageRange.min <= maxAge && camp.ageRange.max >= minAge) {
                    score += 2;
                }
                
                // Location match
                if (camp.location && camp.location.toLowerCase().includes(userPreferences.location.toLowerCase())) {
                    score += 2;
                }
                
                // Budget match
                if (camp.price && camp.price >= minBudget && camp.price <= maxBudget) {
                    score += 2;
                }
                
                // Interests match
                if (camp.activities) {
                    const matchingInterests = camp.activities.filter(activity => 
                        userPreferences.interests.some(interest => 
                            activity.toLowerCase().includes(interest.toLowerCase())
                        )
                    ).length;
                    score += matchingInterests;
                }
                
                return { camp, score };
            });

            // Sort by score and get top 5
            const topCamps = scoredCamps
                .sort((a, b) => b.score - a.score)
                .slice(0, 5)
                .filter(item => item.score > 0);

            if (topCamps.length === 0) {
                return "No camps found matching your criteria. Please try adjusting your preferences.";
            }

            // Generate recommendation text
            let recommendations = "Based on your preferences, here are some recommended camps:\n\n";
            
            topCamps.forEach(({ camp, score }, index) => {
                recommendations += `${index + 1}. ${camp.name}\n`;
                recommendations += `   Location: ${camp.location}\n`;
                recommendations += `   Age Range: ${camp.ageRange?.min}-${camp.ageRange?.max}\n`;
                recommendations += `   Price: $${camp.price}\n`;
                recommendations += `   Activities: ${camp.activities?.join(', ')}\n`;
                recommendations += `   Description: ${camp.description.substring(0, 150)}...\n\n`;
            });

            return recommendations;
        } catch (error) {
            console.error('Error in basic recommendations:', error);
            return "We're having trouble generating recommendations at the moment. Please try again later.";
        }
    }

    // Analyze reviews for sentiment and key insights
    async analyzeReviews(campId) {
        try {
            const reviews = await Review.find({ camp: campId });
            const camp = await Camp.findById(campId);

            const prompt = `Analyze the following reviews for the camp "${camp.name}" and provide:
            1. Overall sentiment (positive/negative/neutral)
            2. Key strengths mentioned
            3. Areas for improvement
            4. Common themes
            
            Reviews:
            ${reviews.map(review => `- Rating: ${review.rating}/5, Comment: ${review.comment}`).join('\n')}`;

            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a review analysis assistant. Analyze camp reviews to extract key insights and sentiment."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.5,
                max_tokens: 500
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Error analyzing reviews:', error);
            throw new Error('Failed to analyze reviews');
        }
    }

    // Generate enhanced camp description
    async generateCampDescription(campData) {
        try {
            const prompt = `Create an engaging and detailed description for a camp with the following details:
            Name: ${campData.name}
            Type: ${campData.type}
            Age Range: ${campData.ageRange}
            Location: ${campData.location}
            Activities: ${campData.activities.join(', ')}
            Duration: ${campData.duration}
            
            Please create a compelling description that highlights the unique aspects of this camp and would appeal to parents looking for a camp for their children.`;

            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a camp description writer. Create engaging and informative camp descriptions that highlight unique features and benefits."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Error generating camp description:', error);
            throw new Error('Failed to generate camp description');
        }
    }
}

module.exports = new AIService(); 
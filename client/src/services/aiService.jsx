import api from './api';

class AIService {
    // Get personalized camp recommendations
    async getCampRecommendations(userPreferences) {
        try {
            const response = await api.post('/ai/recommendations', userPreferences);
            return response.data.recommendations;
        } catch (error) {
            console.error('Error getting camp recommendations:', error);
            throw error;
        }
    }

    // Analyze reviews for a specific camp
    async analyzeCampReviews(campId) {
        try {
            const response = await api.get(`/ai/analyze-reviews/${campId}`);
            return response.data.analysis;
        } catch (error) {
            console.error('Error analyzing camp reviews:', error);
            throw error;
        }
    }

    // Generate enhanced camp description
    async generateCampDescription(campData) {
        try {
            // Validate required fields
            const { name, type, ageRange, location } = campData;
            if (!name || !type || !ageRange || !location) {
                throw new Error('Please provide name, type, ageRange, and location');
            }

            const response = await api.post('/ai/generate-description', campData);
            
            if (!response.data || !response.data.description) {
                throw new Error('Invalid response format from server');
            }

            return response.data.description;
        } catch (error) {
            console.error('Error generating camp description:', error);
            
            if (error.response) {
                const serverError = error.response.data;
                // Check for OpenAI quota error
                if (error.response.status === 500 && 
                    serverError.message && 
                    serverError.message.includes('quota')) {
                    throw new Error('OpenAI API quota exceeded. Please check your billing details or try again later.');
                }
                throw new Error(serverError.message || serverError.error || 'Failed to generate description');
            } else if (error.request) {
                throw new Error('No response received from server. Please check your connection.');
            } else {
                throw new Error(error.message || 'Failed to generate description');
            }
        }
    }
}

export default new AIService(); 
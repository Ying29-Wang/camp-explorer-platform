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
            const response = await api.post('/ai/generate-description', campData);
            return response.data.description;
        } catch (error) {
            console.error('Error generating camp description:', error);
            throw error;
        }
    }
}

export default new AIService(); 
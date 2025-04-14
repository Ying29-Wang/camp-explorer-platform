import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, Alert } from '@mui/material';
import aiService from '../services/aiService';

const AIRecommendations = ({ userPreferences }) => {
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!userPreferences) return;
            
            setLoading(true);
            setError(null);
            
            try {
                const result = await aiService.getCampRecommendations(userPreferences);
                setRecommendations(result);
            } catch (err) {
                setError('Failed to load recommendations. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [userPreferences]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        );
    }

    if (!recommendations) {
        return null;
    }

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    AI-Powered Recommendations
                </Typography>
                <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                    {recommendations}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default AIRecommendations; 
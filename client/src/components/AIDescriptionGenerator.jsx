import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Button,
    TextField,
    Grid,
    Divider
} from '@mui/material';
import aiService from '../services/aiService';

const AIDescriptionGenerator = ({ campData, onDescriptionGenerated }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [generatedDescription, setGeneratedDescription] = useState(null);

    const handleGenerate = async () => {
        if (!campData.name || !campData.type || !campData.ageRange || !campData.location) {
            setError('Please fill in the required camp details first (name, type, age range, and location)');
            return;
        }

        setLoading(true);
        setError(null);
        setGeneratedDescription(null);

        try {
            const result = await aiService.generateCampDescription(campData);
            setGeneratedDescription(result);
            if (onDescriptionGenerated) {
                onDescriptionGenerated(result);
            }
        } catch (err) {
            console.error('Error in handleGenerate:', err);
            // Check for quota error
            if (err.message.includes('quota')) {
                setError('The AI service is currently unavailable due to quota limits. Please try again later or contact support.');
            } else {
                setError(err.message || 'Failed to generate description. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ mb: 3, mt: 2, backgroundColor: '#f5f5f5' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                    AI Description Generator
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Let AI help you create an engaging camp description based on your camp details.
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box display="flex" justifyContent="center" gap={2}>
                    <Button
                        variant="contained"
                        onClick={handleGenerate}
                        disabled={loading}
                        color="primary"
                    >
                        Generate Description
                    </Button>
                </Box>

                {loading && (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                )}

                {generatedDescription && (
                    <Box mt={3}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" gutterBottom color="primary">
                            Generated Description:
                        </Typography>
                        <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                            {generatedDescription}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default AIDescriptionGenerator; 
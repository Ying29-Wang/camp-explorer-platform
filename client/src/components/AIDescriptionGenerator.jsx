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
} from '@mui/material';
import aiService from '../services/aiService';

const AIDescriptionGenerator = ({ onDescriptionGenerated }) => {
    const [campData, setCampData] = useState({
        name: '',
        type: '',
        ageRange: '',
        location: '',
        activities: '',
        duration: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [generatedDescription, setGeneratedDescription] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCampData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGenerate = async () => {
        if (!campData.name || !campData.type || !campData.ageRange || !campData.location) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const activitiesArray = campData.activities.split(',').map(activity => activity.trim());
            const result = await aiService.generateCampDescription({
                ...campData,
                activities: activitiesArray
            });
            setGeneratedDescription(result);
            if (onDescriptionGenerated) {
                onDescriptionGenerated(result);
            }
        } catch (err) {
            setError('Failed to generate description. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    AI Description Generator
                </Typography>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Camp Name"
                            name="name"
                            value={campData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Camp Type"
                            name="type"
                            value={campData.type}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Age Range"
                            name="ageRange"
                            value={campData.ageRange}
                            onChange={handleInputChange}
                            required
                            placeholder="e.g., 8-12"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Location"
                            name="location"
                            value={campData.location}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Activities (comma-separated)"
                            name="activities"
                            value={campData.activities}
                            onChange={handleInputChange}
                            placeholder="e.g., swimming, hiking, arts and crafts"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Duration"
                            name="duration"
                            value={campData.duration}
                            onChange={handleInputChange}
                            placeholder="e.g., 1 week, 2 weeks"
                        />
                    </Grid>
                </Grid>

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
                        <Typography variant="subtitle1" gutterBottom>
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
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, Alert, Button } from '@mui/material';
import aiService from '../services/aiService';

const AIReviewAnalysis = ({ campId }) => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAnalysis = async () => {
        if (!campId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const result = await aiService.analyzeCampReviews(campId);
            setAnalysis(result);
        } catch (err) {
            setError('Failed to analyze reviews. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalysis();
    }, [campId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert 
                severity="error" 
                sx={{ mb: 2 }}
                action={
                    <Button color="inherit" size="small" onClick={fetchAnalysis}>
                        Retry
                    </Button>
                }
            >
                {error}
            </Alert>
        );
    }

    if (!analysis) {
        return null;
    }

    return (
        <Card sx={{ mb: 3, backgroundColor: '#ffffff' }}>
            <CardContent>
                <Typography 
                    variant="h3" 
                    component="h3" 
                    gutterBottom
                    sx={{ 
                        color: '#000000',
                        fontWeight: 600
                    }}
                >
                    AI Review Analysis
                </Typography>
                <Typography 
                    variant="body1" 
                    sx={{ 
                        color: '#000000',
                        whiteSpace: 'pre-line'
                    }}
                >
                    {analysis}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default AIReviewAnalysis; 
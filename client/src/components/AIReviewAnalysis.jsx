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
            <Box display="flex" justifyContent="center" p={3} role="status" aria-label="Loading analysis">
                <CircularProgress aria-hidden="true" />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert 
                severity="error" 
                sx={{ 
                    mb: 2,
                    backgroundColor: '#fee2e2',
                    color: '#dc2626'
                }}
                role="alert"
                action={
                    <Button 
                        color="inherit" 
                        size="small" 
                        onClick={fetchAnalysis}
                        aria-label="Retry analysis"
                        sx={{ color: '#dc2626' }}
                    >
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
        <Card 
            sx={{ 
                mb: 2,
                backgroundColor: '#ffffff !important',
                '& .MuiCardContent-root': {
                    backgroundColor: '#ffffff !important',
                    '& .MuiTypography-root': {
                        color: '#000000 !important',
                        '&.MuiTypography-h3': {
                            color: '#000000 !important',
                            fontWeight: 'bold'
                        },
                        '&.MuiTypography-body1': {
                            color: '#000000 !important',
                            lineHeight: 1.6
                        }
                    }
                }
            }} 
            role="region" 
            aria-labelledby="ai-analysis-heading"
        >
            <CardContent sx={{ backgroundColor: '#ffffff !important' }}>
                <Typography 
                    variant="h3" 
                    component="h3" 
                    gutterBottom 
                    id="ai-analysis-heading"
                    sx={{ 
                        color: '#000000 !important',
                        fontWeight: 'bold',
                        marginBottom: '1rem'
                    }}
                >
                    AI Analysis
                </Typography>
                <Typography 
                    variant="body1" 
                    sx={{ 
                        color: '#000000 !important',
                        lineHeight: 1.6,
                        backgroundColor: '#ffffff !important'
                    }}
                >
                    {analysis.summary}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default AIReviewAnalysis; 
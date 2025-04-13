// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import FeaturedCamps from '../components/features/FeaturedCamps';
import RecentlyViewed from '../components/features/RecentlyViewed';
import QuickFilters from '../components/features/QuickFilters';
import HeroSection from '../components/layout/HeroSection';
import Spinner from '../components/common/Spinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './HomePage.css';

const HomePage = () => {
    const { isLoggedIn, isLoading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    if (authLoading || loading) return <Spinner fullPage />;
    if (error) return <ErrorMessage message={error} fullPage />;

    return (
        <div className="homepage">
            <HeroSection />
            
            <QuickFilters />
            
            <FeaturedCamps />
            
            {isLoggedIn && <RecentlyViewed />}
            
        </div>
    );
};

export default HomePage;
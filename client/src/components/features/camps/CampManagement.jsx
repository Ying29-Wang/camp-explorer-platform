import React, { useState, useEffect } from 'react';
import { fetchCampsByOwner } from '../../../services/campService';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/layout/Header';
import './CampManagement.css';

const CampManagement = () => {
    const [camps, setCamps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        loadCamps();
    }, []);

    const loadCamps = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchCampsByOwner();
            setCamps(data);
        } catch (err) {
            console.error('Error loading camps:', err);
            setError(err.message || 'Failed to load camps. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="camp-management">
            <Header />
            <div className="camp-management-container">
                <div className="camps-list-section">
                    <h3>Your Camps</h3>
                    {camps.length === 0 ? (
                        <div className="no-camps-message">You haven't added any camps yet.</div>
                    ) : (
                        <div className="camps-list">
                            {camps.map(camp => (
                                <div key={camp._id} className="camp-card">
                                    <h4>{camp.name}</h4>
                                    <p>{camp.description}</p>
                                    <p>Location: {camp.location}</p>
                                    <p>Price: ${camp.price}</p>
                                    <p>Age Range: {camp.ageRange.min}-{camp.ageRange.max}</p>
                                    <p>Category: {camp.category}</p>
                                    <p>Contact: {camp.contact}</p>
                                    <p>Email: {camp.email}</p>
                                    <p>Phone: {camp.phone}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CampManagement; 
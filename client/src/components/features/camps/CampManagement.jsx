import React, { useState, useEffect } from 'react';
import { fetchCampsByOwner, deleteCamp } from '../../../services/campService';
import { useAuth } from '../../../context/AuthContext';
import './CampManagement.css';

const CampManagement = () => {
    const [camps, setCamps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingCamp, setEditingCamp] = useState(null);
    const [showForm, setShowForm] = useState(false);
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

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this camp?')) {
            try {
                await deleteCamp(id);
                setCamps(camps.filter(camp => camp._id !== id));
            } catch (err) {
                setError(err.message || 'Failed to delete camp');
                console.error(err);
            }
        }
    };

    const handleEdit = (camp) => {
        setEditingCamp(camp);
        setShowForm(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setShowForm(false);
        setEditingCamp(null);
        await loadCamps();
    };

    if (loading) {
        return (
            <div className="camp-management">
                <h2>Manage Your Camps</h2>
                <div className="loading">Loading your camps...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="camp-management">
                <h2>Manage Your Camps</h2>
                <div className="error-message">{error}</div>
                <button onClick={loadCamps} className="retry-button">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="camp-management">
            <h2>Manage Your Camps</h2>
            <button onClick={() => setShowForm(true)} className="add-camp-button">
                Add New Camp
            </button>
            
            {showForm && (
                <div className="camp-form">
                    <h3>{editingCamp ? 'Edit Camp' : 'Add New Camp'}</h3>
                    <form onSubmit={handleFormSubmit}>
                        {/* Form fields */}
                        <button type="submit">Save</button>
                        <button 
                            type="button" 
                            onClick={() => {
                                setShowForm(false);
                                setEditingCamp(null);
                            }}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            <div className="camps-list">
                {camps.length === 0 ? (
                    <p className="no-camps">You haven't created any camps yet.</p>
                ) : (
                    camps.map(camp => (
                        <div key={camp._id} className="camp-card">
                            <h3>{camp.name}</h3>
                            <p>{camp.description}</p>
                            <div className="camp-actions">
                                <button onClick={() => handleEdit(camp)}>Edit</button>
                                <button onClick={() => handleDelete(camp._id)}>Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CampManagement; 
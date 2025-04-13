import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Header from '../components/layout/Header';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState({
        personalInfo: false,
        children: false
    });
    const [formData, setFormData] = useState({
        phone: user?.phone || '',
        location: user?.location || ''
    });
    const [children, setChildren] = useState(user?.children || []);
    const [newChild, setNewChild] = useState({ name: '', age: '' });

    useEffect(() => {
        if (user) {
            fetchBookmarks();
            setFormData({
                phone: user.phone || '',
                location: user.location || ''
            });
            setChildren(user.children || []);
        }
    }, [user]);

    const fetchBookmarks = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/bookmarks');
            setBookmarks(response.data);
        } catch (err) {
            setError('Failed to load bookmarks. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveBookmark = async (campId) => {
        try {
            await api.delete(`/bookmarks/${campId}`);
            setBookmarks(bookmarks.filter(bookmark => bookmark.campId._id !== campId));
        } catch (err) {
            setError('Failed to remove bookmark. Please try again.');
        }
    };

    const handlePersonalInfoChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSavePersonalInfo = async () => {
        try {
            const response = await api.put(`/users/${user._id}`, {
                phone: formData.phone,
                location: formData.location
            });
            await updateUser(response.data);
            setFormData({
                phone: response.data.phone || '',
                location: response.data.location || ''
            });
            setIsEditing(prev => ({ ...prev, personalInfo: false }));
        } catch (err) {
            console.error('Error saving personal info:', err);
            setError('Failed to update profile. Please try again.');
        }
    };

    const handleChildChange = (index, field, value) => {
        setChildren(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleAddChild = async () => {
        if (!newChild.name || !newChild.age) {
            setError('Please fill in all child details');
            return;
        }
        try {
            const response = await api.post(`/users/${user._id}/children`, newChild);
            setChildren(response.data.children);
            setNewChild({ name: '', age: '' });
            setIsEditing(prev => ({ ...prev, children: false }));
        } catch (err) {
            setError('Failed to add child. Please try again.');
        }
    };

    const handleRemoveChild = async (childId) => {
        try {
            const response = await api.delete(`/users/${user._id}/children/${childId}`);
            setChildren(response.data.children);
        } catch (err) {
            setError('Failed to remove child. Please try again.');
        }
    };

    if (!user) {
        return (
            <>
                <Header />
                <div className="profile-container">
                    <div className="profile-header">
                        <h1>Profile</h1>
                        <p>Please log in to view your profile.</p>
                        <a href="/login" className="login-link">Log In</a>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="profile-page">
                <div className="profile-container">
                    <div className="profile-content">
                        <div className="profile-header-section">
                            <h2 className="profile-name">{user.name}</h2>
                        </div>

                        <div className="profile-main">
                            <div className="profile-section">
                                <div className="section-header">
                                    <h3>Personal Info</h3>
                                    <button 
                                        className="edit-button"
                                        onClick={isEditing.personalInfo ? handleSavePersonalInfo : () => setIsEditing({...isEditing, personalInfo: true})}
                                    >
                                        {isEditing.personalInfo ? 'Save' : 'Edit'}
                                    </button>
                                </div>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <label>Email:</label>
                                        <span>{user.email}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Phone:</label>
                                        {isEditing.personalInfo ? (
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handlePersonalInfoChange}
                                                placeholder="Enter phone number"
                                            />
                                        ) : (
                                            <span>{user.phone || 'Not provided'}</span>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <label>Location:</label>
                                        {isEditing.personalInfo ? (
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handlePersonalInfoChange}
                                                placeholder="Enter location"
                                            />
                                        ) : (
                                            <span>{user.location || 'Not provided'}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="profile-section">
                                <div className="section-header">
                                    <h3>Children</h3>
                                    <button 
                                        className="edit-button"
                                        onClick={() => setIsEditing({...isEditing, children: !isEditing.children})}
                                    >
                                        {isEditing.children ? 'Cancel' : 'Add Child'}
                                    </button>
                                </div>
                                {isEditing.children && (
                                    <div className="add-child-form">
                                        <input
                                            type="text"
                                            placeholder="Child's name"
                                            value={newChild.name}
                                            onChange={(e) => setNewChild({...newChild, name: e.target.value})}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Age"
                                            value={newChild.age}
                                            onChange={(e) => setNewChild({...newChild, age: e.target.value})}
                                        />
                                        <button className="save-button" onClick={handleAddChild}>
                                            Save Child
                                        </button>
                                    </div>
                                )}
                                <div className="children-list">
                                    {children.map((child, index) => (
                                        <div key={child._id || index} className="child-item">
                                            <div className="child-info">
                                                <span>{child.name}</span>
                                                <span className="child-age">Age: {child.age}</span>
                                            </div>
                                            <button 
                                                className="remove-button small"
                                                onClick={() => handleRemoveChild(child._id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bookmarks-section">
                            <h2>My Bookmarked Camps</h2>
                            {error && (
                                <div className="error-message">
                                    {error}
                                    <button onClick={fetchBookmarks} className="retry-button">
                                        Retry
                                    </button>
                                </div>
                            )}
                            {loading ? (
                                <div className="loading-spinner" />
                            ) : bookmarks.length > 0 ? (
                                <div className="bookmarks-grid">
                                    {bookmarks.map((bookmark) => (
                                        <div key={bookmark._id} className="bookmark-card">
                                            <img
                                                src={bookmark.campId?.images?.[0] || '/placeholder-image.jpg'}
                                                alt={bookmark.campId?.name || 'Camp image'}
                                                className="bookmark-image"
                                            />
                                            <div className="bookmark-content">
                                                <h3>{bookmark.campId?.name || 'Unknown Camp'}</h3>
                                                <p>{bookmark.campId?.description || 'No description available'}</p>
                                                <div className="bookmark-actions">
                                                    <button
                                                        onClick={() => window.location.href = `/camps/${bookmark.campId?._id}`}
                                                        className="view-button"
                                                    >
                                                        View Details
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveBookmark(bookmark.campId?._id)}
                                                        className="remove-button"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>You haven't bookmarked any camps yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
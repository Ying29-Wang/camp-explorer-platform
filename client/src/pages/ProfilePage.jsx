import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Header from '../components/layout/Header';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user } = useAuth();
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState({
        personalInfo: false,
        children: false
    });
    const [children, setChildren] = useState([
        { name: '', age: '' },
        { name: '', age: '' }
    ]);

    useEffect(() => {
        if (user) {
            fetchBookmarks();
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
                                        onClick={() => setIsEditing({...isEditing, personalInfo: !isEditing.personalInfo})}
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
                                        <span>{user.phone || 'Not provided'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Location:</label>
                                        <span>{user.location || 'Not provided'}</span>
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
                                        Add Child
                                    </button>
                                </div>
                                <div className="children-list">
                                    {children.map((child, index) => (
                                        <div key={index} className="child-item">
                                            <span>{child.name || 'Child name'}</span>
                                            <button className="edit-button small">Edit</button>
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
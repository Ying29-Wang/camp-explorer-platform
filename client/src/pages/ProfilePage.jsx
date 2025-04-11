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

    useEffect(() => {
        console.log('ProfilePage mounted, user:', user);
        if (user) {
            fetchBookmarks();
        }
    }, [user]);

    const fetchBookmarks = async () => {
        try {
            console.log('Fetching bookmarks...');
            setLoading(true);
            setError(null);
            const response = await api.get('/bookmarks');
            console.log('Bookmarks response:', response.data);
            setBookmarks(response.data);
        } catch (err) {
            console.error('Error fetching bookmarks:', err);
            setError('Failed to load bookmarks. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveBookmark = async (campId) => {
        try {
            console.log('Removing bookmark for camp:', campId);
            await api.delete(`/bookmarks/${campId}`);
            setBookmarks(bookmarks.filter(bookmark => bookmark.campId._id !== campId));
        } catch (err) {
            console.error('Error removing bookmark:', err);
            setError('Failed to remove bookmark. Please try again.');
        }
    };

    if (!user) {
        console.log('No user found, showing login prompt');
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

    console.log('Rendering profile for user:', user);
    return (
        <>
            <Header />
            <div className="profile-container">
                <div className="profile-header">
                    <h1>My Profile</h1>
                    <div className="user-info">
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                    </div>
                </div>

                <div className="bookmarks-section">
                    <h2>My Bookmarks</h2>
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
                                        src={bookmark.campId.images?.[0] || '/placeholder-image.jpg'}
                                        alt={bookmark.campId.name}
                                        className="bookmark-image"
                                    />
                                    <h3>{bookmark.campId.name}</h3>
                                    <p>{bookmark.campId.description}</p>
                                    <button
                                        onClick={() => handleRemoveBookmark(bookmark.campId._id)}
                                        className="remove-bookmark-btn"
                                    >
                                        Remove Bookmark
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>You haven't bookmarked any camps yet.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
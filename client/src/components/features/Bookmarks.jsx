import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import './Bookmarks.css';

const Bookmarks = () => {
    const { isLoggedIn } = useAuth();
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookmarks = async () => {
            if (!isLoggedIn) {
                setLoading(false);
                return;
            }
            
            try {
                console.log('Fetching bookmarks...');
                const response = await api.get('/bookmarks');
                console.log('Bookmarks response:', response.data);
                
                if (!response.data || !Array.isArray(response.data)) {
                    throw new Error('Invalid response format');
                }
                
                setBookmarks(response.data);
            } catch (err) {
                console.error('Error fetching bookmarks:', err);
                console.error('Error details:', {
                    status: err.response?.status,
                    data: err.response?.data,
                    message: err.message
                });
                setError(err.response?.data?.error || 'Failed to load bookmarks');
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, [isLoggedIn]);

    const handleRemoveBookmark = async (campId) => {
        try {
            console.log('Removing bookmark for camp:', campId);
            await api.delete(`/bookmarks/${campId}`);
            setBookmarks(bookmarks.filter(bookmark => bookmark.campId._id !== campId));
        } catch (err) {
            console.error('Error removing bookmark:', err);
            console.error('Error details:', {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message
            });
            setError(err.response?.data?.error || 'Failed to remove bookmark');
        }
    };

    if (!isLoggedIn) return null;

    if (loading) {
        return <div className="loading-spinner"></div>;
    }

    if (error) {
        return (
            <div className="error-message">
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="retry-button">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <section className="bookmarks-section">
            <h2>Your Bookmarked Camps</h2>
            {bookmarks.length === 0 ? (
                <p>You haven't bookmarked any camps yet.</p>
            ) : (
                <div className="bookmarks-grid">
                    {bookmarks.map(bookmark => (
                        <div key={bookmark._id} className="bookmark-card">
                            <Link to={`/camp/${bookmark.campId._id}`}>
                                <img 
                                    src={bookmark.campId.images?.[0] || '/default-camp.jpg'} 
                                    alt={bookmark.campId.name}
                                    className="bookmark-image"
                                />
                                <h3>{bookmark.campId.name}</h3>
                                <p>{bookmark.campId.location}</p>
                            </Link>
                            <button 
                                onClick={() => handleRemoveBookmark(bookmark.campId._id)}
                                className="remove-bookmark-btn"
                            >
                                Remove Bookmark
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Bookmarks; 
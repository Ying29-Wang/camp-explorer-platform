import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Bookmarks = () => {
    const { isLoggedIn } = useAuth();
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookmarks = async () => {
            if (!isLoggedIn) return;
            
            try {
                const response = await axios.get('/api/bookmarks');
                setBookmarks(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load bookmarks');
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, [isLoggedIn]);

    const handleRemoveBookmark = async (campId) => {
        try {
            await axios.delete(`/api/bookmarks/${campId}`);
            setBookmarks(bookmarks.filter(bookmark => bookmark.campId._id !== campId));
        } catch (err) {
            setError('Failed to remove bookmark');
        }
    };

    if (!isLoggedIn) return null;

    if (loading) {
        return <div className="loading-spinner"></div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
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
                                    src={bookmark.campId.image[0] || '/default-camp.jpg'} 
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
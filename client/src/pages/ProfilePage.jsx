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
        children: false,
        password: false
    });
    const [formData, setFormData] = useState({
        phone: user?.phone || '',
        location: user?.location || ''
    });
    const [children, setChildren] = useState(user?.children || []);
    const [newChild, setNewChild] = useState({ 
        firstName: '', 
        lastName: '', 
        dateOfBirth: '',
        interests: []
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

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
            console.log('Bookmarks response:', response.data);
            console.log('First bookmark structure:', JSON.stringify(response.data[0], null, 2));
            if (response.data && Array.isArray(response.data)) {
                setBookmarks(response.data);
            } else {
                console.error('Invalid bookmarks data:', response.data);
                setError('Failed to load bookmarks. Invalid data received.');
            }
        } catch (err) {
            console.error('Error fetching bookmarks:', err);
            setError('Failed to load bookmarks. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveBookmark = async (bookmarkId) => {
        if (!bookmarkId) {
            console.error('No bookmark ID provided');
            setError('Failed to remove bookmark: Invalid bookmark ID');
            return;
        }

        try {
            // Find the bookmark to get the campId
            const bookmarkToRemove = bookmarks.find(b => b._id === bookmarkId);
            if (!bookmarkToRemove || !bookmarkToRemove.campId) {
                console.error('Bookmark or campId not found');
                setError('Failed to remove bookmark: Invalid bookmark data');
                return;
            }

            console.log('Removing bookmark for camp:', bookmarkToRemove.campId._id);
            const response = await api.delete(`/bookmarks/${bookmarkToRemove.campId._id}`);
            console.log('Delete response:', response.data);
            
            if (response.data && response.data.bookmarks) {
                setBookmarks(response.data.bookmarks);
            } else {
                setBookmarks(prevBookmarks => prevBookmarks.filter(bookmark => bookmark._id !== bookmarkId));
            }
            
            setError('');
        } catch (err) {
            console.error('Error removing bookmark:', err);
            console.error('Error response:', err.response);
            console.error('Error response data:', err.response?.data);
            setError(err.response?.data?.message || 'Failed to remove bookmark. Please try again.');
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

    const handleAddChild = async () => {
        if (!newChild.firstName || !newChild.lastName || !newChild.dateOfBirth) {
            setError('Please fill in all child details');
            return;
        }
        try {
            const response = await api.post(`/users/${user._id}/children`, {
                firstName: newChild.firstName,
                lastName: newChild.lastName,
                dateOfBirth: newChild.dateOfBirth,
                interests: newChild.interests
            });
            
            if (response.data && response.data.children) {
                setChildren(response.data.children);
            } else {
                setChildren(prevChildren => [...prevChildren, response.data]);
            }
            
            setNewChild({ firstName: '', lastName: '', dateOfBirth: '', interests: [] });
            setIsEditing(prev => ({ ...prev, children: false }));
            setError('');
        } catch (err) {
            console.error('Error adding child:', err);
            setError(err.response?.data?.message || 'Failed to add child. Please try again.');
        }
    };

    const handleRemoveChild = async (childId) => {
        try {
            const response = await api.delete(`/users/${user._id}/children/${childId}`);
            
            if (response.data && response.data.children) {
                setChildren(response.data.children);
            } else {
                setChildren(prevChildren => prevChildren.filter(child => child._id !== childId));
            }
            
            setError('');
        } catch (err) {
            console.error('Error removing child:', err);
            setError(err.response?.data?.message || 'Failed to remove child. Please try again.');
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        try {
            const response = await api.put('/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            
            if (response.data.msg === 'Password changed successfully') {
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setIsEditing(prev => ({ ...prev, password: false }));
                setError('');
            }
        } catch (err) {
            console.error('Error changing password:', err);
            setError(err.response?.data?.msg || 'Failed to change password. Please try again.');
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
                                        <label>Username:</label>
                                        <span>{user.username}</span>
                                    </div>
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
                                            placeholder="First Name"
                                            value={newChild.firstName}
                                            onChange={(e) => setNewChild({...newChild, firstName: e.target.value})}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Last Name"
                                            value={newChild.lastName}
                                            onChange={(e) => setNewChild({...newChild, lastName: e.target.value})}
                                        />
                                        <input
                                            type="date"
                                            placeholder="Date of Birth"
                                            value={newChild.dateOfBirth}
                                            onChange={(e) => setNewChild({...newChild, dateOfBirth: e.target.value})}
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
                                                <span>{child.firstName} {child.lastName}</span>
                                                <span className="child-age">DOB: {new Date(child.dateOfBirth).toLocaleDateString()}</span>
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

                            <div className="profile-section">
                                <div className="section-header">
                                    <h3>Change Password</h3>
                                    <button 
                                        className="edit-button"
                                        onClick={() => setIsEditing({...isEditing, password: !isEditing.password})}
                                    >
                                        {isEditing.password ? 'Cancel' : 'Change Password'}
                                    </button>
                                </div>
                                {isEditing.password && (
                                    <div className="password-form">
                                        <div className="form-group">
                                            <label>Current Password:</label>
                                            <input
                                                type="password"
                                                name="currentPassword"
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                                placeholder="Enter current password"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>New Password:</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Confirm New Password:</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                        <button 
                                            className="save-button" 
                                            onClick={handleChangePassword}
                                            disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                                        >
                                            Save New Password
                                        </button>
                                    </div>
                                )}
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
                                                        onClick={() => {
                                                            console.log('Bookmark being removed:', bookmark);
                                                            handleRemoveBookmark(bookmark._id);
                                                        }}
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
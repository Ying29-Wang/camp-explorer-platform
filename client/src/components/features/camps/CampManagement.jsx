import React, { useState, useEffect } from 'react';
import { fetchCampsByOwner, createCamp, updateCamp, deleteCamp } from '../../../services/campService';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/layout/Header';
import { CAMP_CATEGORIES } from '../../../constants/campConstants';
import './CampManagement.css';

const CampManagement = () => {
    const [camps, setCamps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingCamp, setEditingCamp] = useState(null);
    const [newCamp, setNewCamp] = useState({
        name: '',
        location: '',
        description: '',
        price: '',
        ageRange: { min: '', max: '' },
        category: '',
        contact: '',
        email: '',
        phone: ''
    });
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

    const handleCreateCamp = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            
            // Only include fields that have values
            const formattedCampData = {
                name: newCamp.name,
                location: newCamp.location,
                ...(newCamp.description && { description: newCamp.description }),
                ...(newCamp.price && { price: Number(newCamp.price) }),
                ...(newCamp.ageRange.min && newCamp.ageRange.max && {
                    ageRange: {
                        min: Number(newCamp.ageRange.min),
                        max: Number(newCamp.ageRange.max)
                    }
                }),
                ...(newCamp.category && { 
                    category: newCamp.category.charAt(0).toUpperCase() + newCamp.category.slice(1).toLowerCase() 
                }),
                ...(newCamp.contact && { contact: newCamp.contact }),
                ...(newCamp.email && { email: newCamp.email }),
                ...(newCamp.phone && { phone: newCamp.phone })
            };

            console.log('Formatted camp data:', formattedCampData);
            const createdCamp = await createCamp(formattedCampData);
            setCamps([...camps, createdCamp]);
            setShowCreateForm(false);
            setNewCamp({
                name: '',
                location: '',
                description: '',
                price: '',
                ageRange: { min: '', max: '' },
                category: '',
                contact: '',
                email: '',
                phone: ''
            });
        } catch (err) {
            console.error('Error creating camp:', err);
            setError(err.message || 'Failed to create camp. Please try again.');
        }
    };

    const handleEditCamp = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            
            // Only include fields that have values
            const formattedCampData = {
                name: editingCamp.name,
                location: editingCamp.location,
                ...(editingCamp.description && { description: editingCamp.description }),
                ...(editingCamp.price && { price: Number(editingCamp.price) }),
                ...(editingCamp.ageRange.min && editingCamp.ageRange.max && {
                    ageRange: {
                        min: Number(editingCamp.ageRange.min),
                        max: Number(editingCamp.ageRange.max)
                    }
                }),
                ...(editingCamp.category && { 
                    category: editingCamp.category.charAt(0).toUpperCase() + editingCamp.category.slice(1).toLowerCase() 
                }),
                ...(editingCamp.contact && { contact: editingCamp.contact }),
                ...(editingCamp.email && { email: editingCamp.email }),
                ...(editingCamp.phone && { phone: editingCamp.phone })
            };

            const updatedCamp = await updateCamp(editingCamp._id, formattedCampData);
            setCamps(camps.map(camp => camp._id === updatedCamp._id ? updatedCamp : camp));
            setEditingCamp(null);
        } catch (err) {
            console.error('Error updating camp:', err);
            setError(err.message || 'Failed to update camp. Please try again.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('ageRange.')) {
            const ageField = name.split('.')[1];
            if (editingCamp) {
                setEditingCamp(prev => ({
                    ...prev,
                    ageRange: {
                        ...prev.ageRange,
                        [ageField]: value
                    }
                }));
            } else {
                setNewCamp(prev => ({
                    ...prev,
                    ageRange: {
                        ...prev.ageRange,
                        [ageField]: value
                    }
                }));
            }
        } else {
            if (editingCamp) {
                setEditingCamp(prev => ({
                    ...prev,
                    [name]: value
                }));
            } else {
                setNewCamp(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
        }
    };

    const startEditing = (camp) => {
        setEditingCamp({
            ...camp,
            price: camp.price?.toString() || '',
            ageRange: {
                min: camp.ageRange?.min?.toString() || '',
                max: camp.ageRange?.max?.toString() || ''
            }
        });
    };

    const cancelEditing = () => {
        setEditingCamp(null);
    };

    const handleDeleteCamp = async (campId) => {
        if (!window.confirm('Are you sure you want to delete this camp? This action cannot be undone.')) {
            return;
        }

        try {
            setError(null);
            await deleteCamp(campId);
            setCamps(camps.filter(camp => camp._id !== campId));
        } catch (err) {
            console.error('Error deleting camp:', err);
            setError(err.message || 'Failed to delete camp. Please try again.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="camp-management">
            <Header />
            <div className="camp-management-container">
                <div className="camps-list-section">
                    <div className="section-header">
                        <h3>Your Camps</h3>
                        <button 
                            className="create-camp-btn"
                            onClick={() => setShowCreateForm(true)}
                        >
                            Create New Camp
                        </button>
                    </div>

                    {showCreateForm && (
                        <div className="create-camp-form">
                            <h4>Create New Camp</h4>
                            <form onSubmit={handleCreateCamp}>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newCamp.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={newCamp.location}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        value={newCamp.description}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={newCamp.price}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Age Range</label>
                                    <div className="age-range-inputs">
                                        <input
                                            type="number"
                                            name="ageRange.min"
                                            value={newCamp.ageRange.min}
                                            onChange={handleInputChange}
                                            placeholder="Min"
                                        />
                                        <input
                                            type="number"
                                            name="ageRange.max"
                                            value={newCamp.ageRange.max}
                                            onChange={handleInputChange}
                                            placeholder="Max"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        name="category"
                                        value={newCamp.category}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select a category</option>
                                        {CAMP_CATEGORIES.map(category => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Contact</label>
                                    <input
                                        type="text"
                                        name="contact"
                                        value={newCamp.contact}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={newCamp.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={newCamp.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="submit-btn">Create Camp</button>
                                    <button 
                                        type="button" 
                                        className="cancel-btn"
                                        onClick={() => setShowCreateForm(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {camps.length === 0 ? (
                        <div className="no-camps-message">You haven't added any camps yet.</div>
                    ) : (
                        <div className="camps-list">
                            {camps.map(camp => (
                                <div key={camp._id} className="camp-card">
                                    {editingCamp?._id === camp._id ? (
                                        <form onSubmit={handleEditCamp} className="edit-camp-form">
                                            <div className="form-group">
                                                <label>Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={editingCamp.name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Location</label>
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={editingCamp.location}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Description</label>
                                                <textarea
                                                    name="description"
                                                    value={editingCamp.description}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Price</label>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={editingCamp.price}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Age Range</label>
                                                <div className="age-range-inputs">
                                                    <input
                                                        type="number"
                                                        name="ageRange.min"
                                                        value={editingCamp.ageRange.min}
                                                        onChange={handleInputChange}
                                                        placeholder="Min"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="ageRange.max"
                                                        value={editingCamp.ageRange.max}
                                                        onChange={handleInputChange}
                                                        placeholder="Max"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Category</label>
                                                <select
                                                    name="category"
                                                    value={editingCamp.category}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="">Select a category</option>
                                                    {CAMP_CATEGORIES.map(category => (
                                                        <option key={category} value={category}>
                                                            {category}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Contact</label>
                                                <input
                                                    type="text"
                                                    name="contact"
                                                    value={editingCamp.contact}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={editingCamp.email}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Phone</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={editingCamp.phone}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="form-actions">
                                                <button type="submit" className="submit-btn">Save Changes</button>
                                                <button 
                                                    type="button" 
                                                    className="cancel-btn"
                                                    onClick={cancelEditing}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <h4>{camp.name}</h4>
                                            {camp.description && <p>{camp.description}</p>}
                                            <p>Location: {camp.location}</p>
                                            {camp.price && <p>Price: ${camp.price}</p>}
                                            {camp.ageRange?.min && camp.ageRange?.max && (
                                                <p>Age Range: {camp.ageRange.min}-{camp.ageRange.max}</p>
                                            )}
                                            {camp.category && <p>Category: {camp.category}</p>}
                                            {camp.contact && <p>Contact: {camp.contact}</p>}
                                            {camp.email && <p>Email: {camp.email}</p>}
                                            {camp.phone && <p>Phone: {camp.phone}</p>}
                                            <div className="camp-actions">
                                                <button 
                                                    className="edit-btn"
                                                    onClick={() => startEditing(camp)}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="delete-btn"
                                                    onClick={() => handleDeleteCamp(camp._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
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
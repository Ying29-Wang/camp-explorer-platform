import React, { useState, useEffect } from 'react';
import { fetchCampsByOwner, createCamp, updateCamp, deleteCamp, getCoordinatesFromLocation } from '../../../services/campService';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/layout/Header';
import './CampManagement.css';

const CampManagement = () => {
    const [camps, setCamps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingCamp, setEditingCamp] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        price: '',
        ageRange: { min: '', max: '' },
        category: '',
        activities: '',
        startDate: '',
        endDate: '',
        capacity: '',
        image: '',
        website: '',
        contact: '',
        email: '',
        phone: ''
    });
    const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
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

    const generateDescription = async () => {
        if (!formData.name || !formData.activities || !formData.category) {
            setError('Please fill in name, activities, and category first');
            return;
        }

        setIsGeneratingDescription(true);
        setError(null);

        try {
            const prompt = `Generate a compelling 150-word description for a ${formData.category} camp called "${formData.name}" offering ${formData.activities}. Use an enthusiastic tone:`;
            
            // Replace with your actual AI service call
            const response = await fetch('/api/ai/generate-description', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) throw new Error('AI generation failed');

            const data = await response.json();
            setFormData(prev => ({
                ...prev,
                description: data.description || 'Could not generate description'
            }));
        } catch (err) {
            console.error('AI generation error:', err);
            setError(err.message || 'Failed to generate description');
        } finally {
            setIsGeneratingDescription(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'minAge' || name === 'maxAge') {
            setFormData(prev => ({
                ...prev,
                ageRange: {
                    ...prev.ageRange,
                    [name === 'minAge' ? 'min' : 'max']: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Get coordinates from location
            const coordinates = await getCoordinatesFromLocation(formData.location);
            if (!coordinates) {
                throw new Error('Could not find coordinates for the given location');
            }

            // Convert activities string to array
            const activitiesArray = formData.activities.split(',').map(activity => activity.trim());
            
            // Convert dates to proper format
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);
            
            // Convert age range to numbers
            const ageRange = {
                min: parseInt(formData.ageRange.min),
                max: parseInt(formData.ageRange.max)
            };

            // Convert price to number
            const price = parseFloat(formData.price);
            
            // Convert capacity to number
            const capacity = parseInt(formData.capacity);

            // Prepare camp data with all required fields
            const campData = {
                name: formData.name,
                description: formData.description,
                location: formData.location,
                coordinates: coordinates,
                formattedAddress: formData.location,
                ageRange: ageRange,
                category: formData.category,
                activities: activitiesArray,
                price: price,
                image: [formData.image],
                website: formData.website,
                contact: formData.contact,
                email: formData.email,
                phone: formData.phone,
                startDate: startDate,
                endDate: endDate,
                capacity: capacity
            };

            if (editingCamp) {
                await updateCamp(editingCamp._id, campData);
            } else {
                await createCamp(campData);
            }
            
            setEditingCamp(null);
            setFormData({
                name: '',
                description: '',
                location: '',
                price: '',
                ageRange: { min: '', max: '' },
                category: '',
                activities: '',
                startDate: '',
                endDate: '',
                capacity: '',
                image: '',
                website: '',
                contact: '',
                email: '',
                phone: ''
            });
            await loadCamps();
        } catch (err) {
            console.error('Error saving camp:', err);
            setError(err.message || 'Failed to save camp');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this camp?')) {
            try {
                await deleteCamp(id);
                await loadCamps();
            } catch (err) {
                setError(err.message || 'Failed to delete camp');
            }
        }
    };

    const handleEdit = (camp) => {
        setEditingCamp(camp);
        setFormData({
            name: camp.name,
            description: camp.description,
            location: camp.location,
            price: camp.price,
            ageRange: camp.ageRange,
            category: camp.category,
            activities: camp.activities.join(', '),
            startDate: camp.startDate?.split('T')[0] || '',
            endDate: camp.endDate?.split('T')[0] || '',
            capacity: camp.capacity,
            image: camp.image?.[0] || '',
            website: camp.website || '',
            contact: camp.contact || '',
            email: camp.email || '',
            phone: camp.phone || ''
        });
    };

    return (
        <div className="camp-management">
            <Header />
            <div className="camp-management-content">
                <h2>Manage Your Camps</h2>
                
                {error && (
                    <div className="error-message">
                        {error}
                        <button onClick={loadCamps} className="retry-button">
                            Try Again
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="loading-message">Loading your camps...</div>
                ) : (
                    <div className="camp-management-layout">
                        <div className="camp-form-section">
                            <div className="form-header">
                                <h3>{editingCamp ? 'Edit Camp' : 'Add New Camp'}</h3>
                                {!editingCamp && !showForm && (
                                    <button 
                                        onClick={() => setShowForm(true)} 
                                        className="add-camp-button"
                                    >
                                        Add New Camp
                                    </button>
                                )}
                            </div>
                            
                            {(showForm || editingCamp) && (
                                <form onSubmit={handleSubmit} className="camp-form">
                                    <div className="form-group">
                                        <label>Camp Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Description</label>
                                        <div className="description-group">
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={generateDescription}
                                                disabled={isGeneratingDescription}
                                                className="ai-generate-btn"
                                            >
                                                {isGeneratingDescription ? 'Generating...' : 'AI Enhance'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Price</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Age Range</label>
                                        <div className="age-range-inputs">
                                            <input
                                                type="number"
                                                name="minAge"
                                                placeholder="Min Age"
                                                value={formData.ageRange.min}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <input
                                                type="number"
                                                name="maxAge"
                                                placeholder="Max Age"
                                                value={formData.ageRange.max}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            <option value="Adventure">Adventure</option>
                                            <option value="Sports">Sports</option>
                                            <option value="Arts">Arts</option>
                                            <option value="Science">Science</option>
                                            <option value="Technology">Technology</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Activities (comma separated)</label>
                                        <input
                                            type="text"
                                            name="activities"
                                            value={formData.activities}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Start Date</label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>End Date</label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Capacity</label>
                                        <input
                                            type="number"
                                            name="capacity"
                                            value={formData.capacity}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Image URL</label>
                                        <input
                                            type="text"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Website</label>
                                        <input
                                            type="url"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Contact Person</label>
                                        <input
                                            type="text"
                                            name="contact"
                                            value={formData.contact}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="submit-btn">
                                            {editingCamp ? 'Update Camp' : 'Add Camp'}
                                        </button>
                                        <button 
                                            type="button" 
                                            className="cancel-btn"
                                            onClick={() => {
                                                setShowForm(false);
                                                setEditingCamp(null);
                                                setFormData({
                                                    name: '',
                                                    description: '',
                                                    location: '',
                                                    price: '',
                                                    ageRange: { min: '', max: '' },
                                                    category: '',
                                                    activities: '',
                                                    startDate: '',
                                                    endDate: '',
                                                    capacity: '',
                                                    image: '',
                                                    website: '',
                                                    contact: '',
                                                    email: '',
                                                    phone: ''
                                                });
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

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
                                            <div className="camp-actions">
                                                <button onClick={() => handleEdit(camp)}>Edit</button>
                                                <button onClick={() => handleDelete(camp._id)}>Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CampManagement;
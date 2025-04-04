import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { createCamp, updateCamp, deleteCamp, fetchCamps } from '../../../services/campService';
import './CampManagement.css';

const CampManagement = () => {
    const { user } = useAuth();
    const [camps, setCamps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingCamp, setEditingCamp] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        category: '',
        price: '',
        website: '',
        contact: '',
        email: '',
        phone: '',
        startDate: '',
        endDate: '',
        capacity: '',
        activities: []
    });

    useEffect(() => {
        // Check if user has permission to access this page
        if (!user || (user.role !== 'admin' && user.role !== 'camp_owner')) {
            setError('You do not have permission to access this page');
            setLoading(false);
            return;
        }
        fetchCampsList();
    }, [user]);

    const fetchCampsList = async () => {
        try {
            const data = await fetchCamps();
            // Filter camps based on user role
            const filteredCamps = user.role === 'admin' 
                ? data 
                : data.filter(camp => camp.createdBy === user.id);
            setCamps(filteredCamps);
            setLoading(false);
        } catch {
            setError('Failed to fetch camps');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCamp) {
                await updateCamp(editingCamp._id, formData);
            } else {
                await createCamp(formData);
            }
            setEditingCamp(null);
            setFormData({
                name: '',
                description: '',
                location: '',
                category: '',
                price: '',
                website: '',
                contact: '',
                email: '',
                phone: '',
                startDate: '',
                endDate: '',
                capacity: '',
                activities: []
            });
            fetchCampsList();
        } catch (error) {
            setError(error.message || 'Failed to save camp');
        }
    };

    const handleEdit = (camp) => {
        // Check if user has permission to edit this camp
        if (user.role !== 'admin' && camp.createdBy !== user.id) {
            setError('You do not have permission to edit this camp');
            return;
        }
        setEditingCamp(camp);
        setFormData({
            name: camp.name,
            description: camp.description,
            location: camp.location,
            category: camp.category,
            price: camp.price,
            website: camp.website,
            contact: camp.contact,
            email: camp.email,
            phone: camp.phone,
            startDate: camp.startDate,
            endDate: camp.endDate,
            capacity: camp.capacity,
            activities: camp.activities
        });
    };

    const handleDelete = async (campId) => {
        // Check if user has permission to delete this camp
        const camp = camps.find(c => c._id === campId);
        if (user.role !== 'admin' && camp.createdBy !== user.id) {
            setError('You do not have permission to delete this camp');
            return;
        }

        if (window.confirm('Are you sure you want to delete this camp?')) {
            try {
                await deleteCamp(campId);
                fetchCampsList();
            } catch (error) {
                setError(error.message || 'Failed to delete camp');
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="camp-management">
            <h2>Camp Management</h2>
            
            <form onSubmit={handleSubmit} className="camp-form">
                <div className="form-group">
                    <label>Name</label>
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
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    />
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
                    <label>Category</label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
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

                <button type="submit" className="submit-btn">
                    {editingCamp ? 'Update Camp' : 'Create Camp'}
                </button>
            </form>

            <div className="camps-list">
                <h3>{user.role === 'admin' ? 'All Camps' : 'Your Camps'}</h3>
                {camps.map(camp => (
                    <div key={camp._id} className="camp-item">
                        <div className="camp-item-content">
                            <div className="camp-item-info">
                                <h4>{camp.name}</h4>
                                <p>{camp.location} • {camp.category}</p>
                            </div>
                            <div className="camp-actions">
                                <button onClick={() => handleEdit(camp)}>Edit</button>
                                <button onClick={() => handleDelete(camp._id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CampManagement; 
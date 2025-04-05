import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { fetchUsers, updateUser, deleteUser } from '../../../services/userService';
import './UserManagement.css';

const UserManagement = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: ''
    });

    useEffect(() => {
        if (user?.role !== 'admin') {
            setError('Access denied. Admin only.');
            setLoading(false);
            return;
        }
        loadUsers();
    }, [user]);

    const loadUsers = async () => {
        try {
            const data = await fetchUsers();
            setUsers(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
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

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            role: user.role
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(editingUser._id, formData);
            setEditingUser(null);
            setFormData({
                username: '',
                email: '',
                role: ''
            });
            loadUsers();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId);
                loadUsers();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="user-management">
            <h2>User Management</h2>
            
            {editingUser && (
                <form onSubmit={handleSubmit} className="user-form">
                    <h3>Edit User</h3>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
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
                        <label>Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="parent">Parent</option>
                            <option value="camp_owner">Camp Owner</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="form-actions">
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={() => setEditingUser(null)}>Cancel</button>
                    </div>
                </form>
            )}

            <div className="users-list">
                <h3>All Users</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button onClick={() => handleEdit(user)}>Edit</button>
                                    <button onClick={() => handleDelete(user._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement; 
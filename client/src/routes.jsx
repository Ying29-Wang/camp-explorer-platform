import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import App from './App';
import SearchResults from './pages/SearchResults';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ProfilePage from './pages/ProfilePage';
import CampDetailsPage from './pages/CampDetailsPage';
import CampManagement from './components/features/camps/CampManagement';
import UserManagement from './components/features/admin/UserManagement';
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './components/common/LoadingSpinner';

const ProtectedRoute = ({ children, roles }) => {
    const { user, isLoading } = useAuth();
    
    if (isLoading) {
        return <LoadingSpinner />;
    }
    
    if (!user) {
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <Router>
            <AuthProvider>
                <SearchProvider>
                    <Routes>
                        <Route path="*" element={<App />} />
                        <Route path="/search" element={<SearchResults />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegistrationPage />} />
                        <Route 
                            path="/profile" 
                            element={
                                <ProtectedRoute roles={['admin', 'user', 'camp_owner', 'parent']}>
                                    <ProfilePage />
                                </ProtectedRoute>
                            } 
                        />
                        <Route path="/camps/:id" element={<CampDetailsPage />} />
                        <Route 
                            path="/manage-camps" 
                            element={
                                <ProtectedRoute roles={['admin', 'camp_owner']}>
                                    <CampManagement />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/manage-users" 
                            element={
                                <ProtectedRoute roles={['admin']}>
                                    <UserManagement />
                                </ProtectedRoute>
                            } 
                        />
                    </Routes>
                </SearchProvider>
            </AuthProvider>
        </Router>
    );
};

export default AppRoutes;
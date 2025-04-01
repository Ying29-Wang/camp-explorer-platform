import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import App from './App';
import SearchResults from './pages/SearchResults';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ProfilePage from './pages/ProfilePage';
import CampDetailsPage from './pages/CampDetailsPage';

const AppRoutes = () => {
    return (
        <Router>
            <AuthProvider>
                <SearchProvider>
                    <Routes>
                        <Route path="/" element={<App />} />
                        <Route path="/search" element={<SearchResults />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegistrationPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/camps/:id" element={<CampDetailsPage />} />
                    </Routes>
                </SearchProvider>
            </AuthProvider>
        </Router>
    );
};

export default AppRoutes;
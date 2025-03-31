import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import SearchResults from './pages/SearchResults';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ProfilePage from './pages/ProfilePage';
import CampDetailsPage from './pages/CampDetailsPage';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/camps/:id" element={<CampDetailsPage />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
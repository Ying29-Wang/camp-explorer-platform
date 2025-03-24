import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import SearchResults from './pages/SearchResults'; // Ensure this path is correct

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/search" element={<SearchResults />} />
                {/* Add more routes here */}
            </Routes>
        </Router>
    );
};

export default AppRoutes;
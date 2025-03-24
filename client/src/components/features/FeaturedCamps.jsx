import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCamps } from '../../services/campService';
import './FeaturedCamps.css';
import camp1 from '../../assets/camp1.jpg';
import camp2 from '../../assets/camp2.jpg';
import camp3 from '../../assets/camp3.jpg';

const FeaturedCamps = () => {
  const [featuredCamps, setFeaturedCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCamps = async () => {
      try {
        const data = await fetchCamps(); // Fetch camps from the backend
        setFeaturedCamps(data.slice(0, 6)); // Get first 6 camps
        setLoading(false);
      } catch (error) {
        console.error('Error fetching camps:', error);
        setLoading(false);
      }
    };
    getCamps();
  }, []);

  // Fallback mock data if backend data is not available
  const fallbackCamps = [
    { _id: 1, image: camp1, name: 'Adventure Camp', location: 'Default Location', ageRange: { min: 5, max: 12 }, price: 100 },
    { _id: 2, image: camp2, name: 'Creative Arts Camp', location: 'Default Location', ageRange: { min: 6, max: 14 }, price: 120 },
    { _id: 3, image: camp3, name: 'Science Explorers Camp', location: 'Default Location', ageRange: { min: 7, max: 15 }, price: 150 },
  ];

  const campsToDisplay = loading ? fallbackCamps : featuredCamps;

  return (
    <section className="featured-camps">
      <h2>Featured Camps</h2>
      <div className="camp-grid">
        {campsToDisplay.map((camp) => (
          <div key={camp._id} className="camp-card">
            <img src={camp.image || 'default-camp.jpg'} alt={camp.name} />
            <h3>{camp.name}</h3>
            <p>{camp.location}</p>
            <p>Ages: {camp.ageRange.min}-{camp.ageRange.max}</p>
            <p>${camp.price}</p>
            <Link to={`/camps/${camp._id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCamps;
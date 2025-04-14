import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';
import camp1 from '../../assets/camp1.jpg';
import camp2 from '../../assets/camp2.jpg';
import camp3 from '../../assets/camp3.jpg';
import './FeaturedCamps.css';

const FeaturedCamps = () => {
  const { searchResults, setSearchResults, searchCamps } = useSearch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fallback mock data if backend data is not available
  const fallbackCamps = [
    { _id: 1, image: camp1, name: 'Adventure Camp', location: 'Default Location', ageRange: { min: 5, max: 12 }, price: 100 },
    { _id: 2, image: camp2, name: 'Creative Arts Camp', location: 'Default Location', ageRange: { min: 6, max: 14 }, price: 120 },
    { _id: 3, image: camp3, name: 'Science Explorers Camp', location: 'Default Location', ageRange: { min: 7, max: 15 }, price: 150 },
  ];

  useEffect(() => {
    const getCamps = async () => {
      try {
        const results = await searchCamps({});
        if (results && results.length > 0) {
          // display 6 camps
          let processedData = results.slice(0, 6).map((camp, index) => ({
            ...camp,
            _id: camp._id || index + 1,
            image: camp.images?.[0] || [camp1, camp2, camp3][index % 3],
            name: camp.name || `Camp ${index + 1}`,
            location: camp.location || 'Default Location',
            ageRange: camp.ageRange || { min: 5, max: 15 },
            price: camp.price || 100 + (index * 20)
          }));

          // if the backend data is less than 6, use the fallback data to supplement
          if (processedData.length < 6) {
            const remainingCount = 6 - processedData.length;
            const additionalCamps = fallbackCamps.slice(0, remainingCount).map((camp, index) => ({
              ...camp,
              _id: `fallback-${index + processedData.length + 1}`
            }));
            processedData = [...processedData, ...additionalCamps];
          }

          setSearchResults(processedData);
          setError(false);
        } else {
          console.log('No data received from backend');
          setError(true);
        }
      } catch (error) {
        console.error('Error fetching camps:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    getCamps();
  }, []);

  // Only use complete fallbackCamps when loading fails or no data is available
  const campsToDisplay = error ? fallbackCamps : searchResults;
  console.log('Camps to display:', campsToDisplay);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="featured-camps">
      <h2>Featured Camps</h2>
      <div className="camp-grid">
        {campsToDisplay.map((camp) => (
          <div key={camp._id} className="camp-card">
            <img 
              src={camp.image || camp.images?.[0] || [camp1, camp2, camp3][Math.floor(Math.random() * 3)]} 
              alt={camp.name} 
              className="camp-image"
              onError={(e) => {
                e.target.src = [camp1, camp2, camp3][Math.floor(Math.random() * 3)];
              }}
            />
            <div className="camp-card-content">
              <h3>{camp.name}</h3>
              <p>{camp.location}</p>
              <p>Ages: {camp.ageRange.min}-{camp.ageRange.max}</p>
              <p>${camp.price}</p>
              <Link to={`/camps/${camp._id}`}>View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCamps;
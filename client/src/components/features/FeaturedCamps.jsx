import React from 'react';
import './FeaturedCamps.css';
import camp1 from '../../assets/camp1.jpg';
import camp2 from '../../assets/camp2.jpg';
import camp3 from '../../assets/camp3.jpg';

const FeaturedCamps = () => {
  const featuredCamps = [
    { id: 1, image: camp1, text: 'Adventure Camp' },
    { id: 2, image: camp2, text: 'Creative Arts Camp' },
    { id: 3, image: camp3, text: 'Science Explorers Camp' },
  ];

  return (
    <section className="featured-camps">
      <h2>Featured Camps</h2>
      <div className="camp-grid">
        {featuredCamps.map((camp) => (
          <div key={camp.id} className="camp-card">
            <img src={camp.image} alt={`Camp ${camp.id}`} />
            <p>{camp.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCamps;
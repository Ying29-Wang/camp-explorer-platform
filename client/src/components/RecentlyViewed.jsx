import React from 'react';
import './RecentlyViewed.css';
import camp1 from '../assets/camp1.jpg'; // Ensure this path is correct
import camp2 from '../assets/camp2.jpg';
import camp3 from '../assets/camp3.jpg';

const RecentlyViewed = ({ camps }) => {
  if (!camps || camps.length === 0) return null;

  const recentlyViewedCamps = [
    { id: 1, image: camp1, name: 'Camp 1' },
    { id: 2, image: camp2, name: 'Camp 2' },
    { id: 3, image: camp3, name: 'Camp 3' },
  ];

  return (
    <section className="recently-viewed">
      <h2>Recently Viewed</h2>
      <div className="camp-list">
        {recentlyViewedCamps.map((camp) => (
          <div key={camp.id} className="camp-item">
            <img src={camp.image} alt={`Camp ${camp.id}`} />
            <p>{camp.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
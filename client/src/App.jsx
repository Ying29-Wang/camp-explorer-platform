import React, { useState } from 'react';
import Header from './components/layout/Header';
import FeaturedCamps from './components/features/FeaturedCamps';
import RecentlyViewed from './components/features/RecentlyViewed';
import Footer from './components/common/Footer';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulate login state
  const recentlyViewedCamps = []; // Fetch or simulate recently viewed camps

  return (
    <div className="homepage">
      <Header isLoggedIn={isLoggedIn} />
      <main>
        <section className="hero">
          <h1>Find the Perfect Camp</h1>
        </section>
        <FeaturedCamps />
        {isLoggedIn && <RecentlyViewed camps={recentlyViewedCamps} />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
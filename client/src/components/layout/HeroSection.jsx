const HeroSection = ({ searchQuery, onSearchChange, onSearchSubmit }) => {
    return (
      <section className="hero">
        <h1>Find the Perfect Camp</h1>
        <form onSubmit={onSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search camps..."
            value={searchQuery}
            onChange={onSearchChange}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </section>
    );
  };
  
  export default HeroSection;
import React from 'react';
import './filter.css'; // Make sure to create this CSS file

function Filter() {
  const filters = [
    "All",
    "Historical",
    "Cultural",
    "Natural",
    "LandScope",
    "Urban",
    "Modern",
    "Spritual",
    "Ethnic"
 ];

  return (
    <div className="filter-container">
      {filters.map((filter, index) => (
        <button key={index} className="filter-button">
          {filter}
        </button>
      ))}
    </div>
  );
}

export default Filter;

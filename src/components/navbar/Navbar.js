import React, { useState } from 'react';
import './NavBar.css';

const Navbar = ({ setSelectedTab, setSearchValue }) => {
  return (
    <div className="navbar-container">
      {/* Logo Section */}
      

      {/* Search Section */}
      <div className="navbar-search">
        <input
          type="text"
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search"
          className="search-input"
        />
      </div>
    </div>
  );
};

export default Navbar; 



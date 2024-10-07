import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './dropDown.css';

function DropDownMenu() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:4000/profile', { withCredentials: true });
        if (response.status === 200) {
          setAuthState({
            isAuthenticated: true,
            user: response.data,
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
          });
        }
      } catch (error) {
        console.error('Error fetching user info:', error.response ? error.response.data : error.message);
        setAuthState({
          isAuthenticated: false,
          user: null,
        });
      }
    };
    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:4000/logout', { withCredentials: true });
      setAuthState({
        isAuthenticated: false,
        user: null,
      });
    } catch (error) {
      console.error('Error logging out:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="dropDownMenu">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/About">About</Link></li>
        <li><Link to="/contactus">Contact us</Link></li>
        {authState.isAuthenticated && authState.user && (
          <>
            {authState.user.role === ('officer','admin') && (
              <>
                <li><Link to="/New">New Item</Link></li>
                <li><Link to="/addhotel">New Hotel</Link></li>
                <li><Link to="/items-list">Items List</Link></li>
                <li><Link to="/reserved">Reserved List</Link></li>
              </>
            )}
            {authState.user.role === 'admin' && (
              <>
                <li><Link to="/officers">Officers</Link></li>
              </>
            )}
            <li><button onClick={handleLogout}></button></li>
          </>
        )}
      </ul>
    </div>
  );
}

export default DropDownMenu;

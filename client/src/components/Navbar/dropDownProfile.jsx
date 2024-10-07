import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './dropDown.css';

const DropDownProfile = () => {
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
          // Handle cases where the response status is not 200
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
    <div className="dropDownProfile">
      <ul>
        {authState.isAuthenticated ? (
          <>
            <li><Link to="/myreserve">My Reserved Lists</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/signup">Signup</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        )}
      </ul>
    </div>
  );
};

export default DropDownProfile;

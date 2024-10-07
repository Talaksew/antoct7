import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Stack, Button, Menu, MenuItem } from '@mui/material';
import "./navbar.css";

function Navbar() {
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
  });

  //const navigate = useNavigate();

  const handleProfileClick = (event) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleCloseProfile = () => {
    setAnchorElProfile(null);
  };

  const openProfile = Boolean(anchorElProfile);

  const handleMenuClick = (event) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  const openMenu = Boolean(anchorElMenu);

  useEffect(() => {
    const checkAuthStatus = async () => {
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
        console.error('Error checking authentication:', error.message);
        setAuthState({
          isAuthenticated: false,
          user: null,
        });
      }
    };

    checkAuthStatus();

    // Optionally, use an interval to re-check the authentication status
    const authCheckInterval = setInterval(checkAuthStatus, 10 * 60 * 1000); // Re-check every 10 minutes

    return () => clearInterval(authCheckInterval); // Cleanup the interval on unmount
  }, []);

  const handleLogout = async () => {
    try {
        await axios.get('http://localhost:4000/logout', { withCredentials: true });
        setAuthState({
            isAuthenticated: false,
            user: null,
        });
        
        // Refresh the page immediately after logging out
        window.location.reload();
    } catch (error) {
        console.error('Error logging out:', error.message);
    }window.location.reload();
};

  return (
    <div className="navbar">
      <div className="navbar__logo">
        <h1>African Talent Network</h1>
      </div>
      <div className="navbar__center">
        <input type="text" placeholder="Search ..." />
        <SearchIcon />
      </div>
      <div className="navbar__right">
        <Stack direction="row" spacing={2}>
          <Button
            id="profile-menu"
            color="inherit"
            onClick={handleProfileClick}
            aria-controls={openProfile ? 'profile-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openProfile ? 'true' : undefined}
          >
            <AccountCircleIcon />
          </Button>
          <Button
            id="main-menu"
            onClick={handleMenuClick}
            aria-controls={openMenu ? 'main-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? 'true' : undefined}
            aria-label="main-menu"
          >
            <MenuIcon />
          </Button>
        </Stack>

        <Menu
          id="profile-menu"
          anchorEl={anchorElProfile}
          open={openProfile}
          onClose={handleCloseProfile}
          MenuListProps={{ 'aria-labelledby': 'profile-button' }}
        >
          {authState.isAuthenticated ? (
            <>
              <MenuItem onClick={handleCloseProfile}>
                <Link to="/myreserve">My Reserved Lists</Link>
              </MenuItem>
              <MenuItem onClick={handleCloseProfile}>
                <Link to="/profile">Profile</Link>
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </>
          ) : (
            <>
              <MenuItem onClick={handleCloseProfile}>
                <Link to="/signup">Signup</Link>
              </MenuItem>
              <MenuItem onClick={handleCloseProfile}>
                <Link to="/login">Login</Link>
              </MenuItem>
            </>
          )}
        </Menu>

        <Menu
          id="main-menu"
          anchorEl={anchorElMenu}
          open={openMenu}
          onClose={handleCloseMenu}
          MenuListProps={{ 'aria-labelledby': 'menu-button' }}
        >
          <MenuItem onClick={handleCloseMenu}>
            <Link to="/">Home</Link>
          </MenuItem>
          <MenuItem onClick={handleCloseMenu}>
            <Link to="/about">About</Link>
          </MenuItem>
          <MenuItem onClick={handleCloseMenu}>
            <Link to="/contactus">Contact Us</Link>
          </MenuItem>

          {authState.isAuthenticated && authState.user && (
            <>
              <MenuItem onClick={handleCloseMenu}>
                <Link to="/New">New Item</Link>
              </MenuItem>
              <MenuItem onClick={handleCloseMenu}>
                <Link to="/addhotel">New Hotel</Link>
              </MenuItem>
              <MenuItem onClick={handleCloseMenu}>
                <Link to="/itemsList">Items List</Link>
              </MenuItem>
              <MenuItem onClick={handleCloseMenu}>
                <Link to="/reservedList">Reserved List</Link>
              </MenuItem>
              {authState.user.role === 'admin' && (
                <MenuItem onClick={handleCloseMenu}>
                  <Link to="/officers">Officers</Link>
                </MenuItem>
              )}
            </>
          )}
        </Menu>
      </div>
    </div>
  );
}

export default Navbar;


//

// useEffect(() => {
//   const fetchAuthStatus = async () => {
//     try {
//       const response = await axios.get('/api/auth/status');
//       setAuthState({
//         isAuthenticated: response.data.isAuthenticated,
//         user: response.data.user,
//       });
//     } catch (error) {
//       console.error('Error fetching authentication status:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchAuthStatus();
// }, []);
// const [authState, setAuthState] = useState({
//   isAuthenticated: false,
//   user: null,
// });

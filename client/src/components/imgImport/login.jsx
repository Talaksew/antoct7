import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './imgImport.css';
//import GoogleIcon from '@mui/icons-material/Google';
import { Box, TextField, Typography } from '@mui/material';

const Login = () => {
  // State for user data
  const [userData, setUserData] = useState({
    username: '',
    password: '',
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send user data to backend
      const response = await axios.post('http://localhost:4000/login', userData, {
        withCredentials: true, // Include this to ensure cookies are sent
      });

      // Handle success
      console.log('Logged in successfully:', response.data);
      alert('Logged in successfully!');
      // Redirect to the home page or any other page
      window.location.href = '/home';
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging fed in');
    }
  };

  // Handle input changes
  const handleUserChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

//  Google login handler
  const handleGoogleLogin = () => {
    // Implement your Google login logic here
    window.location.href = 'http://localhost:4000/auth/google';
  
    //   console.log('Google login clicked');
    
  };

  return (
    <div className="img offer">
<div className="secContainer">
      <h1>Login ...</h1>
      
<div className="loginGoogle">
      <button className="googleButton" onClick={handleGoogleLogin}>
      <Box
  sx={{
    display: 'inline-block',
    background: 'linear-gradient(45deg, #DB4437, #F4B400, #0F9D58, #4285F4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: 'inherit',
  }}
>
   {/* <GoogleIcon /> 
</Box>     */}
<svg width="18" height="18" viewBox="0 0 24 24">
  <g fill="none">
    <path fill="#4285F4" d="M23.49,12.27 C23.49,11.48 23.42,10.73 23.3,10 L12,10 L12,14.51 L18.47,14.51 C18.18,15.99 17.33,17.24 16.07,18.09 L16.07,21.09 L19.93,21.09 C22.19,19 23.49,15.92 23.49,12.27 Z"></path>
    <path fill="#34A853" d="M12,24 C15.24,24 17.95,22.92 19.93,21.09 L16.07,18.09 C14.99,18.81 13.62,19.25 12,19.25 C8.87,19.25 6.22,17.14 5.27,14.29 L1.29,14.29 L1.29,17.38 C3.26,21.3 7.31,24 12,24 Z"></path>
    <path fill="#FBBC05" d="M5.27,14.29 C5.02,13.57 4.89,12.8 4.89,12 C4.89,11.2 5.03,10.43 5.27,9.71 L5.27,6.62 L1.29,6.62 C0.47,8.24 0,10.06 0,12 C0,13.94 0.47,15.76 1.29,17.38 L5.27,14.29 Z"></path><path fill="#EA4335" d="M12,4.75 C13.77,4.75 15.35,5.36 16.6,6.55 L20.02,3.13 C17.95,1.19 15.24,0 12,0 C7.31,0 3.26,2.7 1.29,6.62 L5.27,9.71 C6.22,6.86 8.87,4.75 12,4.75 Z"></path>
  </g>
  </svg>
  </Box>      Login with Google
         </button>
        </div>

    <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{ width: '100%', marginY: 2 }}
  >
    <Box
      sx={{
        flexGrow: 1,
        height: '1px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        marginRight: 1.5,
      }}
    />
    <Typography
      variant="body1"
      sx={{ color: 'rgba(0, 0, 0, 0.5)' }}
    >
      or
    </Typography>
    <Box
      sx={{
        flexGrow: 1,
        height: '1px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        marginLeft: 1.5,
      }}
    />
  </Box>



        
      </div>
      <div className="loginLocalContainer">
        <div className="loginLocal">
        <form onSubmit={handleSubmit}>

      
      <Box padding="20px" width="300px">
     
      <TextField 
        type="email"
        name="username"
        size="small"
        fullWidth
        value={userData.username}
        onChange={handleUserChange}
        label="Username"
        required
        variant="outlined"
        helperText='it is the email address you signup hear'
        />

      <TextField         
        type="password"
        name="password"
        size="small"
        fullWidth
        value={userData.password}
        onChange={handleUserChange}
        label="password"
        required
        variant="outlined"
        />

    </Box>
  <br />
            <button className="login" type="submit">Login</button>
          </form>
                {/* Forgot Password Link */}
      <Typography variant="body2">
        <Link to="/forgotpassword">Forgot Password?</Link>
      </Typography>
        </div>
      </div>
     

  <br />
    </div>
  );
};

export default Login;
//<button className="googleButton" onClick={handleGoogleLogin}>
         
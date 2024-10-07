import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
//import GoogleIcon from '@mui/icons-material/Google';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    //email: '',
    //role: '',
    firstName: '',
    lastName: '',
    age: '',
    address: '',
    phone: ''
   // avatar: ''
  });
  const isMobile = useMediaQuery('(max-width:600px)');


const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:4000/signup', formData,{
      withCredentials: true, // Include this to ensure cookies are sent
      });

    console.log('sign up successfully:',response.data);
    alert('Sign up successful! Please check your email for verification.');
    navigate('/login');  // Redirect to login page
  } catch (error) {
    const errMessage = error.response?.data?.message || 'Error signing up';
    alert(errMessage);

    // Redirect to Google login if the user is already registered with a Google account
    if (errMessage.includes('Google account')) {
      handleGoogleLogin();
    }
}};
const handleChange = (e) => {
  //const { name, value } = e.target;
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });

};
  
  const handleGoogleLogin = () => {
    // Implement your Google login logic here
    window.location.href = 'http://localhost:4000/auth/google';
  }


  
  return (
    <div className="img offer">
      <div className="secContainer">
      <h1>Sign Up ... </h1>
        
      
   {/* //Google button    */}
      <button className="googleButton" onClick={handleGoogleLogin}>
      <Box
          sx={{
            display: 'inline-block',
            background: 'linear-gradient(45deg, #DB4437, #F4B400, #0F9D58, #4285F4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: 'inherit',
          }}op9
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
        </Box>        
        Login with Google
         </button>
        </div>

{/* // OR brake line   */}
        <Box  display="flex" alignItems="center"  justifyContent="center"  sx={{ width: '100%', marginY: 2 }}
        >
          <Box
            sx={{  flexGrow: 1,  height: '1px',  backgroundColor: 'rgba(0, 0, 0, 0.1)',
              marginRight: 1.5,
            }}
          />
          <Typography variant="body1"    sx={{ color: 'rgba(0, 0, 0, 0.5)' }}>
            or
          </Typography>
          <Box
            sx={{ flexGrow: 1,  height: '1px',  backgroundColor: 'rgba(0, 0, 0, 0.1)',  marginLeft: 1.5,  }}
          />
        </Box>



      <div className="loginLocalContainer">
        <div className="loginLocal">
        <form onSubmit={handleSubmit}>
 
    <Stack padding="20px" margin="1px" width="100%" spacing={2}>
        {/* Render form fields for larger screens */}
        {!isMobile && (
          <>
            <Stack direction="row" spacing={2}>
              <TextField       
                type="email"
                name="username"
                size="small"
                fullWidth
                value={formData.username}
                onChange={handleChange}
                label="Username"
                required
                variant="outlined"
                helperText='Enter your email address to sign up here'
              />
              <TextField      
                type="password"
                name="password"
                size="small"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                label="Password"
                required
                variant="outlined"
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField      
                type="text"
                name="firstName"
                size="small"
                fullWidth
                value={formData.firstName}
                onChange={handleChange}
                label="First Name"
                required
                variant="outlined"
              />
              <TextField   
                type="text"
                name="lastName"
                size="small"
                fullWidth
                value={formData.lastName}
                onChange={handleChange}
                label="Last Name"
                required
                variant="outlined"
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField   
                type="number"
                name="age"
                size="small"
                fullWidth
                value={formData.age}
                onChange={handleChange}
                label="Age"
                required
                variant="outlined"
                helperText="Your age must be above 16"
                inputProps={{ min: 16, max: 120 }}
              />
              <TextField     
                type="text"
                name="address"
                size="small"
                fullWidth
                value={formData.address}
                onChange={handleChange}
                label="Address"
                required
                variant="outlined"
              />
            </Stack>
            
            <Stack direction="row" spacing={2}>
              <TextField   
                type="tel"
                name="phone"
                size="small"
                fullWidth
                value={formData.phone}
                onChange={handleChange}
                label="Phone"
                required
                variant="outlined"
              />
              <TextField      
                type="text"
                name="avatar"
                size="small"
                fullWidth
                value={formData.avatar}
                onChange={handleChange}
                label="Avatar"
                variant="outlined"
              />
            </Stack>
          </>
        )}

        {/* Render content for mobile screens */}
        {isMobile && (
          <>
            <TextField
              type="email"
              name="username"
              size="small"
              fullWidth
              value={formData.username}
              onChange={handleChange}
              label="Username"
              required
              variant="outlined"
              helperText='Enter your email address to sign up here'
            />
            <TextField      
              type="password"
              name="password"
              size="small"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              label="Password"
              required
              variant="outlined"
            />
            <TextField      
              type="text"
              name="firstName"
              size="small"
              fullWidth
              value={formData.firstName}
              onChange={handleChange}
              label="First Name"
              required
              variant="outlined"
            />
            <TextField   
              type="text"
              name="lastName"
              size="small"
              fullWidth
              value={formData.lastName}
              onChange={handleChange}
              label="Last Name"
              required
              variant="outlined"
            />
            <TextField   
              type="number"
              name="age"
              size="small"
              fullWidth
              value={formData.age}
              onChange={handleChange}
              label="Age"
              required
              variant="outlined"
              helperText="Your age must be above 16"
              inputProps={{ min: 16, max: 120 }}
            />
            <TextField     
              type="text"
              name="address"
              size="small"
              fullWidth
              value={formData.address}
              onChange={handleChange}
              label="Address"
              required
              variant="outlined"
            />
            <TextField   
              type="tel"
              name="phone"
              size="small"
              fullWidth
              value={formData.phone}
              onChange={handleChange}
              label="Phone"
              required
              variant="outlined"
            />
            <TextField      
              type="text"
              name="avatar"
              size="small"
              fullWidth
              value={formData.avatar}
              onChange={handleChange}
              label="Avatar"
              variant="outlined"
            />
          </>
        )}
      <button type="submit">Sign Up</button>
      </Stack>
    </form>
  
  

  <br />
                
        </div>
      </div>
      <br className="customBreak"/>
       <br />
    </div>);
};

export default Signup;
//<input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
     
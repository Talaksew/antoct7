import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Box,  Typography } from '@mui/material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/forgot-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error occurred while requesting password reset');
    }
  };

  return (
    <div>
      <div className="img offer">
      <div className="secContainer">
      <h1>Forgot Password ...</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
      <Box padding="20px" width="300px">
      <TextField
      
        name="username"
        size="small"
        fullWidth
       // value={userData.username}
        //onChange={handleUserChange}
        
        variant="outlined"
        helperText='it is the email address you signup hear'

          label="Enter your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /></Box>
         <button className="login" type="submit">Submit</button>
         </form>
      {message && <Typography color="error">{message}</Typography>}
    </div></div>
    
  );
};

export default ForgotPassword;

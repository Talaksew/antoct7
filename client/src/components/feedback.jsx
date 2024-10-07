import React, { useState } from 'react';
import { Modal, Box, TextField, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const NoHoverIconButton = styled(IconButton)({
    '&:hover': {
      backgroundColor: 'transparent',
      color: ' #FF0000', // No background on hover
      boxShadow: 'none', // Remove shadow on hover
    },
  });

function FeedbackForm({ open, handleClose }) {
    //const [feedback, setFeedback] = useState('');
   // app.post('/addFeedback',  async (req, res) => {
        const [feedbackData, setFeedbackData] = useState({
            feedback: '',
          });

    const handleSubmit = async ()=> {
       // console.log('Feedback:', feedback);
        // Send feedback to the server or perform other actions
       // handleClose();
        //e.preventDefault();

        try {
          // Send hotel data to backend
          const response = await axios.post('http://localhost:4000/addFeedback', feedbackData);
    
          // Handle success
          console.log('Data inserted successfully:', response.data);
          alert('Data inserted successfully!');
          handleClose()
        } catch (error) {
          console.error('Error inserting 2a data:', error);
          alert('Error inserting 3a data');
        }
      };
    
      // Handle input changes
      const handleFeedbackChange = (e) => {
        setFeedbackData({ ...feedbackData, [e.target.name]: e.target.value });
      };
    
    

    return (
        
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ 
                position: 'absolute', 
                top: '40%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2
            }}>
          {/* Header */}
          <Box sx={{ mb: 2 }}>
          <Typography variant="p">Provide Your Feedback</Typography>
        </Box>        
        {/* Close Button */}
            <NoHoverIconButton
            onClick={handleClose}
            sx={{ 
               position: 'absolute',
               top: 20,
               right: 8,
               color: '#8B0000'
            }}
            >
           <CloseIcon />
          </NoHoverIconButton>
 
        <TextField
             label="Your Feedback"
             name="feedback"
             multiline
             rows={4}
             fullWidth
             value={feedbackData.feedback}
             onChange={handleFeedbackChange}
             sx={{ mb: 2 }}
             />
             {/* <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button> */}
         <button 
            className="login" 
            type="button" 
            onClick={handleSubmit}
            >
            Submit
        </button>
           </Box>
        </Modal>
    );
}

export default FeedbackForm;


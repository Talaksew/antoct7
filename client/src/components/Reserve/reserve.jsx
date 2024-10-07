import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import { format } from 'date-fns';
import {
  Box,
  TextField,
  Typography,
} from '@mui/material';

function Reserve() {
    const { item_id } = useParams();
    const isMobile = useMediaQuery('(max-width:700px)');
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        user: null,
    });

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

        const authCheckInterval = setInterval(checkAuthStatus, 10 * 60 * 1000); 

        return () => clearInterval(authCheckInterval);
    }, []);

    const [ReqData, setReqData] = useState({
        specialRequests: '',
        numberOfPersons: '',
        startDate:'',
        endDate:'',
    });
   
    const [date, setDate] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });

    const handleSelect = (ranges) => {
        const { selection } = ranges;
        setDate(selection);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const reservationData = {
                user: authState.user._id, // Make sure the user is included
                numberOfPersons: ReqData.numberOfPersons,
                specialRequests: ReqData.specialRequests,
                startDate: date.startDate.toISOString(),
                endDate: date.endDate.toISOString(),
                email: authState.user.email,
            };
    
            const response = await axios.post(`http://localhost:4000/reservation/${item_id}`, reservationData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true, // Important to include session cookies
            });
    
            console.log('Reservation created successfully:', response.data);
            alert('Reservation created successfully!');
    
        } catch (error) {
            console.error('Error creating reservation:', error);
            alert('Error creating reservation');
        }
    };
    
    return (
        <Box sx={{ padding: '16px', maxWidth: '100vw', overflowX: 'hidden' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Reserve
            </Typography>

            <Box component="form" id="reservationForm" onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="p">
                        Choose starting and ending date
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {`${format(date.startDate, 'MMM dd, yyyy')} to ${format(date.endDate, 'MMM dd, yyyy')}`}
                    </Typography>
                    <Box
                        sx={{
                            padding: '0',
                            backgroundColor: 'white',
                            display: 'flex',
                            justifyContent: 'start',
                            marginLeft: -30,
                           // justifyContent: isMobile ? 'center' : 'start',
                        }}
                    >
                        <DateRangePicker
                            ranges={[date]}
                            onChange={handleSelect}
                            minDate={new Date()}
                            months={isMobile ? 1 : 2}
                            direction="horizontal"
                            staticRanges={[]} 
                            inputRanges={[]} 
                        />
                    </Box>
                </Box>
                <TextField
                    type="number"
                    label="Number of Persons"
                    name="numberOfPersons"
                    value={ReqData.numberOfPersons}
                    onChange={(e) => setReqData({ ...ReqData, numberOfPersons: e.target.value })}
                    fullWidth
                    required
                    variant="outlined"
                    inputProps={{ min: 1 }} 
                    sx={{ mb: 3 }}
                />

                <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
                    Tell us what you want, we are ready to give a service
                </Typography>
                <TextField
                    label="Special information"
                    name="specialRequests"
                    value={ReqData.specialRequests}
                    onChange={(e) => setReqData({ ...ReqData, specialRequests: e.target.value })}
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{ mb: 3 }}
                />

                <button type="submit">Reserve</button>
            </Box>
        </Box>
    );
}

export default Reserve;

import React, { useState } from 'react';
import axios from 'axios';
import { Stack, TextField, useMediaQuery } from '@mui/material';
import './imgImport.css';

const AddHotel = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  // State for hotel data
  const [hotelData, setHotelData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    rating: '',
    amenities: '',
    phone: '',
    email: '',
    website: ''
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send hotel data to backend
      const response = await axios.post('http://localhost:4000/addHotel', hotelData);

      // Handle success
      console.log('Data inserted successfully:', response.data);
      alert('Data inserted 1a successfully!');
    } catch (error) {
      console.error('Error inserting 2a data:', error);
      alert('Error inserting 3a data');
    }
  };

  // Handle input changes
  const handleHotelChange = (e) => {
    setHotelData({ ...hotelData, [e.target.name]: e.target.value });
  };

  return (
    <div className="img offer">
      <div className="secContainer">
        <h1>New Hotels Preferred</h1>
        <form onSubmit={handleSubmit}>
        <Stack padding="20px" margin="1px" width="100%" spacing={2}>
        {!isMobile && (
          <>
        <Stack direction="row" spacing={2}>
         <TextField       
              type="text"
              name="name"
              size="small"
              fullWidth
              value={hotelData.name}
              onChange={handleHotelChange}
              label="Hotel Name"
              required
              variant="outlined"
              helperText='inter your email address to signup hear'
           />
           <TextField       
              type="text"
              name="address"
              size="small"
              fullWidth
              value={hotelData.address}
              onChange={handleHotelChange}
              label="Hotel's Address"
              required
              variant="outlined"
              helperText='inter the address of the hotel'
           /></Stack>
           <Stack direction="row" spacing={2}>
            <TextField       
              type="text"
              name="latitude"
              size="small"
              fullWidth
              value={hotelData.latitude}
              onChange={handleHotelChange}
              label="Latitude"
             
              variant="outlined"
              helperText='inter latitude'
           />
            <TextField       
              type="text"
              name="longitude"
              size="small"
              fullWidth
              value={hotelData.longitude}
              onChange={handleHotelChange}
              label="Longitude"
             
              variant="outlined"
              helperText='inter your email address to signup hear'
           /></Stack>
           <Stack direction="row" spacing={2}>
           <TextField       
              type="text"
              name="rating"
              size="small"
              fullWidth
              value={hotelData.rating}
              onChange={handleHotelChange}
              label="Rating (1-5)"
              required
              variant="outlined"
              helperText='inter the rate from 1 to 5'
           />
            <TextField       
              type="text"
              name="amenities"
              size="small"
              fullWidth
              value={hotelData.amenities}
              onChange={handleHotelChange}
              label="Amenities"
              variant="outlined"
              helperText='Amenities'
           /></Stack>
           <Stack direction="row" spacing={2}>
            <TextField       
              type="tel"
              name="phone"
              size="small"
              fullWidth
              value={hotelData.phone}
              onChange={handleHotelChange}
              label="Contact Phone"
              required
              variant="outlined"
              helperText='Hotels phone number'
           />
            <TextField       
              type="email"
              name="email"
              size="small"
              fullWidth
              value={hotelData.email}
              onChange={handleHotelChange}
              label="Hotel's Email"
              required
              variant="outlined"
              helperText='inter your email address to signup hear'
           /></Stack>
           <Stack direction="row" spacing={2}>
            <TextField       
              type="text"
              name="website"
              size="small"
              fullWidth
              value={hotelData.website}
              onChange={handleHotelChange}
              label="website"
  
              variant="outlined"
              helperText='insert the hotel website'
           />

           </Stack>
              </>
        )}
        {/* Render content for mobile screens */}
        {isMobile && (
          <>
           <TextField       
              type="text"
              name="name"
              size="small"
              fullWidth
              value={hotelData.name}
              onChange={handleHotelChange}
              label="Hotel Name"
              required
              variant="outlined"
              helperText='inter your email address to signup hear'
           />
           <TextField       
              type="text"
              name="address"
              size="small"
              fullWidth
              value={hotelData.address}
              onChange={handleHotelChange}
              label="Hotel's Address"
              required
              variant="outlined"
              helperText='inter the address of the hotel'
          /> <TextField       
              type="text"
              name="latitude"
              size="small"
              fullWidth
              value={hotelData.latitude}
              onChange={handleHotelChange}
              label="Latitude"
             
              variant="outlined"
              helperText='inter latitude'
           />
            <TextField       
              type="text"
              name="longitude"
              size="small"
              fullWidth
              value={hotelData.longitude}
              onChange={handleHotelChange}
              label="Longitude"
             
              variant="outlined"
              helperText='inter your email address to signup hear'
           />
            <TextField       
              type="text"
              name="rating"
              size="small"
              fullWidth
              value={hotelData.rating}
              onChange={handleHotelChange}
              label="Rating (1-5)"
              required
              variant="outlined"
              helperText='inter the rate from 1 to 5'
           />
            <TextField       
              type="text"
              name="amenities"
              size="small"
              fullWidth
              value={hotelData.amenities}
              onChange={handleHotelChange}
              label="Amenities"
              variant="outlined"
              helperText='Amenities'
           />
           <TextField       
              type="tel"
              name="phone"
              size="small"
              fullWidth
              value={hotelData.phone}
              onChange={handleHotelChange}
              label="Contact Phone"
              required
              variant="outlined"
              helperText='Hotels phone number'
           />
            <TextField       
              type="email"
              name="email"
              size="small"
              fullWidth
              value={hotelData.email}
              onChange={handleHotelChange}
              label="Hotel's Email"
              required
              variant="outlined"
              helperText='inter your email address to signup hear'
           /><TextField       
              type="text"
              name="website"
              size="small"
              fullWidth
              value={hotelData.website}
              onChange={handleHotelChange}
              label="website"
  
              variant="outlined"
              helperText='insert the hotel website'
           />
          </>
          )}
            </Stack>
          <button type="submit">Insert Data</button>
        </form>
      </div>
    </div>
  );
};

export default AddHotel;

// axios.post('http://localhost:4000/addItem', data)
// .then(res => {
//   console.log(res.data);
// })
// .catch(err => {
//   console.error(err);
// });
// };


/* <form className="impoert" onSubmit={handleSubmit}>
      <input type="text" name="item_id" value={formData.item_id} onChange={handleChange} placeholder="Item ID" />
      <input type="text" name="item_name" value={formData.item_name} onChange={handleChange} placeholder="Item Name" />
      <input type="text" name="short_detail" value={formData.short_detail} onChange={handleChange} placeholder="Short Detail" />
     <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Latitude" />
      <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Longitude" />
       <input type="text" name="hotel" value={formData.hotel} onChange={handleChange} placeholder="Hotel" />
       <textarea name="detail" value={formData.detail} onChange={handleChange} placeholder="Detail"></textarea>
       <p>Special date to visite</p><input type="date" name="spetial_date" value={formData.spetial_date} onChange={handleChange} placeholder="Special Date" />
      <input type="file" name="images" multiple onChange={handleFileChange} />
      <button type="submit">Add Item</button>
    </form> */

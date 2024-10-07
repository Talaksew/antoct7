import React, { useState } from 'react';
import axios from 'axios';
import './imgImport.css';
import { Box, Stack, TextField, IconButton, useMediaQuery } from '@mui/material';
import { Cancel } from '@mui/icons-material';
const AddItem = () => {
  const isMobile = useMediaQuery('(max-width:600px)');

  // State for item data
  const [itemData, setItemData] = useState({
    name: '',
    shortDetail: '',
    detail: '',
    latitude: '',
    longitude: '',
    address: '',
    category: '',
    hotels: '', // Assuming you want to add hotels as a string for input
  });

  // State for special date
  const [specialDay, setSpecialDay] = useState('');
  const [specialMonth, setSpecialMonth] = useState('');


  // State for image data
  //const [imagesData, setImagesData] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare item data
      const formData = new FormData();
      for (let key in itemData) {
        formData.append(key, itemData[key]);
      }
      formData.append('specialDay', specialDay);
      formData.append('specialMonth', specialMonth);
      selectedImages.forEach(image => {
        formData.append('images', image.file);
      });

      // Send form data to backend
      const response = await axios.post('http://localhost:4000/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Handle success
      console.log('Data inserted successfully:', response.data);
      alert('Data inserted successfully!');
    } catch (error) {
      console.error('Error inserting data:', error);
      alert('Error inserting data');
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
   // const images = files.map((file) => URL.createObjectURL(file));
    //setSelectedImages((prevImages) => [...prevImages, ...images]);
  
    setSelectedImages(files.map(file => ({ file, name: file.name })));

  console.log('Selected Images:', selectedImages);
  };

  const handleRemoveImage = (imageToRemove) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((image) => image !== imageToRemove)
    );
  };
  return (
    <div className="img offer">
      <div className="secContainer">
        <h2 >New Item</h2>
        <form onSubmit={handleSubmit}>
          {/* Item Data */}
        <Stack padding="20px" margin="1px" width="100%" spacing={2}>
        {!isMobile && (
          <>
          <Stack direction="row" spacing={2}>
            <TextField       
              type="text"
              name="name"
              size="small"
              fullWidth
              value={itemData.name}
              onChange={(e) => setItemData({ ...itemData, name: e.target.value })}
              label="Name"
              required
              variant="outlined"
              helperText='inter the name of the item'
           />
          <TextField       
              type="text"
              name="shortDetail"
              size="small"
              fullWidth
              value={itemData.shortDetail}
              onChange={(e) => setItemData({ ...itemData, shortDetail: e.target.value })}
              label="Short Detail"
              required
              variant="outlined"
              helperText='Short Detail for the item'
           /></Stack>
           </>)}
           {isMobile && (
            <>
            <TextField       
              type="text"
              name="name"
              size="small"
              fullWidth
              value={itemData.name}
              onChange={(e) => setItemData({ ...itemData, name: e.target.value })}
              label="Name"
              required
              variant="outlined"
              helperText='inter the name of the item'
           />
          <TextField       
              type="text"
              name="shortDetail"
              size="small"
              fullWidth
              value={itemData.shortDetail}
              onChange={(e) => setItemData({ ...itemData, shortDetail: e.target.value })}
              label="Short Detail"
              required
              variant="outlined"
              helperText='Short Detail for the item'
            />
            </>
            )}
        <Stack direction="row" spacing={2}>
        <TextField       
              type="text"
              name="category"
              size="small"
              fullWidth
              value={itemData.category}
              onChange={(e) => setItemData({ ...itemData, category: e.target.value })}
              label="Category"
              required
              variant="outlined"
              helperText='inter category'
           />
        </Stack>
        <Stack direction="row" spacing={2}>
        <TextField
            type="text"
            name="detail"
            size="medium"  // Use "medium" for a balanced input size
            fullWidth
            value={itemData.detail}
            onChange={(e) => setItemData({ ...itemData, detail: e.target.value })}
            label="Detail"
            required
            variant="outlined"
            helperText="Enter the detailed information"
            multiline  // Allows for multiline input
            rows={4}   // Sets the initial number of rows
            // You can also use minRows and maxRows for more control over resizing
          /></Stack>

          <p>Location:
          </p>
          {!isMobile && (
            <>
            <Stack direction="row" spacing={2}>
          <TextField       
              type="text"
              name="address"
              size="small"
              fullWidth
              value={itemData.address}
              onChange={(e) => setItemData({ ...itemData, address: e.target.value })}
              label="Address"
              required
              variant="outlined"
              helperText='inter the address'
           />
            <TextField       
              type="text"
              name="latitude"
              size="small"
              fullWidth
              value={itemData.latitude}
              onChange={(e) => setItemData({ ...itemData, latitude: e.target.value })}
              label="Latitude"        
              variant="outlined"
              helperText='inter the latitude of address thitem '
           />
          
          <TextField       
              type="text"
              name="longitude"
              size="small"
              fullWidth
              value={itemData.longitude}
              onChange={(e) => setItemData({ ...itemData, longitude: e.target.value })}
              label="Longitude"            
              variant="outlined"
              helperText='inter the longtude of address the item'
           /></Stack>
       
       </>)} 
    {isMobile && (
      <>
      <TextField       
              type="text"
              name="address"
              size="small"
              fullWidth
              value={itemData.address}
              onChange={(e) => setItemData({ ...itemData, address: e.target.value })}
              label="Address"
              required
              variant="outlined"
              helperText='inter the address'
           />
            <TextField       
              type="text"
              name="latitude"
              size="small"
              fullWidth
              value={itemData.latitude}
              onChange={(e) => setItemData({ ...itemData, latitude: e.target.value })}
              label="Latitude"        
              variant="outlined"
              helperText='inter the latitude of address thitem '
           />
          
          <TextField       
              type="text"
              name="longitude"
              size="small"
              fullWidth
              value={itemData.longitude}
              onChange={(e) => setItemData({ ...itemData, longitude: e.target.value })}
              label="Longitude"            
              variant="outlined"
              helperText='inter the longtude of address the item'
           />
       </>)}
          {/* Special Date */}
          <p>Special Date:
          </p>
          <Stack direction="row" spacing={2}>
          <TextField       
              type="number"
              size="small"
              fullWidth
              value={specialDay}
              onChange={(e) => setSpecialDay(e.target.value)} 
              label="Day"
              variant="outlined"
              helperText="Enter the day of the special date"
              inputProps={{ min: 1, max: 31 }}  // Set the min and max values here
            />
            <TextField       
              type="number"
              size="small"
              fullWidth
              value={specialMonth} 
              onChange={(e) => setSpecialMonth(e.target.value)}
              inputProps={{ min: 1, max: 12 }}  // Set the min and max values here
              label="Month"

              variant="outlined"
              helperText='inter month of special date'
           />
          
        </Stack>

          <p>Image Files:</p>
          <Stack direction="row" spacing={2}>
           <TextField
          type="file"
          name="images"
          inputProps={{multiple: true, accept: 'image/*' }}
          multiple
          onChange={handleImageChange}
          variant="outlined"
          helperText="Upload Images"
        />

        {/* Image Preview Section */}
        <p></p>
        <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
          {selectedImages.map((image, index) => (
            <Box key={index} position="relative">
              <img
                src={image}
                alt={`Selected ${index}`}
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                onError={() => console.error('Image failed to load:', image)} // Debugging for broken image URLs
              />
              <IconButton
                size="small"
                color="secondary"
                onClick={() => handleRemoveImage(image)}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                <Cancel fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
        </Stack>
            <Stack direction="row" spacing={2}>
          <TextField       
              type="text"
              name="hotels"
              size="small"
              fullWidth
              value={itemData.hotels}
              onChange={(e) => setItemData({ ...itemData, hotels: e.target.value })}
              label="Hotels preferred"
              
              variant="outlined"
              helperText='inter the preferd hotel '
           />   </Stack>
            <Stack direction="row" spacing={2}>
          <button type="submit">Insert Data</button>
       
          </Stack>
          </Stack>
        </form>
      </div>
    </div>
  );
};

export default AddItem;

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  IconButton,
  Box,
  Typography,
  Stack,
  Chip,
  Divider,
  CardActions,
  TextField,
  Button
} from '@mui/material';
import axios from 'axios';
import {
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  LocationOn as LocationOnIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ImageViewer = () => {
  const { item_id } = useParams();
  const [item, setItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const [selectedImages, setSelectedImages] = useState([]); // State for new images
  const [previewImages, setPreviewImages] = useState([]); // State for image previews
  const navigate = useNavigate();
  
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : item.images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < item.images.length - 1 ? prevIndex + 1 : 0));
  };
  
  const handleReserveItem = (item) => {
    navigate(`/reserve/${item._id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/viewDetail/${item_id}`);
        setItem(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [item_id]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing); // Toggle between edit and view mode
    if (!isEditing) {
      setPreviewImages(item.images); // Reset preview images on entering edit mode
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    
    // Create preview URLs
    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...filePreviews]);
  };

  const handleSaveChanges = async () => {
    const formData = new FormData();
    
    // Append item details
    formData.append('name', item.name);
    formData.append('detail', item.detail);
    formData.append('address', item.address);
    
    // Append new images to formData
    selectedImages.forEach((image) => formData.append('images', image));
    
    try {
      await axios.put(`http://localhost:4000/updateItem/${item_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsEditing(false); // Exit edit mode after saving
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h3" component="h3" sx={{ textAlign: 'center', mt: 1.3, mb: 1.3 }}>
        View Detail
      </Typography>

      <Box position="relative" width="100%" height="100%">
        <IconButton onClick={handlePrev} sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', padding: 0, minWidth: 'auto', height: '40px', width: '40px', zIndex: 10 }}>
          <ArrowBackIosIcon />
        </IconButton>
        <IconButton onClick={handleNext} sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', padding: 0, minWidth: 'auto', height: '40px', width: '40px', zIndex: 10 }}>
          <ArrowForwardIosIcon />
        </IconButton>

        <Box sx={{ display: 'flex', overflow: 'hidden', width: '100%', height: '250px' }}>
          <motion.div style={{ display: 'flex', flexDirection: 'row', width: `${item?.images.length * 100}%` }} animate={{ x: `-${currentIndex * 100}%` }} transition={{ duration: 0.5 }}>
            {item?.images.map((imag, index) => (
              <Box key={index} sx={{ flexShrink: 0, width: '100%', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={`http://localhost:4000${imag}`} alt={`Item ${index}`} loading="lazy" style={{ width: '100%', height: 'auto', maxHeight: '250px', objectFit: 'cover' }} />
              </Box>
            ))}
          </motion.div>
        </Box>
      </Box>

      <Box sx={{ padding: 2, borderRadius: 2, boxShadow: 3, backgroundColor: '#fff' }}>
        {isEditing ? (
          <>
            <TextField
              label="Name"
              value={item.name}
              name="name"
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Detail"
              value={item.detail}
              name="detail"
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Address"
              value={item.address}
              name="address"
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Upload Images"
              type="file"
              inputProps={{ multiple: true }}
              onChange={handleImageChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Typography variant="h6">Image Previews:</Typography>
            <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, mb: 2 }}>
              {previewImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`preview-${index}`}
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              ))}
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>{item.name}</Typography>
            <Typography variant="body1" paragraph>{item.detail}</Typography>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Chip label={`Special Date: ${item.specialDate.day}/${item.specialDate.month}`} />
              <Chip label="Negotiable Price" />
            </Stack>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon sx={{ mr: 1 }} />
              <Typography variant="body1">{item.address}</Typography>
            </Box>
          </>
        )}

        <Divider sx={{ my: 2 }} />
        
        <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" color={isEditing ? "success" : "primary"} onClick={isEditing ? handleSaveChanges : handleEditToggle}>
            {isEditing ? "Save Changes" : "Edit"}
          </Button>
          <Button variant="outlined" onClick={() => handleReserveItem(item)}>Reserve</Button>
        </CardActions>
      </Box>
    </Box>
  );
};

export default ImageViewer;

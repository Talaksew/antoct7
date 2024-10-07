import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import {
  IconButton,
  Box,
  Typography,
  Stack,
  Chip,
  Divider,
  CardActions
} from '@mui/material';
import axios from 'axios';
import {
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  //Add as AddIcon,
  LocationOn as LocationOnIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ImageViewer = () => {
  const { item_id } = useParams();
  const [item, setItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        setItem(response.data)
      } catch (error) {
        console.error("Error fetching data: ", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [item_id]);

  // const handleDelete = async (image) => {
  //   try {
  //     await axios.delete(`http://localhost:4000/items/${item_id}`, { data: { url: image } });
  //     setItem(prevItem => ({
  //       ...prevItem,
  //       images: prevItem.images.filter(img => img !== image),
  //     }));
  //   } catch (error) {
  //     console.error('Error deleting image:', error);
  //   }
  // };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box sx={{ padding: 2 }}>
      <Typography
        variant="h3"
        component="h3"
        sx={{ textAlign: 'center', mt: 1.3, mb: 1.3 }}
      >
        View Detail
      </Typography>

      <Box position="relative" width="100%" height="100%">
        {/* Navigation Buttons */}
        <IconButton
          onClick={handlePrev}
          sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            padding: 0,
            minWidth: 'auto',
            height: '40px',
            width: '40px',
            zIndex: 10
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <IconButton
          onClick={handleNext}
          sx={{
            position: 'absolute',
            top: '50%',
            right: 0,
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            padding: 0,
            minWidth: 'auto',
            height: '40px',
            width: '40px',
            zIndex: 10
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>

        {/* Image Display with Animation */}
        <Box
          sx={{
            display: 'flex',
            overflow: 'hidden',
            width: '100%',
            height: '250px',
          }}
        >
          <motion.div
            style={{ display: 'flex', flexDirection: 'row', width: `${item?.images.length * 100}%` }}
            animate={{ x: `-${currentIndex * 100}%` }}
            transition={{ duration: 0.5 }}
          >
            {item?.images.map((imag, index) => (
              <Box
                key={index}
                sx={{ flexShrink: 0, width: '100%', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <img
                  src={`http://localhost:4000${imag}`}
                  alt={`Item ${index}`}
                  loading="lazy"
                  style={{ width: '100%', height: 'auto', maxHeight: '250px', objectFit: 'cover' }}
                />
              </Box>
            ))}
          </motion.div>
        </Box>
      </Box>

      <Box sx={{ padding: 2, borderRadius: 2, boxShadow: 3, backgroundColor: '#fff' }}>
        <Typography variant="h4" gutterBottom>
          {item.name}
        </Typography>

        <Typography variant="body1" paragraph>
          {item.detail}
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Chip label={`Special Date: ${item.specialDate.day}/${item.specialDate.month}`}  />
          <Chip label="Negotiable Price"  />
          
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationOnIcon sx={{ mr: 1 }} />
          <Typography variant="body1">{item.address}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />
  
        <CardActions sx={{ marginTop: 'auto' }}>
        <button
                  name="reserveItem"
                  className="btnggadd"
                  onClick={() => handleReserveItem(item)}
                >
                  Reserve
                </button>
         </CardActions>
       
      </Box>
    </Box>
  );
};

export default ImageViewer;

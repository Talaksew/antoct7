import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

function AboutUs() {
  return (
    <Box sx={{ padding: '16px', maxWidth: '1200px', margin: 'auto' }}>
      {/* Heading */}
      <Typography variant="h4" gutterBottom>
        About Us
      </Typography>
      
      {/* Introduction */}
      <Typography variant="body1" paragraph>
        Welcome to <strong>Your Company Name</strong>. We are passionate about delivering outstanding services to our customers. Our team of dedicated professionals works around the clock to bring you the best experiences and products.
      </Typography>
      
      <Typography variant="body1" paragraph>
        Since our founding in <strong>Year of Establishment</strong>, we have been committed to innovation, excellence, and building long-lasting relationships with our clients. From the very beginning, our goal has been to make a positive impact in the industry by offering top-notch solutions tailored to meet the specific needs of our diverse clientele.
      </Typography>

      {/* Mission, Vision, and Values */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {/* Mission */}
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1">
              To provide high-quality products and services that bring value to our customers, while fostering innovation and sustainable practices in everything we do.
            </Typography>
          </Paper>
        </Grid>

        {/* Vision */}
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom>
              Our Vision
            </Typography>
            <Typography variant="body1">
              To be a global leader in our industry, known for our commitment to quality, innovation, and customer satisfaction.
            </Typography>
          </Paper>
        </Grid>

        {/* Values */}
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom>
              Our Values
            </Typography>
            <Typography variant="body1">
              Integrity, innovation, customer focus, and sustainability are at the core of our business practices. We believe in doing what is right for our customers, employees, and the planet.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Our Team */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Our Team
      </Typography>
      <Typography variant="body1" paragraph>
        Our team is made up of talented professionals from various backgrounds, all with a shared passion for delivering the best possible results to our customers. With years of experience in the industry, we combine expertise with creativity to bring you innovative solutions that make a difference.
      </Typography>

      {/* Conclusion */}
      <Typography variant="body1" paragraph>
        Thank you for being part of our journey. We look forward to serving you and continuing to grow together.
      </Typography>
    </Box>
  );
}

export default AboutUs;

import React from 'react';
import { Box, Typography, Link, Stack, Button } from '@mui/material';
import { Facebook, Instagram, Twitter, LinkedIn, LocationOn } from '@mui/icons-material';

function ContactInfo() {
  return (
    <Box sx={{ padding: '16px', maxWidth: '800px', margin: 'auto' }}>
      {/* General Inquiries */}
      <Typography variant="h4" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="body1" gutterBottom>
        We&apos;d love to hear from you! If you have any questions, feedback, or inquiries, feel free to get in touch with us through the following channels:
      </Typography>

      {/* General Inquiries */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        General Inquiries
      </Typography>
      <Typography variant="body1">
        📧 <Link href="mailto:info@yourdomain.com">info@yourdomain.com</Link>
      </Typography>
      <Typography variant="body1">
        📞 +1 (123) 456-7890
      </Typography>

      {/* Customer Support */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Customer Support
      </Typography>
      <Typography variant="body1">
        📧 <Link href="mailto:support@yourdomain.com">support@yourdomain.com</Link>
      </Typography>
      <Typography variant="body1">
        📞 +1 (123) 456-7891
      </Typography>
      <Typography variant="body2" color="text.secondary">
        ⏰ Support Hours: Monday to Friday, 9:00 AM – 5:00 PM (Your Timezone)
      </Typography>

      {/* Social Media */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Follow Us on Social Media
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button startIcon={<Facebook />} href="https://facebook.com/yourpage" target="_blank">
          Facebook
        </Button>
        <Button startIcon={<Instagram />} href="https://instagram.com/yourpage" target="_blank">
          Instagram
        </Button>
        <Button startIcon={<Twitter />} href="https://twitter.com/yourpage" target="_blank">
          Twitter
        </Button>
        <Button startIcon={<LinkedIn />} href="https://linkedin.com/company/yourcompany" target="_blank">
          LinkedIn
        </Button>
      </Stack>

      {/* Office Address */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Visit Us
      </Typography>
      <Typography variant="body1">123 Main Street, Suite 400</Typography>
      <Typography variant="body1">Your City, Your Country, ZIP Code</Typography>
      <Button
        startIcon={<LocationOn />}
        href="https://goo.gl/maps/yourmaplink"
        target="_blank"
        sx={{ mt: 1 }}
      >
        View on Google Maps
      </Button>

      {/* Business Inquiries */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Business Inquiries
      </Typography>
      <Typography variant="body1">
        📧 <Link href="mailto:business@yourdomain.com">business@yourdomain.com</Link>
      </Typography>

      {/* Feedback */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Feedback
      </Typography>
      <Typography variant="body1">
        📧 <Link href="mailto:feedback@yourdomain.com">feedback@yourdomain.com</Link>
      </Typography>
    </Box>
  );
}

export default ContactInfo;

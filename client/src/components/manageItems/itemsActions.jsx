import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { Check, Save, Delete, Edit, Preview } from '@mui/icons-material';
import { green } from '@mui/material/colors';
import axios from 'axios';

const ItemsActions = ({ params, rowId, setRowId }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEdit = () => {
    // Implement edit logic here
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/api/items/${params.row._id}`);
      setLoading(false);
      // Handle successful deletion, e.g., refreshing the list of items
    } catch (error) {
      console.error('Error deleting item:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { role, active, _id } = params.row;
      const response = await axios.put(`http://localhost:4000/api/items/${_id}`, { role, active });
      if (response.status === 200) {
        setSuccess(true);
        setRowId(null);
      }
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (rowId === params.id && success) {
      setSuccess(false);
    }
  }, [rowId, success, params.id]);

  return (
    <Box
      sx={{
        m: 1,
        position: 'relative',
      }}
    >
      <Tooltip title="View item details">
        <IconButton onClick={() => console.log('View item details')}>
          <Preview />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit this item">
        <IconButton onClick={handleEdit}>
          <Edit />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete this item">
        <IconButton onClick={handleDelete} disabled={loading}>
          <Delete />
        </IconButton>
      </Tooltip>
      {success ? (
        <IconButton
          color="primary"
          sx={{
            width: 40,
            height: 40,
            bgcolor: green[500],
            '&:hover': { bgcolor: green[700] },
          }}
        >
          <Check />
        </IconButton>
      ) : (
        <IconButton
          color="primary"
          sx={{
            width: 40,
            height: 40,
          }}
          disabled={params.id !== rowId || loading}
          onClick={handleSubmit}
        >
          <Save />
        </IconButton>
      )}
      {loading && (
        <CircularProgress
          size={40}
          sx={{
            color: green[500],
            position: 'absolute',
            top: -6,
            left: -6,
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
};

export default ItemsActions;

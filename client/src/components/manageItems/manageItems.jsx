import { useEffect, useMemo, useState } from 'react';
import { Avatar, Box, Tooltip, Typography } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import moment from 'moment';
import { grey } from '@mui/material/colors';
import ItemsActions from './itemsActions'; // Ensure correct path
//import isAdmin from '../utils/isAdmin'; // Ensure correct path
import axios from 'axios';

const ItemsList = ({ setSelectedLink, link }) => {
  const [items, setItems] = useState([]);
  //const [currentUser, setCurrentUser] = useState(null); // Assume you set this appropriately
  const [pageSize, setPageSize] = useState(5);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof setSelectedLink === 'function') {
      setSelectedLink(link);
    }

    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:4000/items');
        setItems(response.data);
      } catch (err) {
        setError('Failed to fetch items');
        console.error(err);
      }
    };

    fetchItems();
  }, [link, setSelectedLink]);

  const columns = useMemo(
    () => [
      {
        field: 'images',
        headerName: 'Photo',
        width: 70,
        renderCell: (params) => (
          <Avatar src={params.row.images[0]} variant="rounded" />
        ),
        sortable: false,
        filterable: false,
      },
      {
        field: 'price',
        headerName: 'Cost',
        width: 70,
        renderCell: (params) => '$' + params.row.price,
      },
      { field: 'name', headerName: 'Title', width: 100 },
      { field: 'address', headerName: 'Address', width: 110 },
      { field: 'shortDetail', headerName: 'Description', width: 200 },
       {
        field: 'uName',
        headerName: 'Added by',
        width: 80,
        renderCell: (params) => (
          <Tooltip title={params.row.uName}>
            <Avatar src={params.row.uPhoto} />
          </Tooltip>
        ),
      },
      {
        field: 'createdAt',
        headerName: 'Created At',
        width: 200,
        renderCell: (params) =>
          moment(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      },
      { field: '_id', hide: true },
      {
        field: 'actions',
        headerName: 'Actions',
        type: 'actions',
        width: 150,
        renderCell: (params) => <ItemsActions {...{ params }} />,
      },
    ],
    []
  );

  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box
      sx={{
        height: 400,
        width: '100%',
      }}
    >
      <Typography
        variant="h3"
        component="h3"
        sx={{ textAlign: 'center', mt: 3, mb: 3 }}
      >
        Manage Items
      </Typography>
      <DataGrid
        columns={columns}
        rows={
          //isAdmin(currentUser)
            //? 
            items
            //: items.filter((item) => item.uid === currentUser?.id)
        }
        getRowId={(row) => row._id}
        rowsPerPageOptions={[5, 10, 20]}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        getRowSpacing={(params) => ({
          top: params.isFirstVisible ? 0 : 5,
          bottom: params.isLastVisible ? 0 : 5,
        })}
        sx={{
          [`& .${gridClasses.row}`]: {
            bgcolor: (theme) =>
              theme.palette.mode === 'light' ? grey[200] : grey[900],
          },
        }}
      />
    </Box>
  );
};

export default ItemsList;

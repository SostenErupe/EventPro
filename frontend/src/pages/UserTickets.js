import { useState, useEffect } from 'react';
import { 
  Card, Container, 
  Button, Stack, Typography, CircularProgress, Chip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Refresh } from '@mui/icons-material';

const UserTickets = ({ userId }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = 'http://localhost:5000/api';

  const fetchTickets = async () => {
  try {
    setLoading(true);
    const response = await axios.get(`${backendUrl}/events/getTickets/${userId}`);
    
    // Debugging logs
    console.log("User ID sent:", userId);
    console.log("Tickets received:", response.data);

    if (!Array.isArray(response.data)) {
      throw new Error("Invalid response format");
    }

    setTickets(response.data);
  } catch (error) {
    console.error("Fetch error:", {
      message: error.message,
      response: error.response?.data
    });
    setTickets([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchTickets();
  }, [userId]);

  const columns = [
    {
      field: 'Ticket_ID',
      headerName: 'Ticket ID',
      width: 100,
    },
    {
      field: 'Event_Name',
      headerName: 'Event',
      width: 200,
    },
    {
      field: 'Event_Date',
      headerName: 'Event Date',
      width: 120,
      valueFormatter: (params) => {
        try {
          return new Date(params.value).toLocaleDateString();
        } catch {
          return 'Invalid date';
        }
      },
    },
    {
      field: 'Purchase_Date',
      headerName: 'Purchase Date',
      width: 120,
      valueFormatter: (params) => {
        try {
          return new Date(params.value).toLocaleDateString();
        } catch {
          return 'Invalid date';
        }
      },
    },
    {
      field: 'Quantity',
      headerName: 'Qty',
      width: 80,
      type: 'number',
    },
    {
      field: 'Total_Price',
      headerName: 'Total',
      width: 100,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
    },
    {
      field: 'Status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'Confirmed' ? 'success' : 
            params.value === 'Pending' ? 'warning' : 'error'
          }
          variant="outlined"
          size="small"
        />
      ),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Card elevation={3} sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" component="h2">
            My Tickets
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchTickets}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Refresh'}
          </Button>
        </Stack>

        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={tickets}
            columns={columns}
            loading={loading}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 25]}
            getRowId={(row) => row.Ticket_ID}
            disableSelectionOnClick
          />
        </div>
      </Card>
    </Container>
  );
};

export default UserTickets;
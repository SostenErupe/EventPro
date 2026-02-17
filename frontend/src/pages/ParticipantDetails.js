import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  Divider,
  Stack,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@mui/material';
import {
  ArrowBack,
  Person,
  Email,
  Phone,
  Event,
  ConfirmationNumber,
  AttachMoney,
  CalendarToday,
  LocationOn,
  CheckCircle,
  Cancel,
  Pending,
  Receipt,
  Print
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ParticipantDetails = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const backendUrl = 'http://localhost:5000/api';

  useEffect(() => {
    fetchParticipantDetails();
  }, [ticketId]);

  const fetchParticipantDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${backendUrl}/participants/ticket/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setParticipant(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching participant details:', err);
      setError('Failed to load participant details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'Verified':
        return <Chip icon={<CheckCircle />} label="Verified" color="success" />;
      case 'Rejected':
        return <Chip icon={<Cancel />} label="Rejected" color="error" />;
      case 'Pending':
        return <Chip icon={<Pending />} label="Pending" color="warning" />;
      default:
        return <Chip icon={<Pending />} label="Pending" color="default" />;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!participant) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Participant not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1" color="primary.main" fontWeight="bold">
            Participant Details
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={handlePrint}
          >
            Print
          </Button>
          <Button
            variant="contained"
            startIcon={<Receipt />}
            onClick={() => navigate(`/ticket/${participant.Ticket_ID}`)}
          >
            View Ticket
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Participant Info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}
                >
                  {participant.user_name?.charAt(0)}
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  {participant.user_name}
                </Typography>
                <Chip 
                  label={`User ID: ${participant.User_ID}`}
                  size="small"
                  variant="outlined"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Email sx={{ mr: 2, color: 'text.secondary' }} />
                  <Typography variant="body2">{participant.Email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Phone sx={{ mr: 2, color: 'text.secondary' }} />
                  <Typography variant="body2">{participant.ContactInfo || 'Not provided'}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Ticket & Payment Info */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Ticket Information */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <ConfirmationNumber sx={{ mr: 1 }} />
                    Ticket Information
                  </Typography>
                  
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '30%' }}>
                            Ticket ID
                          </TableCell>
                          <TableCell>#{participant.Ticket_ID}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Event Name
                          </TableCell>
                          <TableCell>{participant.Event_Name}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Event Date
                          </TableCell>
                          <TableCell>
                            {new Date(participant.Event_Date).toLocaleDateString()}
                            {participant.Event_Start_Time && ` • ${participant.Event_Start_Time}`}
                            {participant.Event_End_Time && ` - ${participant.Event_End_Time}`}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Quantity
                          </TableCell>
                          <TableCell>{participant.Quantity}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Total Price
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" fontWeight="bold" color="primary.main">
                              Ksh {participant.Total_Price?.toLocaleString()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Purchase Date
                          </TableCell>
                          <TableCell>
                            {new Date(participant.Purchase_Date).toLocaleString()}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Ticket Status
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={participant.ticket_status}
                              color={participant.ticket_status === 'Confirmed' ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Payment Information */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <AttachMoney sx={{ mr: 1 }} />
                    Payment Information
                  </Typography>
                  
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '30%' }}>
                            Payment ID
                          </TableCell>
                          <TableCell>#{participant.Payment_ID || 'N/A'}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Payment Method
                          </TableCell>
                          <TableCell>{participant.Payment_Method || 'N/A'}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Payment Status
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={participant.Payment_Status || 'Pending'}
                              color={participant.Payment_Status === 'Success' ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Verification Status
                          </TableCell>
                          <TableCell>
                            {getStatusChip(participant.Verification_Status)}
                          </TableCell>
                        </TableRow>
                        {participant.Verification_Date && (
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                              Verification Date
                            </TableCell>
                            <TableCell>
                              {new Date(participant.Verification_Date).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ParticipantDetails;
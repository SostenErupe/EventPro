import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Button,
  Chip,
  IconButton,
  Card,
  CardContent,
  Grid,
  Menu,
  MenuItem,
  Avatar,
  Stack,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  useTheme,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Search,
  Download,
  Refresh,
  Visibility,
  CheckCircle,
  Cancel,
  Pending,
  People,
  ConfirmationNumber,
  AttachMoney,
  Close
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';

const Participants = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // State
  const [participants, setParticipants] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Stats
  const [stats, setStats] = useState({
    total_participants: 0,
    total_tickets_sold: 0,
    total_revenue: 0,
    verified_participants: 0,
    pending_verification: 0
  });

  // Events list for filter
  const [events, setEvents] = useState([]);

  const backendUrl = 'http://localhost:5000/api';
  const { user, authIsReady } = useAuthContext();

  // Fetch participants
  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      // If logged-in user is not admin, fetch their own participants
      const endpoint = user && Number(user.role) !== 1
        ? `${backendUrl}/participants/user/${user.id}`
        : `${backendUrl}/participants`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setParticipants(response.data.data);
        setFilteredParticipants(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching participants:', err);
      setError('Failed to load participants');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/participants/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Fetch events for filter
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/participants/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data.data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  useEffect(() => {
    if (!authIsReady) return;

    fetchParticipants();
    // Only fetch admin-only data if user is admin
    if (user && Number(user.role) === 1) {
      fetchStats();
      fetchEvents();
    }
  }, [authIsReady, user]);

  // Filter participants
  useEffect(() => {
    let filtered = [...participants];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.Event_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.Ticket_ID?.toString().includes(searchTerm)
      );
    }

    // Event filter
    if (eventFilter !== 'all') {
      filtered = filtered.filter(p => p.Event_ID === parseInt(eventFilter));
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.Verification_Status === statusFilter);
    }

    setFilteredParticipants(filtered);
  }, [searchTerm, eventFilter, statusFilter, participants]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/participants/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'participants.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setSuccess('Participants exported successfully');
    } catch (err) {
      setError('Failed to export participants');
    }
  };

  const handleRefresh = () => {
    fetchParticipants();
    fetchStats();
    setSuccess('Data refreshed successfully');
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'Verified':
        return <Chip icon={<CheckCircle />} label="Verified" color="success" size="small" />;
      case 'Rejected':
        return <Chip icon={<Cancel />} label="Rejected" color="error" size="small" />;
      case 'Pending':
        return <Chip icon={<Pending />} label="Pending" color="warning" size="small" />;
      default:
        return <Chip icon={<Pending />} label="Pending" color="default" size="small" />;
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main`, width: 48, height: 48 }}>
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary.main" fontWeight="bold">
          Participants
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleExport}
          >
            Export CSV
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Search by name, email, event, ticket ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <Close />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Event</InputLabel>
              <Select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                label="Event"
              >
                <MenuItem value="all">All Events</MenuItem>
                {events.map(event => (
                  <MenuItem key={event.Event_ID} value={event.Event_ID}>
                    {event.Event_Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="Verified">Verified</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setEventFilter('all');
                setStatusFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Results count */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredParticipants.length} participants
        </Typography>
      </Box>

      {/* Participants Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
              <TableCell>Ticket ID</TableCell>
              <TableCell>Participant</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>Purchase Date</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Verification</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredParticipants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No participants found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredParticipants
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((participant) => (
                  <TableRow 
                    key={participant.Ticket_ID}
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: theme.palette.action.hover,
                        cursor: 'pointer' 
                      } 
                    }}
                    onClick={() => navigate(`/participant/${participant.Ticket_ID}`)}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        #{participant.Ticket_ID}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                          {participant.user_name?.charAt(0) || 'U'}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">{participant.user_name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {participant.Email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{participant.Event_Name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {participant.Event_Date ? new Date(participant.Event_Date).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {participant.Purchase_Date ? new Date(participant.Purchase_Date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell align="center">{participant.Quantity || 0}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        Ksh {participant.Total_Price?.toLocaleString() || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={participant.Payment_Status || 'N/A'}
                        color={participant.Payment_Status === 'Success' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {getStatusChip(participant.Verification_Status)}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/participant/${participant.Ticket_ID}`);
                          }}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={filteredParticipants.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Snackbars */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Participants;
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Button, 
  Chip, Avatar, Tabs, Tab, Paper, Divider, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { CalendarToday, LocationOn, ConfirmationNumber, Person, Logout } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';

const DashboardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const Sidebar = styled(Paper)(({ theme }) => ({
  width: 280,
  padding: theme.spacing(3),
  borderRadius: 0,
  height: '100vh',
  position: 'sticky',
  top: 0,
}));

const MainContent = styled(Box)({
  flex: 1,
  padding: '24px 32px',
});

const EventCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = sessionStorage.getItem('userDashboardTab');
    return savedTab ? parseInt(savedTab) : 0;
  });
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState({
    events: false,
    tickets: false,
    venues: false
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const navigate = useNavigate();

  // Fetch user data from localStorage
  const { user: authUser } = useAuthContext();
  const userId = authUser?.id || authUser?.User_ID;
  const userRole = authUser?.role || authUser?.Role_ID;
  const backendUrl = 'http://localhost:5000/api';

  // Format date consistently
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not specified';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Save tab to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('userDashboardTab', activeTab);
  }, [activeTab]);

  // Fetch events
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, events: true }));
      const response = await axios.get(`${backendUrl}/events/getEvents`);
      setEvents(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
    } finally {
      setLoading(prev => ({ ...prev, events: false }));
    }
  }, [backendUrl]);

  // Fetch tickets
  const fetchTickets = useCallback(async () => {
    if (!userId) {
      console.log('No user ID available for fetching tickets');
      return;
    }
    try {
      setLoading(prev => ({ ...prev, tickets: true }));
      const response = await axios.get(`${backendUrl}/events/getTickets/${userId}`);
      setTickets(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      // Don't show error for empty tickets - it's normal
      if (err.response?.status !== 404) {
        setError('Failed to load tickets');
      }
    } finally {
      setLoading(prev => ({ ...prev, tickets: false }));
    }
  }, [backendUrl, userId]);

  // Fetch venues
  const fetchVenues = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, venues: true }));
      const response = await axios.get(`${backendUrl}/events/getVenues`);
      setVenues(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching venues:', err);
      setError('Failed to load venues');
    } finally {
      setLoading(prev => ({ ...prev, venues: false }));
    }
  }, [backendUrl]);

  // Initial data fetch based on active tab
  useEffect(() => {
    const loadInitialData = async () => {
      setInitialLoadComplete(false);
      
      // Always fetch events for the first tab
      if (activeTab === 0) {
        await fetchEvents();
      } else if (activeTab === 1) {
        await fetchTickets();
      } else if (activeTab === 2) {
        await fetchVenues();
      }
      
      setInitialLoadComplete(true);
    };

    loadInitialData();
  }, [activeTab, fetchEvents, fetchTickets, fetchVenues]);

  // Prefetch data for other tabs in the background
  useEffect(() => {
    // Only prefetch after initial load is complete
    if (initialLoadComplete) {
      if (activeTab === 0) {
        // Prefetch tickets and venues in background
        fetchTickets();
        fetchVenues();
      } else if (activeTab === 1) {
        // Prefetch events and venues
        fetchEvents();
        fetchVenues();
      } else if (activeTab === 2) {
        // Prefetch events and tickets
        fetchEvents();
        fetchTickets();
      }
    }
  }, [activeTab, initialLoadComplete, fetchEvents, fetchTickets, fetchVenues]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('userDashboardTab');
    navigate('/login');
  };

  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  // Get loading state for current tab
  const getCurrentTabLoading = () => {
    if (activeTab === 0) return loading.events;
    if (activeTab === 1) return loading.tickets;
    if (activeTab === 2) return loading.venues;
    return false;
  };

  return (
    <DashboardContainer>
      <Sidebar elevation={3}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Avatar sx={{ width: 80, height: 80, mb: 2 }} src="/user-avatar.jpg" />
          <Typography variant="h6">{authUser?.name || authUser?.Name || 'User'}</Typography>
          <Typography variant="body2" color="text.secondary">
            {userRole === 1 ? 'Admin' : 'Member'}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Button
            fullWidth
            startIcon={<Person />}
            sx={{ justifyContent: 'flex-start', mb: 1 }}
            onClick={() => navigate('/user_profile')}
          >
            My Profile
          </Button>
          <Button
            fullWidth
            startIcon={<ConfirmationNumber />}
            sx={{ justifyContent: 'flex-start', mb: 1 }}
            onClick={(e) => handleTabChange(e, 1)}
          >
            My Tickets
          </Button>
          <Button
            fullWidth
            startIcon={<Logout />}
            sx={{ justifyContent: 'flex-start', color: 'error.main' }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Sidebar>

      <MainContent>
        <Typography variant="h4" gutterBottom>
          Event Dashboard
        </Typography>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ mb: 3 }}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Upcoming Events" icon={<CalendarToday />} />
          <Tab label="My Tickets" icon={<ConfirmationNumber />} />
          <Tab label="Venues" icon={<LocationOn />} />
        </Tabs>

        {getCurrentTabLoading() && !initialLoadComplete ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : null}

        {error && (
          <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
        )}

        {success && (
          <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
              {success}
            </Alert>
          </Snackbar>
        )}

        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Discover Exciting Events
            </Typography>
            <Grid container spacing={3}>
              {events.length > 0 ? (
                events.map((event) => (
                  <Grid item xs={12} sm={6} md={4} key={event._id || event.Event_ID}>
                    <EventCard onClick={() => navigate(`/payment/${event._id || event.Event_ID}`)}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Chip 
                            label={event.category || event.Event_Category || 'General'} 
                            size="small" 
                          />
                          <Typography variant="subtitle1">
                            Ksh {event.Ticket_Price || '0'}
                          </Typography>
                        </Box>
                        <Typography gutterBottom variant="h6">
                          {event.Event_Name || 'Untitled Event'}
                        </Typography>
                        <Box display="flex" alignItems="center" mb={1}>
                          <CalendarToday fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(event.Event_Date)}
                            {event.Event_Start_Time && ` • ${event.Event_Start_Time}`}
                            {event.Event_End_Time && ` - ${event.Event_End_Time}`}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={2}>
                          <ConfirmationNumber fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {event.Available_Tickets !== undefined 
                              ? `${event.Available_Tickets} tickets available` 
                              : 'Ticket availability not specified'}
                          </Typography>
                        </Box>
                        <Button
                          fullWidth
                          variant="contained"
                          disabled={event.Available_Tickets === 0 || loading.events}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/payment/${event._id || event.Event_ID}`);
                          }}
                          sx={{ mt: 1 }}
                        >
                          {event.Available_Tickets > 0 ? 'Purchase Ticket' : 'Sold Out'}
                        </Button>
                      </CardContent>
                    </EventCard>
                  </Grid>
                ))
              ) : (
                !loading.events && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                      <Typography variant="body1" color="text.secondary">
                        No events available at the moment.
                      </Typography>
                    </Paper>
                  </Grid>
                )
              )}
            </Grid>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Your Tickets
            </Typography>
            
            <Paper sx={{ p: 2 }}>
              {loading.tickets ? (
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress />
                </Box>
              ) : Array.isArray(tickets) && tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <Box 
                    key={ticket._id || ticket.Ticket_ID} 
                    mb={2} 
                    p={2} 
                    sx={{ 
                      border: '1px solid', 
                      borderColor: 'divider', 
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" fontWeight="medium">
                        {ticket.event?.title || ticket.Event_Name || 'Unknown Event'}
                      </Typography>
                      <Chip 
                        label={ticket.status || ticket.Status} 
                        color={
                          (ticket.status || ticket.Status) === 'Confirmed' ? 'success' : 
                          (ticket.status || ticket.Status) === 'Cancelled' ? 'error' : 'warning'
                        } 
                        size="small"
                      />
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" mt={1.5}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Date:</strong> {new Date(ticket.Purchase_Date || ticket.purchaseDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Qty:</strong> {ticket.Quantity || ticket.quantity}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Total:</strong> Ksh{ticket.Total_Price || ticket.totalPrice}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" justifyContent="flex-end" mt={1.5}>
                      <Button 
                        size="small" 
                        sx={{ mr: 1 }}
                        onClick={() => navigate(`/ticket/${ticket._id || ticket.Ticket_ID}`)}
                      >
                        View Details
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined"
                        color="error"
                        disabled={(ticket.status || ticket.Status) === 'Cancelled'}
                      >
                        Cancel Ticket
                      </Button>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography variant="body1" color="text.secondary" mb={2}>
                    You haven't purchased any tickets yet.
                  </Typography>
                  <Button 
                    variant="contained"
                    onClick={() => handleTabChange(null, 0)}
                    startIcon={<CalendarToday />}
                  >
                    Browse Events
                  </Button>
                </Box>
              )}
            </Paper>
          </Box>
        )}
        
        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Popular Venues
            </Typography>
            <Grid container spacing={3}>
              {venues.length > 0 ? (
                venues.map((venue) => (
                  <Grid item xs={12} sm={6} md={4} key={venue._id || venue.Venue_ID}>
                    <EventCard onClick={() => navigate(`/venue/${venue._id || venue.Venue_ID}`)}>
                      <CardContent>
                        <Typography gutterBottom variant="h6">
                          {venue.name || venue.Venue_Name || 'Unnamed Venue'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {venue.city || venue.City || 'Location not specified'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Capacity: {venue.capacity || venue.Capacity || 'N/A'}
                        </Typography>
                      </CardContent>
                    </EventCard>
                  </Grid>
                ))
              ) : (
                !loading.venues && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                      <Typography variant="body1" color="text.secondary">
                        No venues available.
                      </Typography>
                    </Paper>
                  </Grid>
                )
              )}
            </Grid>
          </Box>
        )}
      </MainContent>
    </DashboardContainer>
  );
};

export default UserDashboard;
import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Edit, Save, Cancel, Lock, Email, Phone, Person, Ticket } from '@mui/icons-material';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';

const UserProfile = () => {
  const { user, authIsReady } = useAuthContext();
  const [profileData, setProfileData] = useState(null);
  const [userTickets, setUserTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Username: '',
    ContactInfo: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const backendUrl = 'http://localhost:5000/api';

  // Fetch user profile
  useEffect(() => {
    if (!authIsReady || !user) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch profile
        const profileResponse = await axios.get(`${backendUrl}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (profileResponse.data.success) {
          setProfileData(profileResponse.data.data);
          setFormData({
            Name: profileResponse.data.data.Name || '',
            Email: profileResponse.data.data.Email || '',
            Username: profileResponse.data.data.Username || '',
            ContactInfo: profileResponse.data.data.ContactInfo || ''
          });
        } else {
          setError('Failed to fetch profile data');
        }

        // Fetch user tickets
        try {
          const ticketsResponse = await axios.get(
            `${backendUrl}/participants/user/${user.id}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          if (ticketsResponse.data.success) {
            setUserTickets(ticketsResponse.data.data || []);
          }
        } catch (ticketErr) {
          console.log('Could not fetch tickets, continuing anyway');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authIsReady, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${backendUrl}/user/updateProfile`,
        {
          Name: formData.Name,
          Email: formData.Email,
          ContactInfo: formData.ContactInfo
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setProfileData(response.data.data);
        setSuccess('Profile updated successfully');
        setEditMode(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${backendUrl}/user/changePassword`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setSuccess('Password changed successfully');
        setChangePasswordOpen(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (!authIsReady) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (loading && !profileData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom color="text.primary">
          My Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your account settings and view your bookings
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Profile Information</Typography>
                <Button
                  startIcon={editMode ? <Cancel /> : <Edit />}
                  onClick={() => {
                    if (editMode) {
                      setFormData({
                        Name: profileData.Name || '',
                        Email: profileData.Email || '',
                        Username: profileData.Username || '',
                        ContactInfo: profileData.ContactInfo || ''
                      });
                    }
                    setEditMode(!editMode);
                  }}
                  variant="outlined"
                >
                  {editMode ? 'Cancel' : 'Edit'}
                </Button>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />

                <TextField
                  fullWidth
                  label="Email"
                  name="Email"
                  type="email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />

                <TextField
                  fullWidth
                  label="Username"
                  name="Username"
                  value={formData.Username}
                  disabled
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />

                <TextField
                  fullWidth
                  label="Contact Information"
                  name="ContactInfo"
                  value={formData.ContactInfo}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Stack>

              {editMode && (
                <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    onClick={handleSaveProfile}
                    disabled={loading}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Account Stats Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Role
                  </Typography>
                  <Chip
                    label="Event Participant"
                    color="info"
                    variant="outlined"
                    sx={{ mt: 0.5 }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Account Status
                  </Typography>
                  <Chip
                    label="Active"
                    color="success"
                    sx={{ mt: 0.5 }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Bookings
                  </Typography>
                  <Typography variant="h5">
                    {userTickets.length}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography variant="body1">
                    {profileData?.Created_At ? new Date(profileData.Created_At).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Button
                fullWidth
                variant="outlined"
                startIcon={<Lock />}
                onClick={() => setChangePasswordOpen(true)}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Bookings Table */}
        {userTickets.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Ticket sx={{ color: 'primary.main' }} />
                    Your Bookings
                  </Box>
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'primary.light' }}>
                        <TableCell>Event Name</TableCell>
                        <TableCell>Event Date</TableCell>
                        <TableCell>Venue</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userTickets.map((ticket) => (
                        <TableRow key={ticket.Booking_ID}>
                          <TableCell>{ticket.Event_Name}</TableCell>
                          <TableCell>
                            {new Date(ticket.Event_Date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{ticket.Venue_Name}</TableCell>
                          <TableCell>
                            <Chip
                              label={ticket.Payment_Status || 'Pending'}
                              color={ticket.Payment_Status === 'Completed' ? 'success' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            Ksh {ticket.Total_Price || 0}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePasswordOpen(false)}>Cancel</Button>
          <Button
            onClick={handlePasswordChange}
            variant="contained"
            disabled={loading}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfile;

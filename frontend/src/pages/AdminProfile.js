import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Edit, Save, Cancel, Lock, Email, Phone, Person } from '@mui/icons-material';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';

const AdminProfile = () => {
  const { user, authIsReady } = useAuthContext();
  const [profileData, setProfileData] = useState(null);
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

  // Fetch admin profile
  useEffect(() => {
    if (!authIsReady || !user) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setProfileData(response.data.data);
          setFormData({
            Name: response.data.data.Name || '',
            Email: response.data.data.Email || '',
            Username: response.data.data.Username || '',
            ContactInfo: response.data.data.ContactInfo || ''
          });
        } else {
          setError('Failed to fetch profile data');
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
    <Box sx={{ 
      p: { xs: 2, sm: 3, md: 4 },
      minHeight: '100vh',
      backgroundColor: '#f5f7fa'
    }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom color="text.primary" sx={{ fontWeight: 600, mb: 0.5 }}>
            Admin Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your admin account settings and preferences
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" onClose={() => setError('')} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Profile Card */}
          <Grid item xs={12} md={8}>
            <Card sx={{ 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Profile Information
                  </Typography>
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
                    size="small"
                  >
                    {editMode ? 'Cancel' : 'Edit'}
                  </Button>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="Name"
                    value={formData.Name}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1.5, color: 'primary.main', fontSize: '1.2rem' }} />
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
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1.5, color: 'primary.main', fontSize: '1.2rem' }} />
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Username"
                    name="Username"
                    value={formData.Username}
                    disabled
                    variant="outlined"
                    size="small"
                  />

                  <TextField
                    fullWidth
                    label="Contact Information"
                    name="ContactInfo"
                    value={formData.ContactInfo}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: <Phone sx={{ mr: 1.5, color: 'primary.main', fontSize: '1.2rem' }} />
                    }}
                  />

                  {editMode && (
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSaveProfile}
                        disabled={loading}
                        sx={{ flex: 1 }}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar Cards */}
          <Grid item xs={12} md={4}>
            {/* Account Details Card */}
            <Card sx={{ 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              mb: 3,
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Account Details
                </Typography>
                <Divider sx={{ mb: 2.5 }} />

                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="caption" sx={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', display: 'block', mb: 0.75 }}>
                      Role
                    </Typography>
                    <Chip
                      label="Administrator"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', display: 'block', mb: 0.75 }}>
                      Account Status
                    </Typography>
                    <Chip
                      label="Active"
                      color="success"
                    />
                  </Box>
                  
                </Stack>
              </CardContent>
            </Card>

            {/* Security Card */}
            <Card sx={{ 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Security
                </Typography>
                <Divider sx={{ mb: 2.5 }} />

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Lock />}
                  onClick={() => setChangePasswordOpen(true)}
                  size="small"
                >
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

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
              variant="outlined"
              size="small"
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              variant="outlined"
              size="small"
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              variant="outlined"
              size="small"
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

export default AdminProfile;

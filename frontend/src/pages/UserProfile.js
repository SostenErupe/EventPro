import { useState, useEffect } from 'react';
import { 
  Container, Card, Typography, Box, 
  Button, TextField, Avatar, Divider,
  CircularProgress, Alert, Chip
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import axios from 'axios';

const UserProfile = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactInfo: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  const backendUrl = 'http://localhost:5000/api';

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/users/getUserById${userId}`);
        
        if (response.data.success) {
          setUserData(response.data.user);
          setFormData({
            name: response.data.user.Name,
            email: response.data.user.Email,
            contactInfo: response.data.user.ContactInfo
          });
        } else {
          setError(response.data.error || 'Failed to fetch user data');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.response?.data?.error || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${backendUrl}/users/updateProfile`, 
        {
          name: formData.name,
          email: formData.email,
          contactInfo: formData.contactInfo
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setUserData(prev => ({
          ...prev,
          ...formData
        }));
        setSuccessMessage('Profile updated successfully');
        setEditMode(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userData) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            User Profile
          </Typography>
          {!editMode ? (
            <Button 
              variant="contained" 
              startIcon={<Edit />}
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <Box>
              <Button 
                variant="outlined" 
                startIcon={<Cancel />}
                onClick={() => setEditMode(false)}
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<Save />}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </Box>
          )}
        </Box>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar 
            sx={{ 
              width: 100, 
              height: 100, 
              fontSize: '2.5rem',
              bgcolor: 'primary.main',
              mr: 3
            }}
          >
            {userData?.Name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" component="h2">
              {userData?.Name}
            </Typography>
            <Chip 
              label={userData?.Role_Name} 
              color={userData?.Role_ID === 1 ? 'primary' : 'default'}
              sx={{ mt: 1 }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {editMode ? (
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Contact Information"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
            />
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
              Username
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {userData?.Username}
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
              Email
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {userData?.Email}
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
              Contact Information
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {userData?.ContactInfo || 'Not provided'}
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
              User ID
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {userData?.User_ID}
            </Typography>
          </Box>
        )}
      </Card>
    </Container>
  );
};

export default UserProfile;
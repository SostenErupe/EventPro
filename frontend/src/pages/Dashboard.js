import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileCheck, QrCode, Scan, Users, Clock, LocateIcon } from "lucide-react";
import { Card, Box , Button, Typography, Stack, Grid } from "@mui/material";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";

const Dashboard = () => {
  const { authIsReady, user } = useAuthContext();
  const [stats, setStats] = useState({
    totalParticipants: 0,
    verifiedParticipants: 0,
    pendingVerification: 0,
    attendedParticipants: 0,
  });
  const [activities, setActivities] = useState([]);

  const backendUrl = "http://localhost:5000";

  useEffect(() => {
    if (!authIsReady || !user) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [totalParticipants, attendance, activitiesResponse] = await Promise.all([
          axios.get(`${backendUrl}/api/verification/results`, { headers }),
          axios.get(`${backendUrl}/api/participants/get-all-attendees`, { headers }),
          axios.get(`${backendUrl}/api/activities/recent`, { headers })
        ]);
        
        setStats({
          totalParticipants: totalParticipants.data.totalCount,
          verifiedParticipants: totalParticipants.data.verifiedCount,
          pendingVerification: totalParticipants.data.pending,
          attendedParticipants: attendance.data.count,
        });

        setActivities(activitiesResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [authIsReady, user]);

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom color="text.primary">Dashboard</Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" color="text.secondary">Total Participants</Typography>
                <Typography variant="h4">{stats.totalParticipants}</Typography>
              </Box>
              <Users sx={{ color: 'primary.main', fontSize: 32 }} />
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" color="text.secondary">Verified Payments</Typography>
                <Typography variant="h4">{stats.verifiedParticipants}</Typography>
              </Box>
              <FileCheck sx={{ color: 'success.main', fontSize: 32 }} />
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" color="text.secondary">Pending Verification</Typography>
                <Typography variant="h4">{stats.pendingVerification}</Typography>
              </Box>
              <QrCode sx={{ color: 'warning.main', fontSize: 32 }} />
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" color="text.secondary">Attended</Typography>
                <Typography variant="h4">{stats.attendedParticipants}</Typography>
              </Box>
              <Scan sx={{ color: 'secondary.main', fontSize: 32 }} />
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Quick Actions</Typography>
            <Grid container spacing={2}>
              {[
                { icon: <FileCheck />, text: "Verify Payments", to: "/payment_verification", color: "primary" },
                { icon: <LocateIcon />, text: "Venues", to: "/venues", color: "success" },
                { icon: <Users />, text: "View All Participants", to: "/participants", color: "warning" },
              ].map((action, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Button
                    component={Link}
                    to={action.to}
                    variant="contained"
                    color={action.color}
                    startIcon={action.icon}
                    fullWidth
                    sx={{ 
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      py: 1.5
                    }}
                  >
                    {action.text}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
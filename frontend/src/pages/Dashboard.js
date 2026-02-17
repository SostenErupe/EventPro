import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FileCheck, 
  QrCode, 
  Scan, 
  Users, 
  Clock, 
  LocateIcon,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  UserCheck,
  ArrowRight
} from "lucide-react";
import { 
  Card, 
  Box, 
  Button, 
  Typography, 
  Stack, 
  Grid, 
  Paper,
  LinearProgress,
  Chip,
  Container,
  alpha,
  useTheme
} from "@mui/material";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";

const Dashboard = () => {
  const theme = useTheme();
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
          totalParticipants: totalParticipants.data.totalCount || 0,
          verifiedParticipants: totalParticipants.data.verifiedCount || 0,
          pendingVerification: totalParticipants.data.pending || 0,
          attendedParticipants: attendance.data.count || 0,
        });

        setActivities(activitiesResponse.data.data || []);
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
  };

  // Calculate verification rate
  const verificationRate = stats.totalParticipants > 0 
    ? Math.round((stats.verifiedParticipants / stats.totalParticipants) * 100) 
    : 0;

  // Calculate attendance rate
  const attendanceRate = stats.totalParticipants > 0 
    ? Math.round((stats.attendedParticipants / stats.totalParticipants) * 100) 
    : 0;

  const statCards = [
    {
      title: "Total Participants",
      value: stats.totalParticipants,
      icon: <Users size={28} />,
      color: theme.palette.primary.main,
      lightColor: alpha(theme.palette.primary.main, 0.1),
      trend: "+12%",
      subtitle: "All registered users"
    },
    {
      title: "Verified Payments",
      value: stats.verifiedParticipants,
      icon: <CheckCircle size={28} />,
      color: theme.palette.success.main,
      lightColor: alpha(theme.palette.success.main, 0.1),
      trend: `${verificationRate}%`,
      subtitle: "Of total participants"
    },
    {
      title: "Pending Verification",
      value: stats.pendingVerification,
      icon: <AlertCircle size={28} />,
      color: theme.palette.warning.main,
      lightColor: alpha(theme.palette.warning.main, 0.1),
      subtitle: "Awaiting approval"
    },
    {
      title: "Attended",
      value: stats.attendedParticipants,
      icon: <UserCheck size={28} />,
      color: theme.palette.info.main,
      lightColor: alpha(theme.palette.info.main, 0.1),
      trend: `${attendanceRate}%`,
      subtitle: "Event attendance"
    }
  ];

  const quickActions = [
    { 
      icon: <FileCheck size={20} />, 
      text: "Verify Payments", 
      to: "/payment_verification", 
      color: "primary",
      description: "Review and verify pending payments",
      count: stats.pendingVerification
    },
    { 
      icon: <LocateIcon size={20} />, 
      text: "Venues", 
      to: "/venues", 
      color: "success",
      description: "Manage event venues"
    },
    { 
      icon: <Users size={20} />, 
      text: "All Participants", 
      to: "/participants", 
      color: "warning",
      description: "View complete participant list",
      count: stats.totalParticipants
    },
  ];

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3, md: 4 },
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            color: '#1e293b',
            mb: 0.5
          }}
        >
          Dashboard Overview
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#64748b'
          }}
        >
          Welcome back! Here's what's happening with your events today.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 8.5,
                height: '60%',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'rgba(0,0,0,0.05)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.05)'
                }
              }}
            >
              <Stack spacing={2}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start'
                }}>
                  <Box sx={{ 
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: stat.lightColor,
                    color: stat.color
                  }}>
                    {stat.icon}
                  </Box>
                  {stat.trend && (
                    <Chip
                      icon={<TrendingUp size={14} />}
                      label={stat.trend}
                      size="small"
                      sx={{
                        backgroundColor: alpha(stat.color, 0.1),
                        color: stat.color,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 24
                      }}
                    />
                  )}
                </Box>
                
                <Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 700,
                      lineHeight: 1.2,
                      mb: 0.5
                    }}
                  >
                    {stat.value.toLocaleString()}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      color: '#1e293b',
                      mb: 0.25
                    }}
                  >
                    {stat.title}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#64748b',
                      display: 'block'
                    }}
                  >
                    {stat.subtitle}
                  </Typography>
                </Box>

                {/* Mini progress bar for verification/attendance stats */}
                {(index === 1 || index === 3) && (
                  <LinearProgress
                    variant="determinate"
                    value={index === 1 ? verificationRate : attendanceRate}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: alpha(stat.color, 0.1),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: stat.color,
                        borderRadius: 2
                      }
                    }}
                  />
                )}
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'rgba(0,0,0,0.05)'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: '#1e293b',
                mb: 3
              }}
            >
              Quick Actions
            </Typography>
            
            <Grid container spacing={2}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} key={index}>
                  <Button
                    component={Link}
                    to={action.to}
                    fullWidth
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      justifyContent: 'flex-start',
                      backgroundColor: alpha(theme.palette[action.color].main, 0.02),
                      border: '1px solid',
                      borderColor: alpha(theme.palette[action.color].main, 0.1),
                      textTransform: 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette[action.color].main, 0.05),
                        borderColor: theme.palette[action.color].main,
                        transform: 'translateX(4px)',
                        '& .arrow-icon': {
                          opacity: 1,
                          transform: 'translateX(4px)'
                        }
                      }
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      width: '100%'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          p: 1,
                          borderRadius: 1.5,
                          backgroundColor: alpha(theme.palette[action.color].main, 0.1),
                          color: theme.palette[action.color].main
                        }}>
                          {action.icon}
                        </Box>
                        <Box sx={{ textAlign: 'left' }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 600,
                              color: '#1e293b',
                              mb: 0.25
                            }}
                          >
                            {action.text}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: '#64748b',
                              display: 'block'
                            }}
                          >
                            {action.description}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {action.count !== undefined && (
                          <Chip
                            label={action.count}
                            size="small"
                            sx={{
                              backgroundColor: alpha(theme.palette[action.color].main, 0.1),
                              color: theme.palette[action.color].main,
                              fontWeight: 600
                            }}
                          />
                        )}
                        <ArrowRight 
                          size={18} 
                          className="arrow-icon"
                          style={{ 
                            opacity: 0.5,
                            transition: 'all 0.2s ease',
                            color: theme.palette[action.color].main
                          }} 
                        />
                      </Box>
                    </Box>
                  </Button>
                </Grid>
              ))}
            </Grid>

            {/* Summary Stats */}
            <Box sx={{ 
              mt: 3,
              pt: 3,
              borderTop: '1px solid',
              borderColor: 'rgba(0,0,0,0.05)'
            }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700,
                        color: theme.palette.success.main,
                        mb: 0.5
                      }}
                    >
                      {verificationRate}%
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#64748b',
                        fontWeight: 500
                      }}
                    >
                      Verification Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700,
                        color: theme.palette.info.main,
                        mb: 0.5
                      }}
                    >
                      {attendanceRate}%
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#64748b',
                        fontWeight: 500
                      }}
                    >
                      Attendance Rate
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        
      </Grid>
    </Box>
  );
}

export default Dashboard;
// src/pages/LandingPage.jsx
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  Paper,
  Fab,
  Grow,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Search,
  Menu,
  Event,
  LocationOn,
  CalendarToday,
  People,
  TrendingUp,
  Security,
  Speed,
  ArrowForward,
  FavoriteBorder,
  Favorite,
  Share,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  Notifications,
  AccountCircle,
  EventNote,
  BusinessCenter,
  MusicNote,
  Code,
  Language,
  WifiTethering,
  ArrowRight,
  Star,
  AccessTime,
  LocalOffer,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Create a modern, clean theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#2563EB",
      light: "#60A5FA",
      dark: "#1D4ED8",
    },
    secondary: {
      main: "#7C3AED",
      light: "#A78BFA",
      dark: "#5B21B6",
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E293B",
      secondary: "#64748B",
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: "3rem",
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
      "@media (min-width:900px)": {
        fontSize: "3.5rem",
      },
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.25rem",
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontWeight: 700,
      fontSize: "1.75rem",
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
          padding: "8px 20px",
          fontSize: "0.9375rem",
          "&.MuiButton-contained": {
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
            "&:hover": {
              boxShadow: "0 6px 16px rgba(37, 99, 235, 0.3)",
            },
          },
        },
        sizeLarge: {
          padding: "12px 28px",
          fontSize: "1rem",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
          border: "1px solid",
          borderColor: alpha("#000", 0.08),
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            borderColor: alpha("#2563EB", 0.2),
            transform: "translateY(-4px)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
  },
});

// Header Component - Clean and Modern
const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
   const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Events", icon: <Event fontSize="small" /> },
    { label: "Venues", icon: <LocationOn fontSize="small" /> },
    { label: "Create", icon: <EventNote fontSize="small" /> },
    { label: "Dashboard", icon: <BusinessCenter fontSize="small" /> },
  ];

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: scrolled ? "rgba(255, 255, 255, 0.98)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        color: scrolled ? "text.primary" : "white",
        borderBottom: scrolled ? "1px solid" : "none",
        borderColor: scrolled ? "divider" : "transparent",
        py: scrolled ? 1 : 2,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 60, md: 72 } }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                "&:hover": {
                  "& .logo-icon": {
                    transform: "rotate(15deg)",
                  },
                },
              }}
            >
              <Box
                className="logo-icon"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: scrolled
                    ? "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)"
                    : "linear-gradient(135deg, #FFFFFF 0%, rgba(255,255,255,0.9) 100%)",
                  transition: "transform 0.3s ease",
                }}
              >
                <Event
                  sx={{
                    fontSize: 20,
                    color: scrolled ? "white" : "#2563EB",
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: "1.5rem",
                  background: scrolled
                    ? "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)"
                    : "linear-gradient(135deg, #FFFFFF 0%, #E0F2FE 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: { xs: "none", sm: "block" },
                }}
              >
                NairobiEvents
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.label}
                startIcon={item.icon}
                sx={{
                  color: scrolled ? "text.primary" : "white",
                  "&:hover": {
                    backgroundColor: scrolled
                      ? alpha("#2563EB", 0.04)
                      : "rgba(255, 255, 255, 0.12)",
                  },
                  borderRadius: 2,
                  px: 2,
                }}
              >
                {item.label}
              </Button>
            ))}

            <IconButton
              sx={{
                color: scrolled ? "text.primary" : "white",
                ml: 1,
                "&:hover": {
                  backgroundColor: scrolled
                    ? alpha("#2563EB", 0.04)
                    : "rgba(255, 255, 255, 0.12)",
                },
              }}
            >
              <Notifications fontSize="small" />
            </IconButton>

            <Button
              variant="contained"
              startIcon={<AccountCircle />}
              sx={{
                ml: 2,
                background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(135deg, #1D4ED8 0%, #5B21B6 100%)",
                },
              }}
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            sx={{
              display: { md: "none" },
              color: scrolled ? "text.primary" : "white",
              "&:hover": {
                backgroundColor: scrolled
                  ? alpha("#2563EB", 0.04)
                  : "rgba(255, 255, 255, 0.12)",
              },
            }}
            onClick={() => setDrawerOpen(true)}
          >
            <Menu />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 280, borderRadius: "16px 0 0 16px" },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
              }}
            >
              <Event sx={{ fontSize: 20, color: "white" }} />
            </Box>
            <Typography variant="h6" fontWeight={800}>
              NairobiEvents
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <List>
            {navItems.map((item) => (
              <ListItem
                key={item.label}
                disablePadding
                sx={{ mb: 1, borderRadius: 2, overflow: "hidden" }}
              >
                <Button
                  fullWidth
                  startIcon={item.icon}
                  sx={{
                    justifyContent: "flex-start",
                    py: 1.5,
                    px: 2,
                    borderRadius: 2,
                    color: "text.primary",
                    "&:hover": {
                      backgroundColor: alpha("#2563EB", 0.04),
                    },
                  }}
                >
                  {item.label}
                </Button>
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AccountCircle />}
              sx={{
                background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                color: "white",
                py: 1.5,
                mb: 2,
              }}
              onClick={() => {
                setDrawerOpen(false);
                navigate("/login");
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
};

// Hero Section - Modern & Centered
const HeroSection = () => {
  const [search, setSearch] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const categories = [
    { icon: <Code fontSize="small" />, label: "Technology", color: "#2563EB" },
    { icon: <Language fontSize="small" />, label: "Web3", color: "#7C3AED" },
    { icon: <WifiTethering fontSize="small" />, label: "IoT", color: "#059669" },
    { icon: <BusinessCenter fontSize="small" />, label: "Business", color: "#F59E0B" },
    { icon: <MusicNote fontSize="small" />, label: "Music", color: "#EC4899" },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        background: "linear-gradient(135deg, #1E40AF 0%, #4F46E5 50%, #7C3AED 100%)",
        color: "white",
        pt: { xs: 15, md: 18 },
        pb: { xs: 12, md: 16 },
        overflow: "hidden",
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          animation: "float 20s infinite ease-in-out",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          right: "10%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
          animation: "float 15s infinite ease-in-out reverse",
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Location Badge */}
              <Chip
                icon={<LocationOn />}
                label="Nairobi, Kenya"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  color: "white",
                  mb: 4,
                  fontWeight: 600,
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  "& .MuiChip-icon": {
                    color: "white",
                  },
                }}
              />

              {/* Main Title */}
              <Typography
                variant="h1"
                sx={{
                  mb: 3,
                  fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Where Nairobi's
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    background: "linear-gradient(135deg, #93C5FD 0%, #C4B5FD 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mt: 1,
                  }}
                >
                  Tech Community Connects
                </Box>
              </Typography>

              {/* Description */}
              <Typography
                variant="h6"
                sx={{
                  mb: 5,
                  opacity: 0.9,
                  fontWeight: 400,
                  lineHeight: 1.6,
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  textAlign: { xs: "center", md: "left" },
                  maxWidth: "90%",
                }}
              >
                Discover Nairobi's most exciting tech events, from AI workshops to Web3
                conferences. Network, learn, and grow with industry leaders and innovators.
              </Typography>

              {/* Search Bar */}
              <Paper
                component="form"
                sx={{
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(12px)",
                  mb: 4,
                  maxWidth: "100%",
                  mx: "auto",
                }}
              >
                <Search sx={{ color: "text.secondary", ml: 1.5, mr: 1 }} />
                <TextField
                  fullWidth
                  placeholder="Search for AI workshops, Web3 meetups, networking events..."
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      fontSize: "0.9375rem",
                      color: "text.primary",
                      "&::placeholder": {
                        color: "text.secondary",
                        opacity: 0.7,
                      },
                    },
                  }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<ArrowForward />}
                  sx={{
                    background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                    color: "white",
                    ml: 1.5,
                    px: 3,
                    whiteSpace: "nowrap",
                  }}
                >
                  Search
                </Button>
              </Paper>

              {/* Categories */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.5,
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                {categories.map((cat) => (
                  <Chip
                    key={cat.label}
                    icon={cat.icon}
                    label={cat.label}
                    sx={{
                      backgroundColor: alpha(cat.color, 0.15),
                      color: "white",
                      border: `1px solid ${alpha(cat.color, 0.3)}`,
                      "&:hover": {
                        backgroundColor: alpha(cat.color, 0.25),
                      },
                      "& .MuiChip-icon": {
                        color: alpha(cat.color, 0.9),
                      },
                    }}
                  />
                ))}
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  maxWidth: "100%",
                  mx: "auto",
                }}
              >
                <Box sx={{ position: "relative", height: 280 }}>
                  <CardMedia
                    component="img"
                    image="https://images.unsplash.com/photo-1492684223066-e9e4aab4d25e?auto=format&fit=crop&w=800&q=80"
                    alt="Nairobi Tech Event"
                    sx={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
                    }}
                  />
                  <Chip
                    label="Technology"
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      backgroundColor: "#2563EB",
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 3,
                      color: "white",
                    }}
                  >
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      Nairobi Tech Week 2024
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <CalendarToday sx={{ fontSize: 16 }} />
                        <Typography variant="body2">Mar 15-17</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <People sx={{ fontSize: 16 }} />
                        <Typography variant="body2">1.2K attending</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Stats Section - Clean and Animated
const StatsSection = () => {
  const [stats, setStats] = useState([
    { value: 0, label: "Events Monthly", suffix: "+", color: "#2563EB" },
    { value: 0, label: "Community Members", suffix: "K+", color: "#7C3AED" },
    { value: 0, label: "Premium Venues", suffix: "+", color: "#059669" },
    { value: 0, label: "Partner Organizers", suffix: "+", color: "#F59E0B" },
  ]);

  useEffect(() => {
    const targets = [287, 10.2, 54, 156];
    const duration = 1800;
    const steps = 50;

    stats.forEach((stat, index) => {
      let current = 0;
      const increment = targets[index] / steps;
      const interval = setInterval(() => {
        current += increment;
        if (current >= targets[index]) {
          current = targets[index];
          clearInterval(interval);
        }
        setStats((prev) => {
          const newStats = [...prev];
          newStats[index].value = parseFloat(current.toFixed(index === 1 ? 1 : 0));
          return newStats;
        });
      }, duration / steps);
    });
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <Typography
          variant="h2"
          sx={{ textAlign: "center", mb: 2 }}
        >
          Nairobi's Event Hub in Numbers
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: "center", maxWidth: 600, mx: "auto" }}
        >
          Join thousands of professionals who trust our platform for discovering and
          organizing events
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={6} md={3} key={stat.label}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  textAlign: "center",
                  height: "100%",
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "background.paper",
                  "&:hover": {
                    borderColor: alpha(stat.color, 0.3),
                    backgroundColor: alpha(stat.color, 0.02),
                  },
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    color: stat.color,
                    mb: 1,
                    fontSize: { xs: "2rem", md: "2.5rem" },
                  }}
                >
                  {stat.value}
                  {stat.suffix}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

// Featured Events Section - Consistent Card Sizes
const FeaturedEvents = () => {
  const [likedEvents, setLikedEvents] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const events = [
    {
      id: 1,
      title: "Nairobi Tech Week 2024",
      category: "Technology",
      date: "Mar 15-17, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "KICC Convention Center",
      price: "KSh 5,000",
      image:
        "https://images.unsplash.com/photo-1492684223066-e9e4aab4d25e?auto=format&fit=crop&w=400&q=80",
      seats: 45,
      totalSeats: 500,
      organizer: "TechNairobi",
      rating: 4.8,
      reviews: 124,
    },
    {
      id: 2,
      title: "Web3 Africa Summit",
      category: "Blockchain",
      date: "Feb 28, 2024",
      time: "10:00 AM - 5:00 PM",
      location: "iHub Nairobi",
      price: "Free",
      image:
        "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=400&q=80",
      seats: 78,
      totalSeats: 300,
      organizer: "Blockchain Kenya",
      rating: 4.9,
      reviews: 89,
    },
    {
      id: 3,
      title: "IoT Innovation Expo",
      category: "IoT",
      date: "Mar 5, 2024",
      time: "8:00 AM - 4:00 PM",
      location: "Nairobi Garage",
      price: "KSh 2,500",
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80",
      seats: 23,
      totalSeats: 150,
      organizer: "IoT Kenya",
      rating: 4.7,
      reviews: 56,
    },
  ];

  const handleLike = (eventId) => {
    setLikedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const getTicketPercentage = (available, total) => {
    return ((total - available) / total) * 100;
  };

  return (
    <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: "background.default" }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box
          sx={{
            mb: { xs: 6, md: 8 },
            textAlign: "center",
          }}
        >
          <Typography variant="h2" gutterBottom>
            Featured Tech Events
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Handpicked events for Nairobi's tech community. Don't miss out on these
            opportunities to learn and network.
          </Typography>
        </Box>

        {/* Events Grid */}
        <Grid container spacing={3}>
          {events.map((event, index) => (
            <Grid item xs={12} md={4} key={event.id}>
              <Grow in timeout={800 + index * 200}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  {/* Event Image */}
                  <Box sx={{ position: "relative", height: 200 }}>
                    <CardMedia
                      component="img"
                      image={event.image}
                      alt={event.title}
                      sx={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <Chip
                      label={event.category}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        backgroundColor: "primary.main",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleLike(event.id)}
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        "&:hover": {
                          backgroundColor: "white",
                        },
                      }}
                    >
                      {likedEvents.includes(event.id) ? (
                        <Favorite fontSize="small" color="error" />
                      ) : (
                        <FavoriteBorder fontSize="small" />
                      )}
                    </IconButton>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    {/* Event Title and Rating */}
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          lineHeight: 1.4,
                          height: "3em",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {event.title}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Star sx={{ fontSize: 16, color: "#FBBF24" }} />
                        <Typography variant="body2" fontWeight={600}>
                          {event.rating}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ({event.reviews} reviews)
                        </Typography>
                      </Box>
                    </Box>

                    {/* Event Details */}
                    <Box sx={{ mb: 3, "& > *": { mb: 1 } }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarToday sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.date} • {event.time}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocationOn sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {event.location}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Progress Bar */}
                    <Box sx={{ mb: 3 }}>
                      <Box
                        sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Tickets Available
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {event.seats} / {event.totalSeats}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 6,
                          backgroundColor: "grey.200",
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            height: "100%",
                            width: `${getTicketPercentage(event.seats, event.totalSeats)}%`,
                            background: "linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)",
                            borderRadius: 3,
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Price and Organizer */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                      }}
                    >
                      <Box>
                        <Typography variant="h6" color="primary.main" fontWeight={700}>
                          {event.price}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          per person
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        by {event.organizer}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Event />}
                      sx={{
                        background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                        color: "white",
                        py: 1.5,
                      }}
                    >
                      Book Now
                    </Button>
                  </CardActions>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {/* View All Button */}
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Button
            variant="outlined"
            endIcon={<ArrowRight />}
            size="large"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
              },
            }}
          >
            View All Events
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

// Features Section - Modern Benefits
const FeaturesSection = () => {
  const features = [
    {
      icon: <Security sx={{ fontSize: 32 }} />,
      title: "Secure Payments",
      description:
        "MPesa, cards, and crypto with bank-level security and instant verification",
      color: "#059669",
    },
    {
      icon: <TrendingUp sx={{ fontSize: 32 }} />,
      title: "Smart Networking",
      description:
        "AI-powered matchmaking with attendees based on interests and goals",
      color: "#2563EB",
    },
    {
      icon: <Speed sx={{ fontSize: 32 }} />,
      title: "Instant Check-in",
      description: "QR code tickets with real-time verification and attendance tracking",
      color: "#7C3AED",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
      <Box sx={{ mb: { xs: 6, md: 8 }, textAlign: "center" }}>
        <Typography variant="h2" gutterBottom>
          Why Choose NairobiEvents
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
          We're building the future of event management in Nairobi with features designed
          for modern professionals
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={feature.title}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  height: "100%",
                  textAlign: "center",
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "background.paper",
                  "&:hover": {
                    borderColor: alpha(feature.color, 0.3),
                    backgroundColor: alpha(feature.color, 0.02),
                  },
                }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    p: 2,
                    borderRadius: 3,
                    backgroundColor: alpha(feature.color, 0.1),
                    color: feature.color,
                    mb: 3,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

// CTA Section - Clean and Compelling
const CTASection = () => {
  return (
    <Box
      sx={{
        py: { xs: 12, md: 15 },
        position: "relative",
        backgroundColor: "grey.900",
        color: "white",
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              color: "white",
              fontSize: { xs: "2.25rem", md: "3rem" },
            }}
          >
            Ready to Join Nairobi's
            <Box
              component="span"
              sx={{
                display: "block",
                background: "linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mt: 1,
              }}
            >
              Tech Revolution?
            </Box>
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 6,
              opacity: 0.9,
              fontWeight: 400,
              maxWidth: 600,
              mx: "auto",
              fontSize: { xs: "1rem", md: "1.125rem" },
            }}
          >
            Join thousands of developers, founders, and innovators shaping Nairobi's tech
            future. Start discovering amazing events today.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                color: "white",
                px: { xs: 4, md: 5 },
                py: { xs: 1.5, md: 2 },
                fontSize: { xs: "0.9375rem", md: "1rem" },
                "&:hover": {
                  background: "linear-gradient(135deg, #1D4ED8 0%, #5B21B6 100%)",
                },
              }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: "rgba(255, 255, 255, 0.3)",
                color: "white",
                px: { xs: 4, md: 5 },
                py: { xs: 1.5, md: 2 },
                fontSize: { xs: "0.9375rem", md: "1rem" },
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Explore Events
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

// Footer - Clean and Professional
const Footer = () => {
  const footerLinks = {
    Explore: ["Events", "Venues", "Categories", "Trending"],
    Organize: ["Create Event", "Pricing", "Resources", "API"],
    Company: ["About", "Careers", "Blog", "Press"],
    Support: ["Help Center", "Contact", "Privacy", "Terms"],
  };

  return (
    <Box sx={{ backgroundColor: "grey.50", pt: 8, pb: 4, borderTop: "1px solid", borderColor: "divider" }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                }}
              >
                <Event sx={{ fontSize: 20, color: "white" }} />
              </Box>
              <Typography variant="h5" fontWeight={800}>
                NairobiEvents
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 300 }}>
              Connecting Nairobi's vibrant tech community through amazing events and
              experiences. Where innovation meets opportunity.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {[Facebook, Twitter, Instagram, LinkedIn].map((Icon, index) => (
                <IconButton
                  key={index}
                  size="small"
                  sx={{
                    backgroundColor: "white",
                    color: "text.secondary",
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover": {
                      backgroundColor: "grey.100",
                      color: "primary.main",
                    },
                  }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <Grid item xs={6} sm={3} md={2} key={category}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {category}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {links.map((link) => (
                  <Button
                    key={link}
                    sx={{
                      justifyContent: "flex-start",
                      color: "text.secondary",
                      textTransform: "none",
                      px: 0,
                      fontSize: "0.875rem",
                      "&:hover": {
                        color: "primary.main",
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    {link}
                  </Button>
                ))}
              </Box>
            </Grid>
          ))}

          {/* Contact Column */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Contact
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="body2" color="text.secondary">
                  hello@nairobievents.co.ke
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="body2" color="text.secondary">
                  +254 700 000 000
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} NairobiEvents. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Made with ❤️ for Nairobi's tech community
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

// Floating Action Button
const FloatingActionButton = () => {
  return (
    <Fab
      color="primary"
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
        color: "white",
        "&:hover": {
          background: "linear-gradient(135deg, #1D4ED8 0%, #5B21B6 100%)",
        },
      }}
    >
      <Event />
    </Fab>
  );
};

// Main Landing Page Component
const LandingPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        <Header />
        <HeroSection />
        <StatsSection />
        <FeaturedEvents />
        <FeaturesSection />
        <CTASection />
        <Footer />
        <FloatingActionButton />
      </Box>
    </ThemeProvider>
  );
};

export default LandingPage;
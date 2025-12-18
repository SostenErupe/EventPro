// src/pages/AuthPage.jsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Chip,
  Alert,
  CircularProgress,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Event,
  Email,
  Lock,
  Person,
  ArrowBack,
  ArrowForward,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Reuse the same theme as LandingPage for visual consistency
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
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const initialFormState = {
  first_name: "",
  last_name: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
};

const AuthPage = ({ defaultMode = "login" }) => {
  const [mode, setMode] = useState(defaultMode); // 'login' | 'register'
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");
  const navigate = useNavigate();

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateRegister = () => {
    const errors = {};
    if (!formData.first_name.trim()) errors.first_name = "First name is required";
    if (!formData.last_name.trim()) errors.last_name = "Last name is required";
    if (!formData.username.trim()) errors.username = "Username is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Enter a valid email address";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (mode === "register") {
      const errors = validateRegister();
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
    } else {
      if (!formData.username.trim()) {
        setFormErrors({ username: "Username is required" });
        return;
      }
      if (!formData.password) {
        setFormErrors({ password: "Password is required" });
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "register") {
        const payload = {
          username: formData.username.trim(),
          email: formData.email.trim(),
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          password: formData.password,
        };

        const response = await fetch(`${API_BASE_URL}/users/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          let message = "Failed to create account. Please check your details.";
          try {
            const data = await response.json();
            if (typeof data === "object") {
              // Aggregate error messages from DRF
              message =
                data.detail ||
                Object.values(data)
                  .flat()
                  .join(" ");
            }
          } catch {
            // ignore JSON parse errors
          }
          throw new Error(message);
        }

        setSuccess("Account created successfully. You can now log in.");
        setMode("login");
        setFormData((prev) => ({
          ...initialFormState,
          username: prev.username,
        }));
      } else {
        // NOTE: Adjust this endpoint to match your actual Django auth implementation
        const payload = {
          username: formData.username.trim(),
          password: formData.password,
        };

        const response = await fetch(`${API_BASE_URL}/auth/login/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          let message = "Invalid credentials. Please try again.";
          try {
            const data = await response.json();
            if (typeof data === "object") {
              message = data.detail || message;
            }
          } catch {
            // ignore
          }
          throw new Error(message);
        }

        setSuccess("Logged in successfully. Redirecting...");
        setTimeout(() => navigate("/"), 800);
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (() => {
    const pwd = formData.password || "";
    if (!pwd) return { label: "Weak", color: "#FCA5A5", value: 20 };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    if (score <= 1) return { label: "Weak", color: "#F97373", value: 30 };
    if (score === 2) return { label: "Okay", color: "#FBBF24", value: 60 };
    if (score === 3) return { label: "Good", color: "#34D399", value: 80 };
    return { label: "Strong", color: "#10B981", value: 100 };
  })();

  const isRegister = mode === "register";

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "stretch",
          background:
            "linear-gradient(135deg, #1E40AF 0%, #4F46E5 50%, #7C3AED 100%)",
          color: "white",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <Grid
            container
            spacing={4}
            alignItems="stretch"
            justifyContent="center"
          >
            {/* Left side - brand & context */}
            {!isMobile && (
              <Grid item md={6}>
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    pr: { md: 4 },
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 4,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background:
                            "linear-gradient(135deg, #FFFFFF 0%, rgba(255,255,255,0.9) 100%)",
                        }}
                      >
                        <Event sx={{ fontSize: 22, color: "#2563EB" }} />
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 800,
                          background:
                            "linear-gradient(135deg, #BFDBFE 0%, #DDD6FE 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        NairobiEvents
                      </Typography>
                    </Box>

                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        mb: 2,
                        maxWidth: 480,
                      }}
                    >
                      {isRegister
                        ? "Create your NairobiEvents account"
                        : "Welcome back to Nairobi's tech hub"}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        opacity: 0.9,
                        maxWidth: 480,
                        mb: 4,
                      }}
                    >
                      {isRegister
                        ? "Sign up to discover, attend, and organize tech events across Nairobi. Your profile will be linked to your bookings, tickets, and attendance."
                        : "Sign in to manage your tickets, track your attendance, and stay updated on Nairobi's most exciting tech events."}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                      <Chip
                        label="Secure payments"
                        sx={{
                          backgroundColor: "rgba(15,118,110,0.2)",
                          border: "1px solid rgba(34,197,94,0.4)",
                          color: "white",
                        }}
                      />
                      <Chip
                        label="Smart networking"
                        sx={{
                          backgroundColor: "rgba(37,99,235,0.2)",
                          border: "1px solid rgba(59,130,246,0.4)",
                          color: "white",
                        }}
                      />
                      <Chip
                        label="Instant check-in"
                        sx={{
                          backgroundColor: "rgba(124,58,237,0.2)",
                          border: "1px solid rgba(129,140,248,0.4)",
                          color: "white",
                        }}
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      mt: 4,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      fontSize: "0.875rem",
                      opacity: 0.9,
                    }}
                  >
                    <Typography>
                      • Accounts map to attendees, bookings, and payments in the
                      system.
                    </Typography>
                    <Typography>
                      • Use the same email to keep your tickets and attendance
                      history in one place.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {/* Right side - auth card */}
            <Grid item xs={12} md={6}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    width: "100%",
                    p: { xs: 3, md: 4 },
                    backgroundColor: "background.paper",
                    borderRadius: 3,
                    boxShadow: "0 24px 60px rgba(15,23,42,0.25)",
                    border: "1px solid",
                    borderColor: alpha("#000", 0.06),
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {isRegister ? "Create account" : "Sign in"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {isRegister
                          ? "Join Nairobi's tech community in a few steps."
                          : "Access your events, tickets, and more."}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => navigate("/")}
                      sx={{
                        color: "text.secondary",
                        "&:hover": {
                          backgroundColor: alpha("#2563EB", 0.06),
                        },
                      }}
                    >
                      <ArrowBack fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      mb: 3,
                      gap: 1,
                      backgroundColor: alpha("#CBD5F5", 0.2),
                      borderRadius: 999,
                      p: 0.5,
                    }}
                  >
                    <Button
                      fullWidth
                      size="small"
                      variant={isRegister ? "text" : "contained"}
                      onClick={() => setMode("login")}
                      sx={{
                        borderRadius: 999,
                        boxShadow: isRegister ? "none" : undefined,
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      fullWidth
                      size="small"
                      variant={isRegister ? "contained" : "text"}
                      onClick={() => setMode("register")}
                      sx={{
                        borderRadius: 999,
                        boxShadow: isRegister ? undefined : "none",
                      }}
                    >
                      Register
                    </Button>
                  </Box>

                  {error && (
                    <Alert
                      severity="error"
                      sx={{ mb: 2 }}
                      onClose={() => setError(null)}
                    >
                      {error}
                    </Alert>
                  )}
                  {success && (
                    <Alert
                      severity="success"
                      sx={{ mb: 2 }}
                      onClose={() => setSuccess(null)}
                    >
                      {success}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit} noValidate>
                    {isRegister && (
                      <Grid container spacing={2} sx={{ mb: 1 }}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="First name"
                            value={formData.first_name}
                            onChange={handleChange("first_name")}
                            margin="normal"
                            error={!!formErrors.first_name}
                            helperText={formErrors.first_name}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Person fontSize="small" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Last name"
                            value={formData.last_name}
                            onChange={handleChange("last_name")}
                            margin="normal"
                            error={!!formErrors.last_name}
                            helperText={formErrors.last_name}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Person fontSize="small" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>
                    )}

                    <TextField
                      fullWidth
                      label="Username"
                      value={formData.username}
                      onChange={handleChange("username")}
                      margin="normal"
                      error={!!formErrors.username}
                      helperText={
                        formErrors.username ||
                        (isRegister
                          ? "This will be used to identify you in events."
                          : "")
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    {isRegister && (
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange("email")}
                        margin="normal"
                        error={!!formErrors.email}
                        helperText={
                          formErrors.email ||
                          "We'll send tickets and confirmations here."
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}

                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange("password")}
                      margin="normal"
                      error={!!formErrors.password}
                      helperText={formErrors.password}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() =>
                                setShowPassword((prev) => !prev)
                              }
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff fontSize="small" />
                              ) : (
                                <Visibility fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    {isRegister && (
                      <>
                        <TextField
                          fullWidth
                          label="Confirm password"
                          type={showPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleChange("confirmPassword")}
                          margin="normal"
                          error={!!formErrors.confirmPassword}
                          helperText={formErrors.confirmPassword}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock fontSize="small" />
                              </InputAdornment>
                            ),
                          }}
                        />

                        <Box sx={{ mt: 1.5, mb: 2 }}>
                          <Box
                            sx={{
                              height: 6,
                              borderRadius: 999,
                              backgroundColor: "grey.200",
                              overflow: "hidden",
                              mb: 0.5,
                            }}
                          >
                            <Box
                              sx={{
                                height: "100%",
                                width: `${passwordStrength.value}%`,
                                backgroundColor: passwordStrength.color,
                              }}
                            />
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            Password strength: {passwordStrength.label}
                          </Typography>
                        </Box>
                      </>
                    )}

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      endIcon={
                        loading ? null : isRegister ? (
                          <ArrowForward />
                        ) : (
                          <Event />
                        )
                      }
                      sx={{
                        mt: 2,
                        mb: 1,
                        py: 1.4,
                        background:
                          "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #1D4ED8 0%, #5B21B6 100%)",
                        },
                      }}
                    >
                      {loading ? (
                        <CircularProgress
                          size={22}
                          sx={{ color: "white" }}
                        />
                      ) : isRegister ? (
                        "Create account"
                      ) : (
                        "Login"
                      )}
                    </Button>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textAlign: "center", mt: 1.5 }}
                    >
                      {isRegister ? "Already have an account? " : "New here? "}
                      <Button
                        size="small"
                        onClick={() =>
                          setMode(isRegister ? "login" : "register")
                        }
                        sx={{ fontSize: "0.875rem", ml: 0.5 }}
                      >
                        {isRegister ? "Login" : "Create an account"}
                      </Button>
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AuthPage;



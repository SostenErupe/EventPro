import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// Import all your components
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Authentication from "./pages/Authentication";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import Venues from "./pages/Venues";
import ActivityLog from "./pages/Activity_Log";
import Tickets from "./pages/Tickets";
import UserDashboard from "./pages/UserDashboard";
import TicketBooking from "./pages/TicketBooking";
import UserPayments from "./pages/UserPayments";
import PaymentVerification from "./pages/PaymentVerification";
import PaymentPage from "./pages/PaymentsPage";
import Participants from "./pages/Participants";
import ParticipantDetails from "./pages/ParticipantDetails";

// ProtectedRoute supports both `element` prop and `children`
const ProtectedRoute = ({ element, children, requiredRole }) => {
  const { user, authIsReady } = useAuthContext();

  console.log('ProtectedRoute - authIsReady:', authIsReady, 'user:', user);

  if (!authIsReady) {
    return <div>Loading authentication...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && Number(user.role) !== requiredRole) {
    console.log('Role mismatch. User role:', user.role, 'Required role:', requiredRole);
    return <Navigate to={Number(user.role) === 1 ? "/admin_dashboard" : "/user_dashboard"} replace />;
  }

  // Prefer explicit `element` prop; fall back to `children`
  return element ? element : children ? children : null;
};

function App() {
  const { user, authIsReady } = useAuthContext();
  
  console.log('App - authIsReady:', authIsReady, 'user:', user);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            !user ? <Login /> : 
            Number(user.role) === 1 ? <Navigate to="/admin_dashboard" replace /> : 
            <Navigate to="/user_dashboard" replace />
          } />
          <Route path="/signup" element={
            !user ? <Signup /> : 
            Number(user.role) === 1 ? <Navigate to="/admin_dashboard" replace /> : 
            <Navigate to="/user_dashboard" replace />
          } />
          <Route path="/authentication" element={<Authentication />} />
          
          {/* FIXED: Admin-only routes - use element prop pattern */}
          <Route path="/admin_dashboard" element={
            <ProtectedRoute 
              requiredRole={1} 
              element={<Dashboard />} 
            />
          } />
          <Route path="/logs" element={
            <ProtectedRoute 
              requiredRole={1} 
              element={<ActivityLog />} 
            />
          } />
          <Route path="/payment_verification" element={
            <ProtectedRoute 
              requiredRole={1} 
              element={<PaymentVerification />} 
            />
          } />
          
          {/* FIXED: User-only routes - use element prop pattern */}
          <Route path="/user_dashboard" element={
            <ProtectedRoute 
              requiredRole={2} 
              element={<UserDashboard />} 
            />
          } />
          
          {/* FIXED: Shared authenticated routes */}
          <Route path="/events" element={
            <ProtectedRoute element={<Events />} />
          } />
          <Route path="/participants" element={
            <ProtectedRoute>
              <Participants />
            </ProtectedRoute>
          } />
          <Route path="/participant/:ticketId" element={
            <ProtectedRoute>
              <ParticipantDetails />
            </ProtectedRoute>
          } />
          <Route path="/venues" element={
            <ProtectedRoute element={<Venues />} />
          } />
          <Route path="/tickets" element={
            <ProtectedRoute element={<Tickets />} />
          } />
          <Route path="/purchase_tickets" element={
            <ProtectedRoute element={<TicketBooking />} />
          } />
          <Route path="/user_payments" element={
            <ProtectedRoute element={<UserPayments />} />
          } />
          <Route path="/payment/:eventId" element={
            <ProtectedRoute element={<PaymentPage />} />
          } />
          <Route path="/profile" element={
            <ProtectedRoute element={<Profile />} />
          } />
          
          {/* Root route redirect */}
          <Route path="/" element={
            !authIsReady ? <div>Loading...</div> :
            user ? (
              Number(user.role) === 1 ? (
                <Navigate to="/admin_dashboard" replace />
              ) : (
                <Navigate to="/user_dashboard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
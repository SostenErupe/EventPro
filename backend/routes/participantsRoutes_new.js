// backend/routes/participantsRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllParticipants,
  getParticipantsByEvent,
  getParticipantByTicketId,
  getParticipantsByUser,
  getVerifiedParticipants,
  getAttendanceStats,
  searchParticipants,
  exportParticipants,
  getEventList,
  getVerificationResults,
  getAllAttendees,
  getRecentActivities
} = require('../controllers/participantsController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes for dashboard
router.get('/verification/results', getVerificationResults);
router.get('/get-all-attendees', getAllAttendees);

// Activities route (no auth required for dashboard)
// NOTE: This is mounted under /api/activities in server.js

// All routes require authentication
router.use(protect);

// Admin only routes
// NOTE: removed `adminOnly` from '/' to allow authenticated users to fetch participants (temporary)
router.get('/', getAllParticipants);
router.get('/stats', adminOnly, getAttendanceStats);
router.get('/verified', adminOnly, getVerifiedParticipants);
router.get('/search', adminOnly, searchParticipants);
router.get('/export', adminOnly, exportParticipants);
router.get('/events', adminOnly, getEventList);
router.get('/event/:eventId', adminOnly, getParticipantsByEvent);
// allow owner or admin to fetch ticket details; controller enforces ownership
router.get('/ticket/:ticketId', getParticipantByTicketId);

// User route - can view their own participation
router.get('/user/:userId', getParticipantsByUser);

module.exports = router;

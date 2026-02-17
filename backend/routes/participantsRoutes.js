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
  getAllAttendees,
  getEventList
} = require('../controllers/participantsController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Admin only routes
router.get('/stats', adminOnly, getAttendanceStats);
router.get('/verified', adminOnly, getVerifiedParticipants);
router.get('/search', adminOnly, searchParticipants);
router.get('/export', adminOnly, exportParticipants);
router.get('/event/:eventId', adminOnly, getParticipantsByEvent);
router.get('/events', adminOnly, getEventList);

// Dashboard route
router.get('/get-all-attendees', getAllAttendees);

// General routes (allow authenticated users)
router.get('/', getAllParticipants);
// allow owner or admin to fetch ticket details; controller enforces ownership
router.get('/ticket/:ticketId', getParticipantByTicketId);

// User route - can view their own participation
router.get('/user/:userId', getParticipantsByUser);

module.exports = router;
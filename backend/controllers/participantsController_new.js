// backend/controllers/participantsController.js
const Participant = require('../models/partcipants');

// @desc    Get all participants
// @route   GET /api/participants
// @access  Private/Admin
exports.getAllParticipants = async (req, res) => {
  try {
    const participants = await Participant.getAllParticipants();
    
    res.status(200).json({
      success: true,
      count: participants.length,
      data: participants
    });
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch participants',
      error: error.message
    });
  }
};

// @desc    Get participants by event
// @route   GET /api/participants/event/:eventId
// @access  Private/Admin
exports.getParticipantsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const participants = await Participant.getParticipantsByEvent(eventId);
    
    res.status(200).json({
      success: true,
      count: participants.length,
      data: participants
    });
  } catch (error) {
    console.error('Error fetching participants by event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch participants',
      error: error.message
    });
  }
};

// @desc    Get participant by ticket ID
// @route   GET /api/participants/ticket/:ticketId
// @access  Private/Admin
exports.getParticipantByTicketId = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const participant = await Participant.getParticipantByTicketId(ticketId);
    
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }
    
    // Authorization: allow admins or the owner of the ticket
    const requester = req.user || {};
    const isAdmin = Number(requester.role) === 1;
    const isOwner = requester.userId && Number(requester.userId) === Number(participant.User_ID);
    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Not allowed to view this participant.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: participant
    });
  } catch (error) {
    console.error('Error fetching participant:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch participant',
      error: error.message
    });
  }
};

// @desc    Get participants by user ID
// @route   GET /api/participants/user/:userId
// @access  Private
exports.getParticipantsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const participants = await Participant.getParticipantsByUser(userId);
    
    res.status(200).json({
      success: true,
      count: participants.length,
      data: participants
    });
  } catch (error) {
    console.error('Error fetching user participants:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch participants',
      error: error.message
    });
  }
};

// @desc    Get verified participants
// @route   GET /api/participants/verified
// @access  Private/Admin
exports.getVerifiedParticipants = async (req, res) => {
  try {
    const participants = await Participant.getVerifiedParticipants();
    
    res.status(200).json({
      success: true,
      count: participants.length,
      data: participants
    });
  } catch (error) {
    console.error('Error fetching verified participants:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch verified participants',
      error: error.message
    });
  }
};

// @desc    Get attendance statistics
// @route   GET /api/participants/stats
// @access  Private/Admin
exports.getAttendanceStats = async (req, res) => {
  try {
    const stats = await Participant.getAttendanceStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching attendance stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

// @desc    Search participants
// @route   GET /api/participants/search
// @access  Private/Admin
exports.searchParticipants = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const participants = await Participant.searchParticipants(q);
    
    res.status(200).json({
      success: true,
      count: participants.length,
      data: participants
    });
  } catch (error) {
    console.error('Error searching participants:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search participants',
      error: error.message
    });
  }
};

// @desc    Get event list for filter
// @route   GET /api/participants/events
// @access  Private/Admin
exports.getEventList = async (req, res) => {
  try {
    const events = await Participant.getEventList();
    
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Error fetching event list:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message
    });
  }
};

// @desc    Export participants to CSV
// @route   GET /api/participants/export
// @access  Private/Admin
exports.exportParticipants = async (req, res) => {
  try {
    const participants = await Participant.getAllParticipants();
    
    // Create CSV header
    const csvHeader = [
      'Ticket ID',
      'Participant Name',
      'Email',
      'Contact',
      'Event Name',
      'Event Date',
      'Quantity',
      'Total Price (Ksh)',
      'Purchase Date',
      'Payment Status',
      'Verification Status',
      'Venue',
      'City'
    ].join(',');
    
    // Create CSV rows
    const csvRows = participants.map(p => [
      p.Ticket_ID,
      `"${p.user_name || ''}"`,
      p.Email || '',
      `"${p.ContactInfo || ''}"`,
      `"${p.Event_Name || ''}"`,
      p.Event_Date || '',
      p.Quantity || 0,
      p.Total_Price || 0,
      p.Purchase_Date || '',
      p.Payment_Status || 'N/A',
      p.Verification_Status || 'N/A',
      `"${p.Venue_Name || ''}"`,
      p.City || ''
    ].join(','));
    
    const csv = [csvHeader, ...csvRows].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=participants.csv');
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting participants:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export participants',
      error: error.message
    });
  }
};

// @desc    Get verification results (total, verified, pending)
// @route   GET /api/verification/results
// @access  Private/Admin
exports.getVerificationResults = async (req, res) => {
  try {
    const stats = await Participant.getAttendanceStats();
    
    res.status(200).json({
      success: true,
      totalCount: stats.total_participants || 0,
      verifiedCount: stats.verified_participants || 0,
      pending: stats.pending_verification || 0
    });
  } catch (error) {
    console.error('Error fetching verification results:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch verification results',
      error: error.message
    });
  }
};

// @desc    Get all attendees
// @route   GET /api/participants/get-all-attendees
// @access  Private/Admin
exports.getAllAttendees = async (req, res) => {
  try {
    const participants = await Participant.getAllParticipants();
    
    res.status(200).json({
      success: true,
      count: participants.length,
      data: participants
    });
  } catch (error) {
    console.error('Error fetching attendees:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendees',
      error: error.message
    });
  }
};

// @desc    Get recent activities
// @route   GET /api/activities/recent
// @access  Private/Admin
exports.getRecentActivities = async (req, res) => {
  try {
    // Return recent ticket purchases as activities
    const participants = await Participant.getAllParticipants();
    
    const activities = participants.slice(0, 10).map(p => ({
      action: `Ticket purchased for ${p.Event_Name}`,
      user: p.user_name,
      timestamp: p.Purchase_Date,
      ticketId: p.Ticket_ID
    }));
    
    res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activities',
      error: error.message
    });
  }
};

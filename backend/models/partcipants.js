// backend/models/Participant.js
const db = require('../db');

const Participant = {
  // Get all participants with their event and payment details
  getAllParticipants: async () => {
    const query = `
      SELECT 
        u.User_ID,
        u.Name AS user_name,
        u.Email,
        u.ContactInfo,
        t.Ticket_ID,
        t.Quantity,
        t.Total_Price,
        t.Purchase_Date,
        t.Status AS ticket_status,
        e.Event_ID,
        e.Event_Name,
        e.Event_Date,
        e.Event_Start_Time,
        e.Event_End_Time,
        v.Venue_Name,
        v.City,
        p.Payment_ID,
        p.Payment_Method,
        p.Payment_Status,
        p.Verification_Status,
        p.Verification_Date
      FROM users u
      JOIN tickets t ON u.User_ID = t.User_ID
      JOIN events e ON t.Event_ID = e.Event_ID
      JOIN venues v ON e.Venue_ID = v.Venue_ID
      LEFT JOIN bookingdetails bd ON t.Ticket_ID = bd.Ticket_ID
      LEFT JOIN payments p ON bd.Booking_ID = p.Booking_ID
      WHERE t.Status != 'Cancelled'
      ORDER BY t.Purchase_Date DESC
    `;
    
    const [rows] = await db.executeAsync(query);
    return rows;
  },

  // Get participants by event ID
  getParticipantsByEvent: async (eventId) => {
    const query = `
      SELECT 
        u.User_ID,
        u.Name AS user_name,
        u.Email,
        u.ContactInfo,
        t.Ticket_ID,
        t.Quantity,
        t.Total_Price,
        t.Purchase_Date,
        t.Status AS ticket_status,
        e.Event_ID,
        e.Event_Name,
        e.Event_Date,
        e.Event_Start_Time,
        e.Event_End_Time,
        v.Venue_Name,
        v.City,
        p.Payment_ID,
        p.Payment_Method,
        p.Payment_Status,
        p.Verification_Status
      FROM users u
      JOIN tickets t ON u.User_ID = t.User_ID
      JOIN events e ON t.Event_ID = e.Event_ID
      JOIN venues v ON e.Venue_ID = v.Venue_ID
      LEFT JOIN bookingdetails bd ON t.Ticket_ID = bd.Ticket_ID
      LEFT JOIN payments p ON bd.Booking_ID = p.Booking_ID
      WHERE t.Event_ID = ? AND t.Status != 'Cancelled'
      ORDER BY t.Purchase_Date DESC
    `;
    
    const [rows] = await db.executeAsync(query, [eventId]);
    return rows;
  },

  // Get participant by ticket ID
  getParticipantByTicketId: async (ticketId) => {
    const query = `
      SELECT 
        u.User_ID,
        u.Name,
        u.Username,
        u.Email,
        u.ContactInfo,
        t.Ticket_ID,
        t.Quantity,
        t.Total_Price,
        t.Purchase_Date,
        t.Status AS ticket_status,
        e.Event_ID,
        e.Event_Name,
        e.Event_Date,
        e.Event_Start_Time,
        e.Event_End_Time,
        e.Ticket_Price,
        v.Venue_Name,
        v.City,
        v.Street,
        p.Payment_ID,
        p.Payment_Method,
        p.Amount,
        p.Payment_Status,
        p.Verification_Status,
        p.Verification_Date,
        p.Verification_Notes
      FROM users u
      JOIN tickets t ON u.User_ID = t.User_ID
      JOIN events e ON t.Event_ID = e.Event_ID
      JOIN venues v ON e.Venue_ID = v.Venue_ID
      LEFT JOIN bookingdetails bd ON t.Ticket_ID = bd.Ticket_ID
      LEFT JOIN payments p ON bd.Booking_ID = p.Booking_ID
      WHERE t.Ticket_ID = ?
    `;
    
    const [rows] = await db.executeAsync(query, [ticketId]);
    return rows[0];
  },

  // Get participants by user ID
  getParticipantsByUser: async (userId) => {
    const query = `
      SELECT 
        t.Ticket_ID,
        t.Quantity,
        t.Total_Price,
        t.Purchase_Date,
        t.Status AS ticket_status,
        e.Event_ID,
        e.Event_Name,
        e.Event_Date,
        e.Event_Start_Time,
        e.Event_End_Time,
        v.Venue_Name,
        v.City,
        p.Payment_ID,
        p.Payment_Status,
        p.Verification_Status
      FROM tickets t
      JOIN events e ON t.Event_ID = e.Event_ID
      JOIN venues v ON e.Venue_ID = v.Venue_ID
      LEFT JOIN bookingdetails bd ON t.Ticket_ID = bd.Ticket_ID
      LEFT JOIN payments p ON bd.Booking_ID = p.Booking_ID
      WHERE t.User_ID = ? AND t.Status != 'Cancelled'
      ORDER BY t.Purchase_Date DESC
    `;
    
    const [rows] = await db.executeAsync(query, [userId]);
    return rows;
  },

  // Get participants with verified payments
  getVerifiedParticipants: async () => {
    const query = `
      SELECT 
        u.User_ID,
        u.Name,
        u.Email,
        u.ContactInfo,
        t.Ticket_ID,
        t.Quantity,
        e.Event_Name,
        e.Event_Date,
        p.Verification_Date
      FROM users u
      JOIN tickets t ON u.User_ID = t.User_ID
      JOIN events e ON t.Event_ID = e.Event_ID
      LEFT JOIN bookingdetails bd ON t.Ticket_ID = bd.Ticket_ID
      LEFT JOIN payments p ON bd.Booking_ID = p.Booking_ID
      WHERE p.Verification_Status = 'Verified'
      AND t.Status != 'Cancelled'
      ORDER BY p.Verification_Date DESC
    `;
    
    const [rows] = await db.executeAsync(query);
    return rows;
  },

  // Get attendance statistics
  getAttendanceStats: async () => {
    const query = `
      SELECT 
        COUNT(DISTINCT t.User_ID) AS total_participants,
        COUNT(DISTINCT t.Ticket_ID) AS total_tickets_sold,
        COALESCE(SUM(t.Quantity), 0) AS total_tickets_count,
        COALESCE(SUM(t.Total_Price), 0) AS total_revenue,
        COUNT(DISTINCT CASE WHEN p.Verification_Status = 'Verified' THEN t.User_ID END) AS verified_participants,
        COUNT(DISTINCT CASE WHEN p.Verification_Status = 'Pending' THEN t.User_ID END) AS pending_verification
      FROM tickets t
      LEFT JOIN bookingdetails bd ON t.Ticket_ID = bd.Ticket_ID
      LEFT JOIN payments p ON bd.Booking_ID = p.Booking_ID
      WHERE t.Status != 'Cancelled'
    `;
    
    const [rows] = await db.executeAsync(query);
    return rows[0];
  },

  // Search participants
  searchParticipants: async (searchTerm) => {
    const query = `
      SELECT 
        u.User_ID,
        u.Name AS user_name,
        u.Email,
        u.ContactInfo,
        t.Ticket_ID,
        t.Quantity,
        t.Total_Price,
        t.Purchase_Date,
        e.Event_Name,
        e.Event_Date,
        p.Verification_Status
      FROM users u
      JOIN tickets t ON u.User_ID = t.User_ID
      JOIN events e ON t.Event_ID = e.Event_ID
      LEFT JOIN bookingdetails bd ON t.Ticket_ID = bd.Ticket_ID
      LEFT JOIN payments p ON bd.Booking_ID = p.Booking_ID
      WHERE t.Status != 'Cancelled'
        AND (
          u.Name LIKE ? OR
          u.Email LIKE ? OR
          u.ContactInfo LIKE ? OR
          e.Event_Name LIKE ? OR
          t.Ticket_ID LIKE ?
        )
      ORDER BY t.Purchase_Date DESC
    `;
    
    const searchPattern = `%${searchTerm}%`;
    const [rows] = await db.executeAsync(query, [
      searchPattern, 
      searchPattern, 
      searchPattern, 
      searchPattern, 
      searchPattern
    ]);
    return rows;
  },

  // Get event list for filter dropdown
  getEventList: async () => {
    const query = `
      SELECT Event_ID, Event_Name 
      FROM events 
      ORDER BY Event_Date DESC
    `;
    const [rows] = await db.executeAsync(query);
    return rows;
  }
};

module.exports = Participant;
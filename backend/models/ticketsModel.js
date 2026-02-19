const db = require('../db');

module.exports = {
  // Create a new booking
  createBooking: (userID, eventID, callback) => {
    const query = "INSERT INTO Bookings (User_ID, Event_ID, Booking_Date) VALUES (?, ?, CURDATE())";
    db.query(query, [userID, eventID], callback);
  },

  createTickets: (userID, eventID, quantity, callback) => {
    const ticketPriceQuery = "SELECT Ticket_Price FROM Events WHERE Event_ID = ?";
    db.query(ticketPriceQuery, [eventID], (err, results) => {
      if (err) return callback(err);
      
      const ticketPrice = results[0]?.Ticket_Price || 0;
      const totalPrice = ticketPrice * quantity;
      
      const query = "INSERT INTO Tickets (Event_ID, User_ID, Quantity, Total_Price, Status) VALUES (?, ?, ?, ?, ?)";
      db.query(query, [eventID, userID, quantity, totalPrice, 'Pending'], callback);
    });
  },
  // Create booking details
  createBookingDetails: (bookingID, ticketID, callback) => {
    const query = "INSERT INTO BookingDetails (Booking_ID, Ticket_ID) VALUES (?, ?)";
    db.query(query, [bookingID, ticketID], callback);
  },

  // Update available tickets
  updateAvailableTickets: (eventID, quantity, callback) => {
    const query = "UPDATE Events SET Available_Tickets = Available_Tickets - ? WHERE Event_ID = ?";
    db.query(query, [quantity, eventID], callback);
  },

  // Create payment record
  createPayment: (bookingID, paymentMethod, amount, callback) => {
    const query = `
      INSERT INTO Payments (
        Booking_ID, 
        Payment_Method, 
        Amount, 
        Payment_Status,
        Verification_Status,
        Payment_Date
      ) VALUES (?, ?, ?, 'Success', 'Pending', NOW())
    `;
    db.query(query, [bookingID, paymentMethod, amount], callback);
  },
  // Get user tickets with all related information
  getUserTickets: (userId, callback) => {
    const query = `
      SELECT
        t.Ticket_ID,
        e.Event_Name,
        e.Event_Date,
        e.Event_Start_Time,
        e.Event_End_Time,
        v.Venue_Name,
        t.Quantity,
        t.Total_Price,
        t.Status,
        p.Payment_Method,
        p.Payment_Status,
        p.Verification_Status,
        b.Booking_Date AS Purchase_Date
      FROM Tickets t
      JOIN Users u ON t.User_ID = u.User_ID  -- Explicit user join
      JOIN Bookings b ON t.User_ID = b.User_ID AND t.Event_ID = b.Event_ID
      JOIN Events e ON t.Event_ID = e.Event_ID
      JOIN Venues v ON e.Venue_ID = v.Venue_ID
      LEFT JOIN Payments p ON b.Booking_ID = p.Booking_ID
      WHERE t.User_ID = ?  -- Ensure filtering by the requested user
      ORDER BY b.Booking_Date DESC
    `;
    
    db.query(query, [userId], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },
  // Cancel a ticket and process refund
  cancelTicket: (ticketId, callback) => {
    // Start by getting the ticket details
    const ticketQuery = "SELECT Event_ID, Quantity FROM Tickets WHERE Ticket_ID = ?";
    
    db.query(ticketQuery, [ticketId], (err, ticketResults) => {
      if (err) return callback(err);
      if (!ticketResults || ticketResults.length === 0) {
        return callback(new Error("Ticket not found"));
      }

      const eventId = ticketResults[0].Event_ID;
      const quantity = ticketResults[0].Quantity;

      // Get the booking ID and payment ID for this ticket
      const bookingQuery = `
        SELECT b.Booking_ID, p.Payment_ID, p.Booking_ID as PaymentBookingID
        FROM Bookings b
        JOIN Tickets t ON t.User_ID = b.User_ID AND t.Event_ID = b.Event_ID
        LEFT JOIN Payments p ON p.Booking_ID = b.Booking_ID
        WHERE t.Ticket_ID = ?
        LIMIT 1
      `;

      db.query(bookingQuery, [ticketId], (err, bookingResults) => {
        if (err) return callback(err);
        
        const bookingId = bookingResults[0]?.Booking_ID;
        const paymentId = bookingResults[0]?.Payment_ID;

        // Update ticket status to Cancelled
        const updateTicketQuery = "UPDATE Tickets SET Status = 'Cancelled' WHERE Ticket_ID = ?";
        
        db.query(updateTicketQuery, [ticketId], (err) => {
          if (err) return callback(err);

          // Update payment status to Refunded
          if (paymentId) {
            const updatePaymentQuery = `
              UPDATE Payments 
              SET Payment_Status = 'Refunded', Verification_Status = 'Pending'
              WHERE Payment_ID = ?
            `;
            
            db.query(updatePaymentQuery, [paymentId], (err) => {
              if (err) return callback(err);

              // Restore available tickets
              const restoreTicketsQuery = "UPDATE Events SET Available_Tickets = Available_Tickets + ? WHERE Event_ID = ?";
              
              db.query(restoreTicketsQuery, [quantity, eventId], (err) => {
                if (err) return callback(err);
                callback(null, { success: true, ticketId, paymentId });
              });
            });
          } else {
            // No payment found, just restore available tickets
            const restoreTicketsQuery = "UPDATE Events SET Available_Tickets = Available_Tickets + ? WHERE Event_ID = ?";
            
            db.query(restoreTicketsQuery, [quantity, eventId], (err) => {
              if (err) return callback(err);
              callback(null, { success: true, ticketId });
            });
          }
        });
      });
    });
  },

  // Get statistics for admin dashboard
  getStatistics: (callback) => {
    const queries = {
      ticketStats: "SELECT COUNT(*) as totalTicketsSold FROM Tickets",
      revenueStats: "SELECT SUM(Amount) as totalRevenue FROM Payments WHERE Verification_Status = 'Verified'",
      eventStats: `
        SELECT 
          e.Event_ID, 
          e.Event_Name, 
          COUNT(t.Ticket_ID) as ticketsSold,
          SUM(p.Amount) as revenue
        FROM Events e
        LEFT JOIN Tickets t ON e.Event_ID = t.Event_ID
        LEFT JOIN Bookings b ON t.User_ID = b.User_ID
        LEFT JOIN Payments p ON b.Booking_ID = p.Booking_ID
        WHERE p.Verification_Status = 'Verified' OR p.Verification_Status IS NULL
        GROUP BY e.Event_ID
      `
    };

    db.query(queries.ticketStats, (err1, ticketStats) => {
      if (err1) return callback(err1);
      
      db.query(queries.revenueStats, (err2, revenueStats) => {
        if (err2) return callback(err2);
        
        db.query(queries.eventStats, (err3, eventStats) => {
          if (err3) return callback(err3);
          
          callback(null, {
            totalTickets: ticketStats[0].totalTicketsSold,
            totalRevenue: revenueStats[0].totalRevenue || 0,
            events: eventStats
          });
        });
      });
    });
  }
};
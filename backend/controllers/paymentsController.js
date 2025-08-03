// controllers/paymentsController.js
const paymentsModel = require("../models/paymentsModel");

module.exports = {
  getAllPayments: (req, res) => {
    paymentsModel.getAllPayments((err, result) => {
      if (err) {
        console.error("Error fetching payments:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(result);
      }
    });
  },

  getPaymentDetails: (req, res) => {
    const { paymentId } = req.params;

    paymentsModel.getPaymentDetails(paymentId, (err, result) => {
      if (err) {
        console.error("Error fetching payment details:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(result[0]);
      }
    });
  },
verifyPayment: (req, res) => {
    const { paymentId } = req.params;
    const { status, notes, adminId } = req.body; // Now getting adminId from request body

    // Basic validation
    if (!paymentId || isNaN(paymentId)) {
      return res.status(400).json({ error: "Invalid payment ID" });
    }

    if (!status || !['Verified', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: "Invalid verification status" });
    }

    if (!adminId) {
      return res.status(400).json({ error: "Admin ID is required" });
    }

    paymentsModel.verifyPayment(
      paymentId,
      status,
      adminId,
      notes || null,
      (err, result) => {
        if (err) {
          console.error("Error verifying payment:", err);
          return res.status(500).json({ error: "Failed to verify payment" });
        }
        
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Payment not found" });
        }
        
        res.status(200).json({ 
          message: "Payment verification updated",
          paymentId,
          status
        });
      }
    );
  },
  refundPayment: (req, res) => {
    const { paymentId } = req.params;

    paymentsModel.refundPayment(paymentId, (err, result) => {
      if (err) {
        console.error("Error refunding payment:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json({ message: "Payment refunded successfully" });
      }
    });
  }
};
// routes/payments.js
const express = require('express');
const paymentsController = require('../controllers/paymentsController');

const router = express.Router();

router.get('/getPayments', paymentsController.getAllPayments);
router.get('/getPayment/:paymentId', paymentsController.getPaymentDetails);
router.post('/refundPayment/:paymentId', paymentsController.refundPayment);
router.put('/verifyPayment/:paymentId', paymentsController.verifyPayment);

module.exports = router;
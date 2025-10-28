import { Router } from 'express';
import Razorpay from 'razorpay';
import { body, validationResult } from 'express-validator';
import { requireAuth } from '../middleware/auth';
import Payment from '../models/Payment';

const router = Router();

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Create an order for a donation payment
router.post('/create-order', requireAuth,
  body('amount').isInt({ gt: 0 }),
  body('method').isIn(['UPI', 'CARD', 'NETBANKING']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { amount, method, ngoId } = req.body;
    const order = await rzp.orders.create({ amount, currency: 'INR' });
    const payment = await Payment.create({
      donor: req.user!.id,
      ngo: ngoId,
      amount,
      currency: 'INR',
      method,
      provider: 'RAZORPAY',
      providerOrderId: order.id,
      status: 'CREATED',
    });
    res.json({ orderId: order.id, key: process.env.RAZORPAY_KEY_ID, paymentId: payment.id });
  }
);

// Verify/callback (client sends providerPaymentId + signature checked client-side in test flows)
router.post('/confirm', requireAuth, body('providerPaymentId').notEmpty(), body('providerOrderId').notEmpty(), async (req, res) => {
  const { providerPaymentId, providerOrderId, success, metadata } = req.body;
  const payment = await Payment.findOneAndUpdate(
    { providerOrderId },
    { providerPaymentId, status: success ? 'PAID' : 'FAILED', metadata },
    { new: true }
  );
  res.json(payment);
});

export default router;

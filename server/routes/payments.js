const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Camp = require('../models/camp');
const auth = require('../middleware/auth');

// Create payment intent
const createPayment = async (req, res) => {
  try {
    const { campId, amount } = req.body;

    if (!campId || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const camp = await Camp.findById(campId);
    if (!camp) {
      return res.status(404).json({ error: 'Camp not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      metadata: {
        campId: campId,
        userId: req.user.id
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Webhook handler
const handleWebhook = (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('PaymentIntent was successful!');
      break;
    case 'payment_method.attached':
      console.log('PaymentMethod was attached to a Customer!');
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
};

// Register routes
router.post('/create', auth, createPayment);
router.post('/webhook', express.raw({type: 'application/json'}), handleWebhook);

module.exports = router; 
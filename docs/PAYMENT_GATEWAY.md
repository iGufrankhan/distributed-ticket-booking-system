# 💳 Payment Gateway Integration Guide

Complete documentation for the Razorpay payment gateway integration.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install razorpay bull
# razorpay - Payment gateway
# bull - Job queue for async processing
```

### 2. Configure Environment
Create/update `.env` file:
```env
# Razorpay Credentials
RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_secret_key_here

# Redis Connection
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USERNAME=default
REDIS_PASSWORD=your_password

# Payment Settings
MIN_BOOKING_AMOUNT=100           # ₹1 in paise
MAX_BOOKING_AMOUNT=1000000       # ₹10,000 in paise
```

### 3. Get Razorpay Credentials
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Navigate to **Settings → API Keys**
3. Copy **Key ID** and **Key Secret**
4. Use **Test Keys** for development, **Live Keys** for production

### 4. Test Integration
```bash
npm start
# Check console for: "✅ Payment workers registered"
```

---

## 🏗️ Architecture

### Component Breakdown

```
┌─────────────────────────────────────────────────────┐
│                 CLIENT (Browser)                     │
├─────────────────────────────────────────────────────┤
│  Step 1: Send booking request with payment details  │
│  Step 2: Receive order_id from server               │
│  Step 3: Open Razorpay payment modal                │
│  Step 4: User completes payment                     │
│  Step 5: Send signature to server for verification  │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│              BACKEND (Node.js/Express)              │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Routes (→ payment-routes.js)                        │
│  ├─ POST /create-order        ◄── Server endpoint  │
│  ├─ POST /generate-options                          │
│  ├─ POST /verify-signature    ◄── Signature check  │
│  ├─ GET /details/:paymentId                         │
│  ├─ POST /refund                                    │
│  └─ POST /process             ◄── Testing endpoint │
│                                                      │
│  Controllers (→ payment-controllers.js)              │
│  ├─ Input validation with JOI                       │
│  ├─ Call service functions                          │
│  └─ Return formatted response                       │
│                                                      │
│  Services (→ payment-service.js)                     │
│  ├─ Razorpay initialization                         │
│  ├─ Order creation logic                            │
│  ├─ Signature verification (HMAC-SHA256)            │
│  ├─ Refund processing                               │
│  └─ Data sanitization                               │
│                                                      │
│  Validations (→ payment-validate.js)                 │
│  ├─ JOI schemas for each endpoint                   │
│  ├─ Amount validation (₹1-₹10,000)                  │
│  ├─ Payment method validation                       │
│  └─ Data sanitization rules                         │
│                                                      │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│           RAZORPAY (Payment Gateway)                │
├─────────────────────────────────────────────────────┤
│  ✓ Order creation & management                      │
│  ✓ Payment processing                               │
│  ✓ Signature generation                             │
│  ✓ Refund processing                                │
│  ✓ Webhook notifications                            │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│           DATABASE (MongoDB)                        │
├─────────────────────────────────────────────────────┤
│  Collections:                                        │
│  ├─ payments (order_id, payment_id, signature)      │
│  ├─ bookings (payment_status, booking_code)         │
│  └─ notifications (payment_success/refund)          │
└─────────────────────────────────────────────────────┘
```

---

## 📋 File Structure

```
src/
├── routes/
│   └── payment-gateway/
│       └── payment-routes.js          (6 RESTful routes)
├── controllers/
│   └── payment-gateway/
│       └── payment-controllers.js      (6 endpoint handlers)
├── services/
│   └── payment-gateway/
│       └── payment-service.js          (Business logic)
└── validations/
    └── payment/
        └── payment-validate.js         (JOI schemas + helpers)

utils/
├── ApiError.js                         (Error handler)
├── ApiResponse.js                      (Response formatter)
└── AsyncHandler.js                     (Error wrapper)
```

---

## 🔐 Security Implementation

### 1. Signature Verification (HMAC-SHA256)
```javascript
// How it works:
// Server creates order_id with SECRET
// Client pays via Razorpay
// Razorpay returns: order_id, payment_id, signature
// Server verifies: HMAC256(order_id|payment_id, SECRET) == signature

import crypto from 'crypto';

const verifySignature = (orderId, paymentId, signature, secret) => {
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  
  return hmac === signature;  // true = genuine payment
};
```

### 2. Data Sanitization
```javascript
// Before returning payment details to client:
const sanitizePaymentData = (data) => {
  const sanitized = { ...data };
  
  // Remove sensitive fields
  delete sanitized.key_secret;
  delete sanitized.cvv;
  delete sanitized.card_number;
  delete sanitized.token;
  
  return sanitized;  // Safe to send to frontend
};
```

### 3. JWT Authentication
```javascript
// All payment endpoints require valid JWT
POST /api/v1/payment/create-order
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Amount Validation
```javascript
// Prevent abuse and invalid amounts
- Minimum: ₹1 (100 paise)
- Maximum: ₹10,000 (1,000,000 paise)
- No decimals/floats allowed
- Type checking to prevent injections
```

---

## 🔄 Request/Response Flow

### Payment Creation Flow
```
CLIENT                          SERVER                      RAZORPAY
  │                               │                            │
  ├──────POST /create-order──────►│                            │
  │    {amount, currency,receipt}  │──────create order────────►│
  │                              │                            │
  │                              │◄──────return order_id──────┤
  │                              │                            │
  │◄─────orderId + payment opts──┤                            │
  │                              │                            │
  ├──────Open Razorpay Modal─────►[Payment Popup]            │
  │       (with order_id)          │                           │
  │                              │                            │
  │    [User enters card details]  │                           │
  │    [Completes payment]         │──────process payment────►│
  │                              │                            │
  │                              │◄──return order_id,          │
  │                              │   payment_id, signature─────┤
  │                              │                            │
  │◄─────signature returned───────┤   [(Client-side)]          │
  │                              │                            │
  ├──POST /verify-signature──────►│                            │
  │    {orderId, paymentId,sig}   │  [Verify HMAC-SHA256]    │
  │                              │                            │
  │                              │ [✓ Verified or ✗ Failed]  │
  │                              │                            │
  │◄────{ verified: true }────────┤                            │
  │                              │                            │
```

---

## 💡 Usage Examples

### Example 1: Complete Payment Flow (React)
```javascript
// Frontend - React component
import axios from 'axios';

const handlePayment = async () => {
  try {
    // Step 1: Create order
    const { data: orderData } = await axios.post(
      '/api/v1/payment/create-order',
      { amount: 5000, currency: 'INR', receipt: 'BOOKING_001' },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Step 2: Generate payment options
    const { data: paymentOptions } = await axios.post(
      '/api/v1/payment/generate-options',
      {
        orderId: orderData.id,
        amount: 5000,
        customerDetails: {
          name: 'John Doe',
          email: 'john@example.com',
          contact: '+919999999999'
        }
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Step 3: Open Razorpay payment modal
    const razorpay = new Razorpay({
      ...paymentOptions,
      handler: async (response) => {
        try {
          // Step 4: Verify signature
          const { data: verified } = await axios.post(
            '/api/v1/payment/verify-signature',
            {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (verified.verified) {
            alert('✓ Payment verified! Booking confirmed.');
            // Update booking status
          } else {
            alert('✗ Payment verification failed!');
          }
        } catch (error) {
          console.error('Verification error:', error);
        }
      },
      modal: { ondismiss: () => alert('Payment cancelled') }
    });

    razorpay.open();
  } catch (error) {
    console.error('Payment error:', error);
  }
};
```

### Example 2: Backend Order Creation
```javascript
// Backend - payment-service.js
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createPaymentOrder = async (amount, currency, receipt) => {
  // Validate amount
  if (amount < 100 || amount > 1000000) {
    throw new Error('Invalid amount: must be between ₹1 and ₹10,000');
  }

  // Create order with Razorpay
  const order = await razorpayInstance.orders.create({
    amount: amount, // in paise
    currency: currency || 'INR',
    receipt: receipt,
    notes: {
      project: 'TicketBooking',
      environment: process.env.NODE_ENV
    }
  });

  return order;
};
```

### Example 3: Signature Verification
```javascript
// Backend - verify payment
const verifyPaymentSignature = async (orderId, paymentId, signature) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  
  // Create HMAC from order and payment details
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  
  // Compare with provided signature
  const isValid = hmac === signature;
  
  if (!isValid) {
    throw new Error('Payment signature mismatch - potential fraud detected');
  }
  
  return { verified: true, message: 'Payment verified successfully' };
};
```

### Example 4: Refund Processing
```javascript
// Process refund for cancelled booking
const refundPayment = async (paymentId, amount = null) => {
  try {
    const refund = await razorpayInstance.payments.refund(paymentId, {
      amount: amount || null, // null = full refund
      notes: {
        reason: 'Booking cancelled by user',
        timestamp: new Date().toISOString()
      }
    });

    // Save refund to database
    await Payment.updateOne(
      { paymentId },
      {
        status: 'refunded',
        refundId: refund.id,
        refundedAt: new Date()
      }
    );

    return refund;
  } catch (error) {
    console.error('Refund failed:', error);
    throw new Error('Unable to process refund');
  }
};
```

---

## 🧪 Testing Payment Gateway

### 1. Test Card Numbers (Razorpay Sandbox)

| Card Type | Number | Expiry | CVV |
|-----------|--------|--------|-----|
| Visa | 4111 1111 1111 1111 | 12/25 | 123 |
| MasterCard | 5555 5555 5555 4444 | 12/25 | 123 |
| Amex | 3782 822463 10005 | 12/25 | 1234 |

### 2. Test Amount Rules
- **Less than ₹1:** Will fail validation
- **Between ₹1 to ₹10,000:** Will succeed
- **More than ₹10,000:** Will fail validation

### 3. Simulate Payment (Without Razorpay)
```bash
curl -X POST http://localhost:5000/api/v1/payment/process \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "method": "CARD"
  }'

# 90% success rate - mostly succeeds, occasionally fails for error testing
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Cannot find module razorpay"
```bash
# Solution: Install razorpay
npm install razorpay
```

### Issue 2: "RAZORPAY_KEY_ID not defined"
```bash
# Solution: Add to .env file
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
```

### Issue 3: "Signature verification failed"
```javascript
// Check:
1. order_id from POST /create-order response
2. payment_id & signature from Razorpay modal callback
3. Both match exactly (case-sensitive)
4. Server SECRET matches Razorpay account
```

### Issue 4: "Payment timeout"
```javascript
// Check:
1. RAZORPAY_KEY_ID and KEY_SECRET are valid
2. Network connection to Razorpay API
3. Amount is within allowed range
4. Server time is synced (for signature)
```

---

## 📊 Monitoring & Debugging

### Enable Detailed Logging
```javascript
// In payment-service.js
const createPaymentOrder = async (amount, currency, receipt) => {
  console.log('📝 Creating order:', { amount, currency, receipt });
  
  try {
    const order = await razorpayInstance.orders.create({...});
    console.log('✅ Order created:', order.id);
    return order;
  } catch (error) {
    console.error('❌ Order creation failed:', error.message);
    throw error;
  }
};
```

### Check Razorpay Dashboard
- **Live Orders:** Dashboard → Orders
- **Payments Received:** Dashboard → Payments
- **Failed Payments:** Dashboard → Refunds
- **API Logs:** Settings → API Logs

---

## 🎯 Production Checklist

- [ ] Switch to **Live Keys** in .env
- [ ] Test with real payment (₹1-₹10 minimum)
- [ ] All JWT token validations working
- [ ] Signature verification passing
- [ ] Refund functionality tested
- [ ] Database logging payment details
- [ ] Error notifications set up
- [ ] Payment timeout handling implemented
- [ ] Database backups configured
- [ ] SSL/HTTPS enabled on production

---

## 📖 Additional Resources

- [Razorpay Documentation](https://razorpay.com/docs)
- [Razorpay API Reference](https://razorpay.com/docs/api)
- [Razorpay Sandbox Testing](https://razorpay.com/docs/payments/dashboard/sandbox-account)
- [HMAC-SHA256 Verification](https://razorpay.com/docs/webhooks/validate-webhook-signature)

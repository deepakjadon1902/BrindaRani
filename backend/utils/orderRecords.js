const Payment = require('../models/Payment');
const Shipment = require('../models/Shipment');

const syncPaymentRecord = (order) => Payment.findOneAndUpdate(
  { orderId: order._id },
  {
    $set: {
      userId: order.userId,
      orderCode: order.orderCode,
      amount: order.total,
      method: order.paymentMethod,
      status: order.paymentStatus || 'pending',
      provider: String(order.paymentMethod || '').toUpperCase() === 'RAZORPAY' ? 'razorpay' : '',
      gatewayOrderId: order.razorpayOrderId || '',
      gatewayPaymentId: order.razorpayPaymentId || '',
      failureReason: order.paymentDetails?.failureReason || '',
      verifiedAt: order.paymentStatus === 'paid' ? order.updatedAt || new Date() : null,
      details: order.paymentDetails || {},
    },
  },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

const syncShipmentRecord = (order) => Shipment.findOneAndUpdate(
  { orderId: order._id },
  {
    $set: {
      userId: order.userId,
      orderCode: order.orderCode,
      courierPartner: order.courierPartner || '',
      trackingId: order.trackingId || '',
      trackingUrl: order.trackingUrl || '',
      estimatedDelivery: order.estimatedDelivery || null,
      status: order.status || 'pending',
      history: (order.statusHistory || []).map((entry) => ({
        status: entry.status,
        note: entry.note || '',
        location: entry.location || '',
        timestamp: entry.timestamp,
      })),
    },
  },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

const syncOrderRecords = async (order) => {
  if (!order?._id) return;
  await Promise.all([syncPaymentRecord(order), syncShipmentRecord(order)]);
};

module.exports = { syncPaymentRecord, syncShipmentRecord, syncOrderRecords };

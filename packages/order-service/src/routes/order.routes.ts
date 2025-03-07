import { Router, Request, Response } from 'express';
import Order from '../models/Order.model';

const router = Router();

// CREATE new order
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, items, totalAmount } = req.body;
    const order = await Order.create({
      userId,
      items,
      totalAmount,
      status: 'PENDING'
    });
    return res.json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create order' });
  }
});

// GET orders (for admin or user’s own orders)
router.get('/', async (req: Request, res: Response) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// UPDATE order status
router.put('/:id/status', async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = status;
    await order.save();

    return res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Simulate payment
router.post('/:id/pay', async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // In a real scenario, you'd integrate Stripe/PayPal/Meta Pay, etc.
    // Here we just set status to 'PAID'
    order.status = 'PAID';
    await order.save();

    return res.json({ message: 'Payment successful', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Payment failed' });
  }
});

export default router;

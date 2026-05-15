import { Request, Response } from 'express';
import Order from '../models/Order';

export const addOrderItems = async (req: any, res: Response) => {
  const { items, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (items && items.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  } else {
    const order = new Order({
      items,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

export const getMyOrders = async (req: any, res: Response) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

export const getOrders = async (req: Request, res: Response) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.orderStatus = req.body.status || order.orderStatus;
    if (req.body.status === 'delivered') {
      order.paymentStatus = 'paid';
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

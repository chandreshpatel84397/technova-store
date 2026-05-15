import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';

export const getDashboardStats = async (req: Request, res: Response) => {
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalUsers = await User.countDocuments();

  const orders = await Order.find({});
  const totalRevenue = orders.reduce((acc, item) => acc + item.totalPrice, 0);

  const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5).populate('user', 'name');

  res.json({
    totalOrders,
    totalProducts,
    totalUsers,
    totalRevenue,
    recentOrders,
  });
};

export const getSalesReport = async (req: Request, res: Response) => {
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        totalSales: { $sum: '$totalPrice' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(salesData);
};

import { Request, Response } from 'express';
import User from '../models/User';

export const getCart = async (req: any, res: Response) => {
  const user = await User.findById(req.user._id).populate('cart.product');
  if (user) {
    res.json(user.cart);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const updateCart = async (req: any, res: Response) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.cart = req.body.cart;
    await user.save();
    res.json({ message: 'Cart updated' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const getWishlist = async (req: any, res: Response) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  if (user) {
    res.json(user.wishlist);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const updateWishlist = async (req: any, res: Response) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.wishlist = req.body.wishlist;
    await user.save();
    res.json({ message: 'Wishlist updated' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find({}).select('-password');
  res.json(users);
};

export const blockUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.status = user.status === 'active' ? 'blocked' : 'active';
    await user.save();
    res.json({ message: `User ${user.status === 'blocked' ? 'blocked' : 'unblocked'} successfully` });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

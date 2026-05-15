import express from 'express';
import { getCart, updateCart, getWishlist, updateWishlist, getUsers, blockUser } from '../controllers/userController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/cart', protect, getCart);
router.post('/cart', protect, updateCart);
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist', protect, updateWishlist);

// Admin routes
router.get('/', protect, admin, getUsers);
router.put('/:id/block', protect, admin, blockUser);

export default router;

import express from 'express';
import { getDashboardStats, getSalesReport } from '../controllers/analyticsController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/stats', protect, admin, getDashboardStats);
router.get('/sales', protect, admin, getSalesReport);

export default router;

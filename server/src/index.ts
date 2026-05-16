import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log(`Attempting to start server on port ${PORT}...`);
console.log(`Environment: ${process.env.NODE_ENV}`);

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('TechNova API is running...');
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/technova';

// Process-level error handling for better debugging on Render
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

console.log('Connecting to MongoDB...');

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

    server.on('error', (error: any) => {
      console.error('❌ Server failed to start:', error.message);
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error message:', err.message);
    // Log minimal error info to avoid massive log dumps
    if (err.name === 'MongooseServerSelectionError') {
      console.error('👉 Hint: Check if your IP is whitelisted in MongoDB Atlas (0.0.0.0/0 for Render)');
    }
    process.exit(1);
  });

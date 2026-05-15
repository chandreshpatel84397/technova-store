import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const checkUser = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/technova';
    await mongoose.connect(MONGO_URI);
    
    const users = await User.find({});
    console.log('--- USERS IN DATABASE ---');
    users.forEach(u => console.log(`ID: ${u._id}, Email: ${u.email}`));
    console.log('-------------------------');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkUser();

// config/db.js  (example file name)
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // optional settings
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌  Mongo connection error:', err.message);
    process.exit(1);
  }
};

export default connectDB;

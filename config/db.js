import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()

const connectDB = async () => {
  try {
    console.log(process.env.MONGOURL)
    await mongoose.connect(process.env.MONGOURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Database connected');
  } catch (e) {
    console.error(e.message);
  }
}

export default connectDB;

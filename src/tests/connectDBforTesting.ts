import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

export const connectDBforTesting = async () => {
  await mongoose
    .connect(process.env.MONGODB_URI!)
    .then(() => {
      console.log(`| Successfully connected to DB for TESTING!`);
      console.log(`| SpruceMoose listening on port ${process.env.PORT}`);
    })
    .catch(() => console.log('Failed to connect to database'));
};

export const disconnectDBforTesting = async () => {
  try {
    await mongoose.connection.close();
  } catch (error) {
    console.log('DB disconnect error.');
  }
};

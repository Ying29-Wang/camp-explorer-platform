const mongoose = require('mongoose');

const connectDB = async () => {
  try {

    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error('MongoDB URI is undefined. Please check your environment variables.');
      process.exit(1);
    }
    
    const conn = await mongoose.connect(mongoUri);

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
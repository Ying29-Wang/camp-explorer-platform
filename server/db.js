const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error('MongoDB URI is undefined. Please check your environment variables.');
      // Don't exit in production, allow it to continue and fail gracefully
      if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
      }
      return null;
    }
    
    const conn = await mongoose.connect(mongoUri, {
      // Connection options (these are the defaults in newer versions)
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Don't exit in production, allow it to continue and fail gracefully
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    return null;
  }
};

module.exports = connectDB;
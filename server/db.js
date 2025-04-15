const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('MongoDB URI is undefined. Please check your environment variables.');
      process.exit(1);
    }

    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', mongoUri.replace(/(mongodb\+srv:\/\/[^:]+):([^@]+)@/, '$1:****@')); // 隐藏密码
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 5000
    });

    // 设置连接事件处理器
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
      console.log('Connection state:', mongoose.connection.readyState);
      console.log('Host:', mongoose.connection.host);
      console.log('Port:', mongoose.connection.port);
      console.log('Database:', mongoose.connection.name);
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      console.error('Error stack:', err.stack);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      console.log('Connection state:', mongoose.connection.readyState);
    });

    // 处理进程终止
    process.on('SIGINT', async () => {
      console.log('Closing MongoDB connection...');
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error('Error stack:', error.stack);
    console.error('Connection state:', mongoose.connection.readyState);
    process.exit(1);
  }
};

module.exports = connectDB;
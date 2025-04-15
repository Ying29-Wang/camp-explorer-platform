const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('MongoDB URI is undefined. Please check your environment variables.');
      process.exit(1);
    }

    console.log('=== MongoDB Connection Attempt ===');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('MongoDB URI:', mongoUri.replace(/(mongodb\+srv:\/\/[^:]+):([^@]+)@/, '$1:****@'));
    console.log('Node Version:', process.version);
    console.log('Mongoose Version:', mongoose.version);
    
    // 设置全局查询超时
    mongoose.set('bufferTimeoutMS', 30000);
    
    // 设置调试模式
    mongoose.set('debug', true);
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      retryReads: true,
      heartbeatFrequencyMS: 10000,
      retryAttempts: 3,
      retryDelay: 1000
    });

    // 设置连接事件处理器
    mongoose.connection.on('connected', () => {
      console.log('=== MongoDB Connected Successfully ===');
      console.log('Connection state:', mongoose.connection.readyState);
      console.log('Host:', mongoose.connection.host);
      console.log('Port:', mongoose.connection.port);
      console.log('Database:', mongoose.connection.name);
      console.log('==============================');
    });

    mongoose.connection.on('error', (err) => {
      console.error('=== MongoDB Connection Error ===');
      console.error('Error message:', err.message);
      console.error('Error name:', err.name);
      console.error('Error stack:', err.stack);
      console.error('Connection state:', mongoose.connection.readyState);
      console.error('==============================');
    });

    mongoose.connection.on('disconnected', () => {
      console.log('=== MongoDB Disconnected ===');
      console.log('Connection state:', mongoose.connection.readyState);
      console.log('==============================');
    });

    // 处理进程终止
    process.on('SIGINT', async () => {
      console.log('=== Closing MongoDB Connection ===');
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      console.log('==============================');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('=== MongoDB Connection Failed ===');
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);
    console.error('Error stack:', error.stack);
    console.error('Connection state:', mongoose.connection.readyState);
    console.error('==============================');
    process.exit(1);
  }
};

module.exports = connectDB;
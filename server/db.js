const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      console.error('MONGODB_URI is not defined in environment variables');
      process.exit(1);
    }

    console.log('=== MongoDB Connection Attempt ===');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('MongoDB URI:', uri.replace(/(mongodb\+srv:\/\/[^:]+):([^@]+)@/, '$1:****@'));
    console.log('Node Version:', process.version);
    console.log('Mongoose Version:', mongoose.version);
    
    // 基础配置（适用于所有环境）
    const baseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      retryReads: true
    };

    // 本地开发环境配置
    const localOptions = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 5000,
      maxPoolSize: 5,
      minPoolSize: 1,
      heartbeatFrequencyMS: 10000
    };

    // 生产环境配置
    const productionOptions = {
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 60000,
      maxPoolSize: 20,
      minPoolSize: 10,
      heartbeatFrequencyMS: 5000,
      maxIdleTimeMS: 60000,
      waitQueueTimeoutMS: 30000
    };

    // 根据环境选择配置
    const isProduction = process.env.NODE_ENV === 'production';
    const connectionOptions = {
      ...baseOptions,
      ...(isProduction ? productionOptions : localOptions)
    };

    // 设置全局查询超时
    mongoose.set('bufferTimeoutMS', isProduction ? 60000 : 10000);
    
    // 设置调试模式（仅在开发环境）
    mongoose.set('debug', !isProduction);
    
    const conn = await mongoose.connect(uri, connectionOptions);
    
    // 设置连接事件处理器
    mongoose.connection.on('connected', () => {
      console.log(`=== MongoDB Connected Successfully (${isProduction ? 'Production' : 'Development'}) ===`);
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
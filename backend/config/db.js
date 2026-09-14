const mongoose = require('mongoose');
const { ensureLocalMongo } = require('./autoMongo');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Automatically ensure local MongoDB is running if developing locally
    await ensureLocalMongo();

    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/library_portal';
    cached.promise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    }).then((m) => {
      console.log(`MongoDB Connected: ${m.connection.host}`);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error(`MongoDB Connection Error: ${e.message}`);
  }

  return cached.conn;
};

module.exports = connectDB;


const fs = require('fs');
const path = require('path');
const net = require('net');
const { spawn } = require('child_process');

// Checks if local port 27017 is listening
function isMongoRunning(port = 27017, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);

    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, host);
  });
}

// Locate mongod executable on Windows
function findMongoExecutable() {
  const possiblePaths = [
    'C:\\Program Files\\MongoDB\\Server\\8.3\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\8.0\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\6.0\\bin\\mongod.exe',
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }

  // Check parent MongoDB directory for any installed version
  const baseDir = 'C:\\Program Files\\MongoDB\\Server';
  if (fs.existsSync(baseDir)) {
    const versions = fs.readdirSync(baseDir);
    for (const v of versions) {
      const exe = path.join(baseDir, v, 'bin', 'mongod.exe');
      if (fs.existsSync(exe)) return exe;
    }
  }

  return 'mongod';
}

async function ensureLocalMongo() {
  // If running in cloud (Vercel) or using remote Atlas URI, skip
  if (process.env.VERCEL) return;
  const mongoUri = process.env.MONGO_URI || '';
  if (mongoUri.includes('mongodb+srv:') || (mongoUri && !mongoUri.includes('127.0.0.1') && !mongoUri.includes('localhost'))) {
    return;
  }

  const running = await isMongoRunning(27017, '127.0.0.1');
  if (running) {
    return;
  }

  console.log('🔄 Local MongoDB is not running. Automatically starting MongoDB daemon...');

  const dbDir = path.resolve(__dirname, '../../../mongodb_data/db');
  const logDir = path.resolve(__dirname, '../../../mongodb_data');
  const logFile = path.join(logDir, 'mongod.log');

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const mongodPath = findMongoExecutable();

  const args = [
    '--dbpath', dbDir,
    '--logpath', logFile,
    '--setParameter', 'diagnosticDataCollectionEnabled=false',
    '--bind_ip', '127.0.0.1',
    '--port', '27017'
  ];

  try {
    const child = spawn(mongodPath, args, {
      detached: true,
      stdio: 'ignore',
      windowsHide: true
    });
    child.unref();

    // Wait for MongoDB to accept connections (up to 8 seconds)
    for (let i = 0; i < 16; i++) {
      await new Promise((r) => setTimeout(r, 500));
      const ready = await isMongoRunning(27017, '127.0.0.1');
      if (ready) {
        console.log('✅ Local MongoDB started and ready on port 27017');
        return;
      }
    }
    console.warn('⚠️ MongoDB was launched, but connection check is taking longer than expected.');
  } catch (err) {
    console.error('Failed to automatically start MongoDB:', err.message);
  }
}

module.exports = { ensureLocalMongo, isMongoRunning };

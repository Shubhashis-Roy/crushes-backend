import http from 'http';
import app from './app';
// import initializeSocket from './socket/socket';

// Run cron jobs
// import './cron-job/cronjob';

const PORT = process.env.DEV_PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize socket.io
// initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

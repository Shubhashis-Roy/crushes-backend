import 'tsconfig-paths/register';
import http from 'http';
import app from './app';
import initializeSocket from './integrations/socket/socket';

// Run cron jobs
// import '@/cron-job/sendMailCronjob.cronJob';
// import '@/cron-job/deleteIgnoredRejected.cronJob';

const PORT = process.env.DEV_PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize socket
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

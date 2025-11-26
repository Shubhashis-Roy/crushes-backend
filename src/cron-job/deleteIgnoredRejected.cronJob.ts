import { deleteIgnoredRejectedService } from '@/services/request.servers';
import cron from 'node-cron';

// cron.schedule('* * * * *', async () => {
// every 1 houres
cron.schedule('0 */1 * * *', async () => {
  try {
    await deleteIgnoredRejectedService();
    // console.log(`Cron Completed: Deleted ignored/rejected requests`);
  } catch (error) {
    console.error('Cron Error:', error);
  }
});

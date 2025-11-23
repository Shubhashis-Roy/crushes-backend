import { deleteIgnoredRejectedService } from '@/services/request.servers';
import cron from 'node-cron';

// cron.schedule('*/1 * * * *', async () => {
cron.schedule('0 */2 * * *', async () => {
  try {
    await deleteIgnoredRejectedService();
    // console.log(`Cron Completed: Deleted ${deletedCount} ignored/rejected requests`);
  } catch (error) {
    console.error('Cron Error:', error);
  }
});

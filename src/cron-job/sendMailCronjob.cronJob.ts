import cron from 'node-cron';
import ConnectionRequestModel from '../models/connectionRequest.model';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import { sendEmail } from '../integrations/aws/sendEmail';

cron.schedule('14 23 * * *', async () => {
  const yesterday = subDays(new Date(), 1);
  const yesterdayStart = startOfDay(yesterday);
  const yesterdayEnd = endOfDay(yesterday);

  try {
    const yesterdayPendingRequests = await ConnectionRequestModel.find({
      status: 'interested',
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate('fromUserId toUserId');

    // const listOfEmails = [...new Set(yesterdayPendingRequests.map((req) => req.toUserId.emailId))];

    const listOfEmails = [
      ...new Set(
        yesterdayPendingRequests
          .map((req) => {
            const toUser = req.toUserId;
            if (typeof toUser === 'object' && 'emailId' in toUser) {
              return toUser.emailId;
            }
            return null;
          })
          .filter((email): email is string => !!email)
      ),
    ];

    for (const email of listOfEmails) {
      try {
        await sendEmail(email);
      } catch (error) {
        console.error('sendEmail error:', error);
      }
    }
  } catch (error) {
    console.error(error, 'cron job error.');
  }
});

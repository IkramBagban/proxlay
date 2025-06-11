import cron from 'node-cron';
import { checkAndUpdateExpiredTrials } from './trial';

// Run every day at midnight to check for expired trials
export const startTrialExpiryScheduler = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running trial expiry check...');
    try {
      const expiredCount = await checkAndUpdateExpiredTrials();
      console.log(`Trial expiry check completed. Updated ${expiredCount} expired trials.`);
    } catch (error) {
      console.error('Error during trial expiry check:', error);
    }
  });

  console.log('Trial expiry scheduler started');
};

// Manual function to check expired trials (can be called via API if needed)
export const checkExpiredTrialsManually = async () => {
  try {
    const expiredCount = await checkAndUpdateExpiredTrials();
    return { success: true, expiredCount };
  } catch (error) {
    console.error('Error checking expired trials manually:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
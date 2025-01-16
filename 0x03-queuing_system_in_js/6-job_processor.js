import kue from 'kue';

const queue = kue.createQueue();

// Function to send a notification
function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

// Process the jobs in the push_notification_code queue
queue.process('push_notification_code', (job, done) => {
  const { phoneNumber, message } = job.data;
  
  // Call sendNotification with job data
  sendNotification(phoneNumber, message);

  // Mark job as done
  done(() => {
    console.log('Job processing done');
  });
});

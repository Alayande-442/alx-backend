const kue = require('kue');
const queue = kue.createQueue();

// Blacklisted phone numbers
const blacklistedNumbers = ['4153518780', '4153518781'];

// Function to send notification
function sendNotification(phoneNumber, message, job, done) {
  // Track progress (0% initially)
  job.progress(0, 100);

  // Check if the phone number is blacklisted
  if (blacklistedNumbers.includes(phoneNumber)) {
    // Fail the job if the number is blacklisted
    job.failed(new Error(`Phone number ${phoneNumber} is blacklisted`));
    done(new Error(`Phone number ${phoneNumber} is blacklisted`));
    return;
  }

  // Track progress to 50% after passing blacklist check
  job.progress(50, 100);
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

  // Simulate sending notification and completing the job
  setTimeout(() => {
    job.complete();
    console.log(`Notification job ${job.id} completed`);
    done();
  }, 1000); // Simulate 1 second delay for sending notification
}

// Create a job processor with a concurrency of 2
queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;

  // Call the function to process the job
  sendNotification(phoneNumber, message, job, done);
});

// Log when a job fails
queue.on('job failed', (job, err) => {
  console.log(`Notification job ${job.id} failed: ${err.message}`);
});

// Log when a job completes
queue.on('job complete', (job) => {
  console.log(`Notification job ${job.id} completed`);
});


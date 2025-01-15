import { createQueue } from 'kue';

const blacklist = ['4153518780', '4153518781'];

const queue = createQueue();

// Function to send notifications, including error handling
function sendNotification(phoneNumber, message, job, done) {
  job.progress(0, 100); // Start progress (0% completion)
  
  if (blacklist.includes(phoneNumber)) {
    done(new Error(`Phone number ${phoneNumber} is blacklisted`)); // Return error if phone number is blacklisted
    return;
  }

  job.progress(50, 100); // Mid progress (50% completion)
  
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
  done(); // Mark job as completed
}

// Define job processing for 'push_notification_code_2'
queue.process('push_notification_code_2', 2, function(job, done) {
  sendNotification(job.data.phoneNumber, job.data.message, job, done);
});


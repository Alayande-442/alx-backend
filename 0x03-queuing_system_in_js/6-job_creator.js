import kue from 'kue';

const queue = kue.createQueue();

const jobData = {
  phoneNumber: '1234567890',
  message: 'Your notification is ready!',
};

// Create a job
const job = queue.create('push_notification_code', jobData)
  .save((err) => {
    if (err) {
      console.log('Notification job failed');
    } else {
      console.log(`Notification job created: ${job.id}`);
    }
  });

// When the job is completed
job.on('complete', () => {
  console.log('Notification job completed');
});

// When the job is failing
job.on('failed', () => {
  console.log('Notification job failed');
});


import kue from 'kue';

// Function to create push notification jobs
function createPushNotificationsJobs(jobs, queue) {
  // Validate if jobs is an array
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }

  // Iterate through the jobs and create a new job for each
  jobs.forEach((jobData) => {
    // Create a new job in the queue
    const job = queue.create('push_notification_code_3', jobData)
      .save((err) => {
        if (err) {
          console.error('Error creating job:', err);
        } else {
          console.log(`Notification job created: ${job.id}`);
        }
      });

    // Handle job events: progress, complete, and failure
    job.on('progress', (progress, data) => {
      console.log(`Notification job ${job.id} ${progress}% complete`);
    });

    job.on('complete', () => {
      console.log(`Notification job ${job.id} completed`);
    });

    job.on('failed', (err) => {
      console.log(`Notification job ${job.id} failed: ${err}`);
    });
  });
}

export default createPushNotificationsJobs;


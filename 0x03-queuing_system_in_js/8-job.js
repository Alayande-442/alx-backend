function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }

  jobs.forEach((myJob) => {
    let job = queue.create('push_notification_code_3', myJob);

    // Attach event listeners for job completion, failure, and progress
    job
      .on('complete', function() {
        console.log(`Notification job ${job.id} completed`);
      })
      .on('failed', function(error) {
        console.log(`Notification job ${job.id} failed: ${error}`);
      })
      .on('progress', function(progress) {
        console.log(`Notification job ${job.id} ${progress}% complete`);
      });

    // Save job and handle errors
    job.save((error) => {
      if (error) {
        console.error(`Error saving job ${job.id}: ${error}`);
      } else {
        console.log(`Notification job created: ${job.id}`);
      }
    });
  });
}

module.exports = createPushNotificationsJobs;


import { expect } from 'chai';
import kue from 'kue';
import createPushNotificationsJobs from './8-job.js';

describe('createPushNotificationsJobs', () => {
  let queue;

  before(() => {
    queue = kue.createQueue();
    queue.testMode = true; // Enable test mode
  });

  after(() => {
    queue.testMode = false; // Disable test mode after tests
  });

  it('should display an error message if jobs is not an array', () => {
    const invalidJobs = {}; // This is not an array
    try {
      createPushNotificationsJobs(invalidJobs, queue);
    } catch (error) {
      expect(error.message).to.equal('Jobs is not an array');
    }
  });

  it('should create two new jobs to the queue', (done) => {
    const list = [
      { phoneNumber: '4153518780', message: 'This is the code 1234 to verify your account' },
      { phoneNumber: '4153518781', message: 'This is the code 5678 to verify your account' },
    ];

    // Counter for the number of jobs created
    let jobsCreated = 0;

    // Listen to job creation events
    queue.on('job enqueue', (id, type) => {
      if (type === 'push_notification_code_3') {
        jobsCreated += 1;
      }
    });

    // Create jobs using the function
    createPushNotificationsJobs(list, queue);

    // Wait for jobs to be processed in test mode and check
    setImmediate(() => {
      if (jobsCreated === 2) {
        done(); // If two jobs were created, pass the test
      } else {
        done(new Error('Jobs were not added to the queue.'));
      }
    });
  });
});


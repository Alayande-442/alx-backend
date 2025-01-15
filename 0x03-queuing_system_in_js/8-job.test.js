import { describe, it, before, after, afterEach } from 'mocha';
import { expect } from 'chai';
import { createQueue } from 'kue';

import createPushNotificationsJobs from './8-job.js';

const queue = createQueue();

describe('Test createPushNotificationsJobs function', function() {
  before(function () {
    // Enter test mode
    queue.testMode.enter();
  });

  afterEach(function () {
    // Clear all jobs after each test
    queue.testMode.clear();
  });

  after(function () {
    // Exit test mode
    queue.testMode.exit();
  });

  it('display an error message if jobs is not an array', function() {
    // Test invalid input (jobs is not an array)
    expect(() => createPushNotificationsJobs('job', queue)).to.throw(Error, 'Jobs is not an array');
  });

  it('Test whether jobs are created', function() {
    const jobs = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account'
      },
      {
        phoneNumber: '4153518781',
        message: 'This is the code 4562 to verify your account'
      },
    ];

    // Create jobs
    createPushNotificationsJobs(jobs, queue);

    // Check if jobs are added to the queue
    expect(queue.testMode.jobs.length).to.equal(2);

    // Check job details
    expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3');
    expect(queue.testMode.jobs[0].data).to.eql(jobs[0]);

    expect(queue.testMode.jobs[1].type).to.equal('push_notification_code_3');
    expect(queue.testMode.jobs[1].data).to.eql(jobs[1]);
  });
});


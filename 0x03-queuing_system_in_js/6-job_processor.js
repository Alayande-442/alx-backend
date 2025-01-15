const kue = require("kue");
const queue = kue.createQueue();

function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber} with message: ${message}`);
}

// Define job processing logic
queue.process("push_notification_code", (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message);
  done();
});

// Create a job
const jobData = {
  phoneNumber: "4153518780",
  message: "This is the code to verify your account",
};

const job = queue.create("push_notification_code", jobData).save((err) => {
  if (err) {
    console.error(`Failed to create job: ${err.message}`);
  } else {
    console.log(`Notification job created: ${job.id}`);
  }
});


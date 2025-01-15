const kue = require("kue");
const queue = kue.createQueue();

const JobData = {
  phoneNumber: "4153518780",
  message: "This is the code to verify your account",
};

const job = queue.create("push_notification_code", JobData).save((error) => {
  if (error) {
    console.error(`Failed to create notification job: ${error.message}`);
  } else {
    console.log(`Notification job created: ${job.id}`);
  }
});

job.on("complete", () => {
  console.log("Notification job completed");
});

job.on("failed", (errorMessage) => {
  console.error(`Notification job failed: ${errorMessage}`);
});

job.on("progress", (progress, data) => {
  console.log(`Notification job ${job.id} is ${progress}% complete`, data || "");
});


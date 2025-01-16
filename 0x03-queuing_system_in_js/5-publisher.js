// Import redis
import { createClient } from 'redis';

// Create the Redis client
const redisClient = createClient();

// Connect to the Redis server
redisClient.on('connect', function () {
  console.log('Redis client connected to the server');
});

// Handle errors
redisClient.on('error', function (error) {
  console.log(`Redis client not connected to the server: ${error}`);
});

// Function to publish a message after a delay
function publishMessage(message, time) {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    redisClient.publish('ALXchannel', message);
  }, time);
}

// Publish messages as per the task
publishMessage("ALX Student #1 starts course", 100);
publishMessage("ALX Student #2 starts course", 200);
publishMessage("KILL_SERVER", 300);
publishMessage("ALX Student #3 starts course", 400);


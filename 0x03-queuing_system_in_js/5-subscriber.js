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

// Subscribe to the channel
redisClient.subscribe('ALXchannel');

// Listen for messages on the subscribed channel
redisClient.on('message', function (channel, message) {
  console.log(message);
  
  // If the message is 'KILL_SERVER', unsubscribe and quit
  if (message === 'KILL_SERVER') {
    redisClient.unsubscribe();
    redisClient.quit();
  }
});


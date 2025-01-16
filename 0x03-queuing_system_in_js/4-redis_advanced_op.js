import Redis from 'ioredis';

// Create a new Redis client using ioredis
const redisClient = new Redis(); // By default, this connects to localhost:6379

// Log when the Redis client successfully connects
redisClient.on('connect', function () {
  console.log('Redis client connected to the server');
});

// Log errors
redisClient.on('error', function (error) {
  console.log(`Redis client not connected to the server: ${error}`);
});

// Async function to interact with Redis
async function main() {
  try {
    // Set hash key-value pairs in the HolbertonSchools list
    await redisClient.hset('HolbertonSchools', 'Portland', '50');
    await redisClient.hset('HolbertonSchools', 'Seattle', '80');
    await redisClient.hset('HolbertonSchools', 'New York', '20');
    await redisClient.hset('HolbertonSchools', 'Bogota', '20');
    await redisClient.hset('HolbertonSchools', 'Cali', '40');
    await redisClient.hset('HolbertonSchools', 'Paris', '2');

    console.log('Hash keys set in HolbertonSchools');

    // Retrieve all elements stored in the HolbertonSchools hash
    const result = await redisClient.hgetall('HolbertonSchools');
    console.log(result);
  } catch (error) {
    console.error('Error interacting with Redis:', error);
  } finally {
    // Always disconnect the client after operations
    redisClient.disconnect();
  }
}

// Run the main function
main();

import { createClient } from "redis";

const client = createClient();

client.on("connect", () => {
  console.log("Redis client connected to the server");
});

client.on("error", (error) => {
  console.error(`Redis client not connected to the server: ${error}`);
});

// Example: Connect to the Redis server
(async () => {
  try {
    await client.connect(); // Ensure connection in redis v4+
  } catch (error) {
    console.error(`Error connecting to Redis: ${error}`);
  }
})();


import { createClient } from "redis";

const client = createClient();

client.on("connect", () => {
  console.log("Redis client connected to the server");
});

client.on("error", (error) => {
  console.error(`Redis client not connected to the server: ${error}`);
});

async function publishMessage(message, time) {
  setTimeout(async () => {
    console.log(`About to send ${message}`);
    try {
      await client.publish("holberton school channel", message);
    } catch (error) {
      console.error(`Error publishing message: ${error.message}`);
    }
  }, time);
}

async function main() {
  try {
    await client.connect(); // Ensure client is connected before publishing

    publishMessage("Holberton Student #1 starts course", 100);
    publishMessage("Holberton Student #2 starts course", 200);
    publishMessage("KILL_SERVER", 300);
    publishMessage("Holberton Student #3 starts course", 400);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  } finally {
    setTimeout(() => client.quit(), 500); // Close the connection after all messages
  }
}

main();


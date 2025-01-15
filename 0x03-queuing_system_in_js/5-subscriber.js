import { createClient } from "redis";

const client = createClient();

client.on("connect", () => {
  console.log("Redis client connected to the server");
});

client.on("error", (error) => {
  console.error(`Redis client not connected to the server: ${error}`);
});

async function subscribeToChannel() {
  try {
    await client.connect(); // Explicitly connect the client

    await client.subscribe("holberton school channel", (message) => {
      console.log(message);

      if (message === "KILL_SERVER") {
        client.unsubscribe("holberton school channel").then(() => {
          client.quit();
        });
      }
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

subscribeToChannel();


import { createClient } from "redis";

const client = createClient();

client.on("connect", () => {
  console.log("Redis client connected to the server");
});

client.on("error", (error) => {
  console.error(`Redis client not connected to the server: ${error}`);
});

async function hashValue() {
  const values = {
    Portland: 50,
    Seattle: 80,
    "New York": 20,
    Bogota: 20,
    Cali: 40,
    Paris: 2,
  };

  try {
    await client.connect(); // Explicitly connect the client

    for (const [key, value] of Object.entries(values)) {
      await client.hSet("HolbertonSchools", key, value);
    }

    const result = await client.hGetAll("HolbertonSchools");
    console.log(result);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  } finally {
    await client.disconnect(); // Disconnect after operations
  }
}

hashValue();


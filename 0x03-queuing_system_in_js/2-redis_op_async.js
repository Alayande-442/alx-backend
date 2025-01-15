import { createClient } from "redis";

const client = createClient();

client.on("connect", () => {
  console.log("Redis client connected to the server");
});

client.on("error", (error) => {
  console.error(`Redis client not connected to the server: ${error}`);
});

// Set a new school
async function setNewSchool(schoolName, value) {
  try {
    await client.set(schoolName, value);
    console.log(`Set ${schoolName} to ${value}`);
  } catch (error) {
    console.error(`Error setting value for ${schoolName}: ${error}`);
  }
}

// Display the value of a school
async function displaySchoolValue(schoolName) {
  try {
    const result = await client.get(schoolName);
    console.log(`${schoolName}: ${result}`);
  } catch (error) {
    console.error(`Error getting value for ${schoolName}: ${error}`);
  }
}

// Main Execution
(async () => {
  try {
    await client.connect(); // Explicitly connect the client
    await displaySchoolValue("Holberton");
    await setNewSchool("HolbertonSanFrancisco", "100");
    await displaySchoolValue("HolbertonSanFrancisco");
    await client.disconnect(); // Disconnect after operations
  } catch (error) {
    console.error(`Unexpected error: ${error}`);
  }
})();

import express from 'express';
import redis from 'redis';
import { promisify } from 'util';
import kue from 'kue';

// Redis client setup
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Initialize the number of seats and reservation status
const initialAvailableSeats = 50;
let reservationEnabled = true;

// Set the initial number of available seats in Redis
async function reserveSeat(number) {
  await setAsync('available_seats', number);
}

// Function to get the current available seats
async function getCurrentAvailableSeats() {
  const availableSeats = await getAsync('available_seats');
  return availableSeats ? parseInt(availableSeats, 10) : 0;
}

// Kue queue setup
const queue = kue.createQueue();

// Express server setup
const app = express();
const port = 1245;

// Initialize available seats in Redis
reserveSeat(initialAvailableSeats);

// Route to get available seats
app.get('/available_seats', async (req, res) => {
  const availableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: availableSeats });
});

// Route to reserve a seat
app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservations are blocked' });
  }

  // Create a job in the Kue queue
  const job = queue.create('reserve_seat', {}).save((err) => {
    if (err) {
      return res.json({ status: 'Reservation failed' });
    }
    return res.json({ status: 'Reservation in process' });
  });

  // Listen for job completion or failure
  job.on('complete', (result) => {
    console.log(`Seat reservation job ${job.id} completed`);
  });

  job.on('failed', (errorMessage) => {
    console.log(`Seat reservation job ${job.id} failed: ${errorMessage}`);
  });
});

// Route to process the queue
app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  // Process the reservation job in the queue
  queue.process('reserve_seat', async (job, done) => {
    const availableSeats = await getCurrentAvailableSeats();

    if (availableSeats <= 0) {
      reservationEnabled = false;
      return done(new Error('Not enough seats available'));
    }

    // Decrease the number of available seats by 1
    await reserveSeat(availableSeats - 1);

    // If no seats are available, set reservationEnabled to false
    if (availableSeats - 1 === 0) {
      reservationEnabled = false;
    }

    done();
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


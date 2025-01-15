import { createClient } from 'redis';
import { createQueue } from 'kue';
import { promisify } from 'util';
import express from 'express';

// Create redis client
const redisClient = createClient();

redisClient.on('connect', function() {
  console.log('Redis client connected to the server');
});

redisClient.on('error', function (err) {
  console.log(`Redis client not connected to the server: ${err}`);
});

// Promisify client.get function
const asyncGet = promisify(redisClient.get).bind(redisClient);

// Reserve seat function
function reserveSeat(number) {
  redisClient.set('available_seats', number, (err) => {
    if (err) {
      console.log(`Error reserving seat: ${err}`);
    }
  });
}

// Get current available seats function
async function getCurrentAvailableSeats() {
  try {
    const seats = await asyncGet('available_seats');
    return seats ? parseInt(seats) : 0; // Return 0 if no value is found
  } catch (error) {
    console.error(`Error fetching seats: ${error}`);
    return 0;
  }
}

let reservationEnabled = true;

// Create Kue queue
const queue = createQueue();

// Create express app
const app = express();

// Available seats endpoint
app.get('/available_seats', async function (req, res) {
  const availableSeats = await getCurrentAvailableSeats();
  res.json({ "numberOfAvailableSeats": availableSeats });
});

// Reserve seat endpoint
app.get('/reserve_seat', function (req, res) {
  if (!reservationEnabled) {
    res.json({ "status": "Reservations are blocked" });
    return;
  }

  const job = queue.create('reserve_seat', { 'seat': 1 }).save((error) => {
    if (error) {
      res.json({ "status": "Reservation failed" });
      return;
    } else {
      res.json({ "status": "Reservation in process" });
      job.on('complete', function () {
        console.log(`Seat reservation job ${job.id} completed`);
      }).on('failed', function (error) {
        console.log(`Seat reservation job ${job.id} failed: ${error}`);
        res.json({ "status": `Reservation failed: ${error.message}` });
      });
    }
  });
});

// Process reservation in queue
queue.process('reserve_seat', async function (job, done) {
  const seat = await getCurrentAvailableSeats();

  if (seat === 0) {
    reservationEnabled = false;
    done(new Error('Not enough seats available'));
  } else {
    reserveSeat(seat - 1); // Decrease the seat count
    done();
  }
});

// Set up express server
const port = 1245;
app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});

// Initialize seats in Redis (this will set available seats initially)
reserveSeat(50);  // You can change this number as needed


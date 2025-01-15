import { createClient } from 'redis';
import express from 'express';
import { promisify } from 'util';

// create express server on port 1245
const app = express();

// create redis client
const redisClient = createClient();

redisClient.on('connect', function () {
  console.log('Redis client connected to the server');
});

redisClient.on('error', function (err) {
  console.log(`Redis client not connected to the server: ${err}`);
});

// promisify client.get function
const get = promisify(redisClient.get).bind(redisClient);

// List of products
const listProducts = [
  { 'itemId': 1, 'itemName': 'Suitcase 250', 'price': 50, 'initialAvailableQuantity': 4 },
  { 'itemId': 2, 'itemName': 'Suitcase 450', 'price': 100, 'initialAvailableQuantity': 10 },
  { 'itemId': 3, 'itemName': 'Suitcase 650', 'price': 350, 'initialAvailableQuantity': 2 },
  { 'itemId': 4, 'itemName': 'Suitcase 1050', 'price': 550, 'initialAvailableQuantity': 5 }
];

// Retrieve item by id
function getItemById(id) {
  return listProducts.find((item) => item.itemId === id);
}

// Reserve stock by itemId
function reserveStockById(itemId, stock) {
  redisClient.set(itemId, stock, (err) => {
    if (err) {
      console.error(`Error reserving stock for item ${itemId}: ${err}`);
    }
  });
}

// Get current reserved stock by itemId
async function getCurrentReservedStockById(itemId) {
  try {
    const stock = await get(itemId);
    return stock;
  } catch (error) {
    console.error(`Error fetching stock for item ${itemId}: ${error}`);
    return null;
  }
}

// Express routes
app.get('/list_products', function (req, res) {
  res.json(listProducts);
});

app.get('/list_products/:itemId', async function (req, res) {
  const itemId = req.params.itemId;
  const item = getItemById(parseInt(itemId));

  if (item) {
    const stock = await getCurrentReservedStockById(itemId);
    const resItem = {
      itemId: item.itemId,
      itemName: item.itemName,
      price: item.price,
      initialAvailableQuantity: item.initialAvailableQuantity,
      currentQuantity: stock !== null ? parseInt(stock) : item.initialAvailableQuantity,
    };
    res.json(resItem);
  } else {
    res.status(404).json({ "status": "Product not found" });
  }
});

app.get('/reserve_product/:itemId', async function (req, res) {
  const itemId = req.params.itemId;
  const item = getItemById(parseInt(itemId));

  if (!item) {
    res.status(404).json({ "status": "Product not found" });
    return;
  }

  let currentStock = await getCurrentReservedStockById(itemId);
  if (currentStock !== null) {
    currentStock = parseInt(currentStock);
    if (currentStock > 0) {
      reserveStockById(itemId, currentStock - 1);
      res.json({ "status": "Reservation confirmed", "itemId": itemId });
    } else {
      res.status(400).json({ "status": "Not enough stock available", "itemId": itemId });
    }
  } else {
    reserveStockById(itemId, item.initialAvailableQuantity - 1);
    res.json({ "status": "Reservation confirmed", "itemId": itemId });
  }
});

// Set up express server
const port = 1245;
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});


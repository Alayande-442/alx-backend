import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

// Step 1: Data - Product list
const listProducts = [
  { id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
  { id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
  { id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
  { id: 4, name: 'Suitcase 1050', price: 550, stock: 5 },
];

// Step 2: Function to get product by ID
function getItemById(id) {
  return listProducts.find(item => item.id === id);
}

// Step 3: Setup Express server
const app = express();
const port = 1245;

// Step 4: Route to get all products
app.get('/list_products', (req, res) => {
  const products = listProducts.map(product => ({
    itemId: product.id,
    itemName: product.name,
    price: product.price,
    initialAvailableQuantity: product.stock,
  }));
  res.json(products);
});

// Step 5: Connect to Redis and setup functions using promisify
const client = redis.createClient();
client.on('error', (err) => {
  console.log('Redis error:', err);
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Step 6: Reserve stock by ID
async function reserveStockById(itemId, stock) {
  await setAsync(`item.${itemId}`, stock);
}

// Step 7: Get current reserved stock by ID
async function getCurrentReservedStockById(itemId) {
  const reservedStock = await getAsync(`item.${itemId}`);
  return reservedStock ? parseInt(reservedStock, 10) : 0;
}

// Step 8: Route to get product by ID with current stock
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);

  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const reservedStock = await getCurrentReservedStockById(itemId);
  const currentStock = product.stock - reservedStock;

  return res.json({
    itemId: product.id,
    itemName: product.name,
    price: product.price,
    initialAvailableQuantity: product.stock,
    currentQuantity: currentStock,
  });
});

// Step 9: Route to reserve product
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);

  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const reservedStock = await getCurrentReservedStockById(itemId);
  const currentStock = product.stock - reservedStock;

  if (currentStock <= 0) {
    return res.status(400).json({
      status: 'Not enough stock available',
      itemId: product.id,
    });
  }

  // Reserve the stock
  await reserveStockById(itemId, reservedStock + 1);

  return res.json({
    status: 'Reservation confirmed',
    itemId: product.id,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


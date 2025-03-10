const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// In-memory database for memecoins
let memecoins = [
  { 
    id: 1, 
    name: 'DOGE', 
    symbol: 'DOGE', 
    price: 0.12, 
    marketCap: 15000000000, 
    volume24h: 1200000000,
    createdAt: new Date('2013-12-06').toISOString(),
    description: 'The original memecoin based on the Shiba Inu dog meme.'
  },
  { 
    id: 2, 
    name: 'Shiba Inu', 
    symbol: 'SHIB', 
    price: 0.00002, 
    marketCap: 10000000000, 
    volume24h: 800000000,
    createdAt: new Date('2020-08-01').toISOString(),
    description: 'A decentralized meme token that evolved into a vibrant ecosystem.'
  },
  { 
    id: 3, 
    name: 'Pepe', 
    symbol: 'PEPE', 
    price: 0.000001, 
    marketCap: 400000000, 
    volume24h: 50000000,
    createdAt: new Date('2023-04-14').toISOString(),
    description: 'A memecoin based on the Pepe the Frog internet meme.'
  }
];

// Track user investments
let investments = [];

// Get the king of the hill (highest market cap)
const getKingOfTheHill = () => {
  if (memecoins.length === 0) {
    return null;
  }
  return memecoins.reduce((king, coin) => 
    coin.marketCap > king.marketCap ? coin : king, memecoins[0]);
};

// API Routes
// Get all memecoins
app.get('/api/memecoins', (req, res) => {
  res.json(memecoins);
});

// Create a new memecoin
app.post('/api/memecoins', (req, res) => {
  try {
    const { name, symbol, price, marketCap, volume24h, description } = req.body;
    
    // Basic validation
    if (!name || !symbol || !price || !marketCap || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newCoin = {
      id: memecoins.length > 0 ? Math.max(...memecoins.map(c => c.id)) + 1 : 1,
      name,
      symbol,
      price: parseFloat(price),
      marketCap: parseFloat(marketCap),
      volume24h: parseFloat(volume24h || 0),
      description,
      createdAt: new Date().toISOString()
    };
    
    memecoins.push(newCoin);
    res.status(201).json(newCoin);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request body' });
  }
});

// Get a specific memecoin
app.get('/api/memecoins/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const memecoin = memecoins.find(c => c.id === id);
  
  if (memecoin) {
    res.json(memecoin);
  } else {
    res.status(404).json({ error: 'Memecoin not found' });
  }
});

// Get the king of the hill
app.get('/api/king', (req, res) => {
  const king = getKingOfTheHill();
  if (king) {
    res.json(king);
  } else {
    res.status(404).json({ error: 'No memecoins available' });
  }
});

// Invest in a memecoin
app.post('/api/ape', (req, res) => {
  try {
    const { coinId, amount } = req.body;
    
    // Basic validation
    if (!coinId || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid investment data' });
    }
    
    const coin = memecoins.find(c => c.id === coinId);
    if (!coin) {
      return res.status(404).json({ error: 'Memecoin not found' });
    }
    
    // Record the investment
    const newInvestment = {
      id: investments.length > 0 ? Math.max(...investments.map(i => i.id)) + 1 : 1,
      coinId,
      coinSymbol: coin.symbol,
      amount,
      price: coin.price,
      timestamp: new Date().toISOString()
    };
    
    investments.push(newInvestment);
    
    // Simulate market impact (very simplified)
    coin.price *= (1 + (amount / coin.marketCap) * 0.1);
    coin.marketCap += amount;
    coin.volume24h += amount;
    
    res.status(201).json(newInvestment);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request body' });
  }
});

// Get all investments
app.get('/api/investments', (req, res) => {
  res.json(investments);
});

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
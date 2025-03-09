const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

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
  return memecoins.reduce((king, coin) => 
    coin.marketCap > king.marketCap ? coin : king, memecoins[0]);
};

// Handle API requests
const handleApiRequest = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API endpoints
  if (pathname === '/api/memecoins' && req.method === 'GET') {
    // List all memecoins
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(memecoins));
  } 
  else if (pathname === '/api/memecoins' && req.method === 'POST') {
    // Create a new memecoin
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const newCoin = JSON.parse(body);
        newCoin.id = memecoins.length > 0 ? Math.max(...memecoins.map(c => c.id)) + 1 : 1;
        newCoin.createdAt = new Date().toISOString();
        memecoins.push(newCoin);
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newCoin));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request body' }));
      }
    });
  }
  else if (pathname.match(/\/api\/memecoins\/\d+/) && req.method === 'GET') {
    // Get a specific memecoin
    const id = parseInt(pathname.split('/').pop());
    const memecoin = memecoins.find(c => c.id === id);
    
    if (memecoin) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(memecoin));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Memecoin not found' }));
    }
  }
  else if (pathname === '/api/king' && req.method === 'GET') {
    // Get the king of the hill (highest market cap)
    const king = getKingOfTheHill();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(king));
  }
  else if (pathname === '/api/ape' && req.method === 'POST') {
    // Invest in a memecoin
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const investment = JSON.parse(body);
        const { coinId, amount } = investment;
        
        const coin = memecoins.find(c => c.id === coinId);
        if (!coin) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Memecoin not found' }));
          return;
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
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newInvestment));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request body' }));
      }
    });
  }
  else if (pathname === '/api/investments' && req.method === 'GET') {
    // Get all investments
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(investments));
  }
  else {
    // Handle unknown API endpoints
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  }
};

// Serve static files
const serveStaticFile = (res, filePath, contentType) => {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        res.writeHead(404);
        res.end('File not found');
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
};

// Create the server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // Handle API requests
  if (pathname.startsWith('/api/')) {
    handleApiRequest(req, res);
    return;
  }
  
  // Serve static files
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  
  // Determine the content type based on file extension
  const extname = path.extname(filePath);
  let contentType = 'text/html';
  
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
  }
  
  serveStaticFile(res, filePath, contentType);
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
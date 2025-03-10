# Pump.fun MCAP Server

A server for monitoring, creating, listing, and investing in memecoins. This application allows you to:

- Monitor memecoins
- Create new memecoins
- List all available memecoins
- Ape (invest) in memecoins
- Watch the king of the hill (top performing memecoin)

## Features

- **Monitor Memecoins**: Track price, market cap, and 24h volume of various memecoins
- **Create Memecoins**: Add your own memecoins to the ecosystem
- **List Memecoins**: View all available memecoins in a clean, organized interface
- **Ape Into Memecoins**: Invest in memecoins and see how they perform
- **King of the Hill**: See which memecoin currently has the highest market cap

## Installation

1. Make sure you have [Node.js](https://nodejs.org/) installed (version 14 or higher)
2. Clone this repository:
   ```
   git clone https://github.com/your-username/pumpfun-mcap-server.git
   cd pumpfun-mcap-server
   ```

## Running the Server

Simply run:

```
node server.js
```

The server will start on port 3000 by default. You can access the application by opening a browser and navigating to:

```
http://localhost:3000
```

## API Endpoints

The server provides the following API endpoints:

- `GET /api/memecoins` - Get all memecoins
- `POST /api/memecoins` - Create a new memecoin
- `GET /api/memecoins/:id` - Get a specific memecoin by ID
- `GET /api/king` - Get the king of the hill (highest market cap)
- `POST /api/ape` - Invest in a memecoin
- `GET /api/investments` - Get all investments

## Creating a Memecoin

To create a new memecoin, send a POST request to `/api/memecoins` with the following JSON structure:

```json
{
  "name": "Your Memecoin Name",
  "symbol": "YMC",
  "price": 0.00001,
  "marketCap": 1000000,
  "volume24h": 50000,
  "description": "Description of your memecoin"
}
```

## Investing in a Memecoin

To invest in a memecoin, send a POST request to `/api/ape` with the following JSON structure:

```json
{
  "coinId": 1,
  "amount": 1000
}
```

Where `coinId` is the ID of the memecoin you want to invest in, and `amount` is the dollar amount you want to invest.

## Project Structure

- `server.js` - The main server file that handles API requests and serves static files
- `index.html` - The main HTML file for the frontend
- `styles.css` - CSS for styling the frontend
- `script.js` - JavaScript for the frontend functionality

## Technologies Used

- **Backend**: Node.js with built-in http module
- **Frontend**: HTML, CSS, JavaScript
- **Data Storage**: In-memory (data is lost when the server restarts)

## Future Improvements

- Add persistent data storage (database)
- Implement user authentication
- Add real-time price updates
- Create a more sophisticated market simulation
- Add charts and historical data
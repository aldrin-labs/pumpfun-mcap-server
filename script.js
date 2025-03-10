// DOM Elements
const kingDisplay = document.getElementById('king-display');
const memecoinsList = document.getElementById('memecoins-list');
const investmentsList = document.getElementById('investments-list');
const refreshBtn = document.getElementById('refresh-btn');
const createCoinBtn = document.getElementById('create-coin-btn');
const createCoinSection = document.getElementById('create-coin-section');
const createCoinForm = document.getElementById('create-coin-form');
const cancelCreateBtn = document.getElementById('cancel-create');
const apeSection = document.getElementById('ape-section');
const apeForm = document.getElementById('ape-form');
const apeCoinName = document.getElementById('ape-coin-name');
const apeCoinId = document.getElementById('ape-coin-id');
const cancelApeBtn = document.getElementById('cancel-ape');

// API URLs
const API_BASE_URL = '';
const MEMECOINS_URL = `${API_BASE_URL}/api/memecoins`;
const KING_URL = `${API_BASE_URL}/api/king`;
const APE_URL = `${API_BASE_URL}/api/ape`;
const INVESTMENTS_URL = `${API_BASE_URL}/api/investments`;

// Fetch and display the king of the hill
async function fetchKing() {
    try {
        const response = await fetch(KING_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch king data');
        }
        
        const king = await response.json();
        displayKing(king);
    } catch (error) {
        console.error('Error fetching king:', error);
        kingDisplay.innerHTML = `<p>Error loading king data: ${error.message}</p>`;
    }
}

// Display king of the hill data
function displayKing(king) {
    if (!king) {
        kingDisplay.innerHTML = '<p>No memecoins available yet.</p>';
        return;
    }
    
    kingDisplay.innerHTML = `
        <h3>${king.name} (${king.symbol})</h3>
        <p class="memecoin-description">${king.description}</p>
        <div class="king-details">
            <div class="king-detail">
                <h4>Price</h4>
                <p>$${formatNumber(king.price)}</p>
            </div>
            <div class="king-detail">
                <h4>Market Cap</h4>
                <p>$${formatNumber(king.marketCap)}</p>
            </div>
            <div class="king-detail">
                <h4>24h Volume</h4>
                <p>$${formatNumber(king.volume24h)}</p>
            </div>
            <div class="king-detail">
                <h4>Created</h4>
                <p>${formatDate(king.createdAt)}</p>
            </div>
        </div>
    `;
}

// Fetch and display all memecoins
async function fetchMemecoins() {
    try {
        memecoinsList.innerHTML = '<p>Loading memecoins...</p>';
        
        const response = await fetch(MEMECOINS_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch memecoins');
        }
        
        const memecoins = await response.json();
        displayMemecoins(memecoins);
    } catch (error) {
        console.error('Error fetching memecoins:', error);
        memecoinsList.innerHTML = `<p>Error loading memecoins: ${error.message}</p>`;
    }
}

// Display list of memecoins
function displayMemecoins(memecoins) {
    if (!memecoins || memecoins.length === 0) {
        memecoinsList.innerHTML = '<p>No memecoins available yet.</p>';
        return;
    }
    
    const memecoinsHTML = memecoins.map(coin => `
        <div class="memecoin-card">
            <div class="memecoin-info">
                <div class="memecoin-name">${coin.name}</div>
                <div class="memecoin-symbol">${coin.symbol}</div>
                <div class="memecoin-description">${coin.description}</div>
                <div class="memecoin-stats">
                    <div class="memecoin-stat">Price: <span>$${formatNumber(coin.price)}</span></div>
                    <div class="memecoin-stat">Market Cap: <span>$${formatNumber(coin.marketCap)}</span></div>
                    <div class="memecoin-stat">24h Volume: <span>$${formatNumber(coin.volume24h)}</span></div>
                    <div class="memecoin-stat">Created: <span>${formatDate(coin.createdAt)}</span></div>
                </div>
            </div>
            <div class="memecoin-actions">
                <button class="ape-btn" data-id="${coin.id}" data-name="${coin.name}">Ape In!</button>
            </div>
        </div>
    `).join('');
    
    memecoinsList.innerHTML = memecoinsHTML;
    
    // Add event listeners to ape buttons
    document.querySelectorAll('.ape-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const coinId = parseInt(btn.getAttribute('data-id'));
            const coinName = btn.getAttribute('data-name');
            showApeForm(coinId, coinName);
        });
    });
}

// Fetch and display investments
async function fetchInvestments() {
    try {
        const response = await fetch(INVESTMENTS_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch investments');
        }
        
        const investments = await response.json();
        displayInvestments(investments);
    } catch (error) {
        console.error('Error fetching investments:', error);
        investmentsList.innerHTML = `<p>Error loading investments: ${error.message}</p>`;
    }
}

// Display list of investments
function displayInvestments(investments) {
    if (!investments || investments.length === 0) {
        investmentsList.innerHTML = '<p>No investments yet.</p>';
        return;
    }
    
    const investmentsHTML = investments.map(inv => `
        <div class="investment-card">
            <div class="investment-header">
                <div class="investment-symbol">${inv.coinSymbol}</div>
                <div class="investment-date">${formatDate(inv.timestamp)}</div>
            </div>
            <div class="investment-details">
                <div class="investment-detail">Amount: <span>$${formatNumber(inv.amount)}</span></div>
                <div class="investment-detail">Price at purchase: <span>$${formatNumber(inv.price)}</span></div>
                <div class="investment-detail">Coins purchased: <span>${formatNumber(inv.amount / inv.price)}</span></div>
            </div>
        </div>
    `).join('');
    
    investmentsList.innerHTML = investmentsHTML;
}

// Show the form to create a new memecoin
function showCreateForm() {
    createCoinSection.classList.remove('hidden');
    createCoinForm.reset();
}

// Hide the create memecoin form
function hideCreateForm() {
    createCoinSection.classList.add('hidden');
}

// Show the form to ape into a memecoin
function showApeForm(coinId, coinName) {
    apeSection.classList.remove('hidden');
    apeForm.reset();
    apeCoinId.value = coinId;
    apeCoinName.value = coinName;
}

// Hide the ape form
function hideApeForm() {
    apeSection.classList.add('hidden');
}

// Create a new memecoin
async function createMemecoin(event) {
    event.preventDefault();
    
    const newCoin = {
        name: document.getElementById('coin-name').value,
        symbol: document.getElementById('coin-symbol').value,
        price: parseFloat(document.getElementById('coin-price').value),
        marketCap: parseFloat(document.getElementById('coin-market-cap').value),
        volume24h: parseFloat(document.getElementById('coin-volume').value),
        description: document.getElementById('coin-description').value
    };
    
    try {
        const response = await fetch(MEMECOINS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCoin)
        });
        
        if (!response.ok) {
            throw new Error('Failed to create memecoin');
        }
        
        const createdCoin = await response.json();
        console.log('Created memecoin:', createdCoin);
        
        // Refresh data and hide form
        hideCreateForm();
        refreshData();
        
        alert(`Successfully created ${createdCoin.name} (${createdCoin.symbol})!`);
    } catch (error) {
        console.error('Error creating memecoin:', error);
        alert(`Error creating memecoin: ${error.message}`);
    }
}

// Ape into a memecoin
async function apeIntoMemecoin(event) {
    event.preventDefault();
    
    const investment = {
        coinId: parseInt(apeCoinId.value),
        amount: parseFloat(document.getElementById('ape-amount').value)
    };
    
    try {
        const response = await fetch(APE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(investment)
        });
        
        if (!response.ok) {
            throw new Error('Failed to ape into memecoin');
        }
        
        const createdInvestment = await response.json();
        console.log('Created investment:', createdInvestment);
        
        // Refresh data and hide form
        hideApeForm();
        refreshData();
        
        alert(`Successfully aped $${investment.amount} into ${apeCoinName.value}!`);
    } catch (error) {
        console.error('Error aping into memecoin:', error);
        alert(`Error aping into memecoin: ${error.message}`);
    }
}

// Refresh all data
function refreshData() {
    fetchKing();
    fetchMemecoins();
    fetchInvestments();
}

// Helper function to format numbers
function formatNumber(num) {
    if (num === undefined || num === null) return 'N/A';
    
    // For very small numbers (like crypto prices)
    if (num < 0.0001) {
        return num.toExponential(4);
    }
    
    // For normal numbers
    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 6
    }).format(num);
}

// Helper function to format dates
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initial data load
    refreshData();
    
    // Refresh button
    refreshBtn.addEventListener('click', refreshData);
    
    // Create coin button
    createCoinBtn.addEventListener('click', showCreateForm);
    
    // Cancel create button
    cancelCreateBtn.addEventListener('click', hideCreateForm);
    
    // Create coin form submission
    createCoinForm.addEventListener('submit', createMemecoin);
    
    // Cancel ape button
    cancelApeBtn.addEventListener('click', hideApeForm);
    
    // Ape form submission
    apeForm.addEventListener('submit', apeIntoMemecoin);
});
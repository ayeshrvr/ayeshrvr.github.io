// Configuration
const MAX_POINTS = 30; // 15 minutes of history at 30s intervals
let priceHistory = []; // Stores the last 30 price points

document.addEventListener('DOMContentLoaded', function() {
    // 1. Initialize the SVG dimensions
    initChartDimensions();
    
    // 2. Generate Sample Data (Simulating the last 15 mins of action)
    generateSampleData(66000, 67000); // Start price, Volatility range
    
    // 3. Initial Render
    renderGridChart();
    
    // 4. (Optional) Simulate a live update every 30 seconds
    setInterval(() => {
        // Mock a small price move
        const lastPrice = priceHistory[0];
        const nextPrice = lastPrice + (Math.random() * 200 - 100);
        updateGridChart(nextPrice, 62000, 68000);
    }, 30000); 
});

function initChartDimensions() {
    const svg = document.getElementById('live-chart') || document.querySelector('.price-sparkline-svg');
    if (svg) {
        // Set viewBox to a fixed coordinate system (0 to 1000 wide, 400 high)
        // This makes the math easier regardless of screen size
        svg.setAttribute('viewBox', '0 0 1000 400');
    }
}

function generateSampleData(startPrice, range) {
    // Fills the array with 30 points of random-walk data
    let current = startPrice;
    for (let i = 0; i < MAX_POINTS; i++) {
        current += (Math.random() * 150 - 75);
        priceHistory.push(current);
    }
}

/**
 * Main Render Function
 * @param {number} currentPrice - Latest price from API
 * @param {number} minGrid - Lower limit of the grid
 * @param {number} maxGrid - Upper limit of the grid
 */
function updateGridChart(currentPrice, minGrid, maxGrid) {
    // Add new price to the front, remove oldest from back
    priceHistory.unshift(currentPrice);
    if (priceHistory.length > MAX_POINTS) priceHistory.pop();
    
    renderGridChart(minGrid, maxGrid);
}

function renderGridChart(minGrid = 62000, maxGrid = 68000) {
    const svgWidth = 1000; // Match viewBox width
    const svgHeight = 400; // Match viewBox height
    const pathElement = document.getElementById('price-path');
    const fillElement = document.getElementById('price-fill');
    const headElement = document.getElementById('price-head');

    if (!pathElement) return;

    let points = [];
    
    priceHistory.forEach((price, i) => {
        // Calculate X: Newest (index 0) is at the right (1000), oldest at the left (0)
        let x = svgWidth - (i * (svgWidth / (MAX_POINTS - 1)));
        
        // Calculate Y: Normalized within the grid range
        let y = svgHeight - ((price - minGrid) / (maxGrid - minGrid) * svgHeight);
        
        // Clamp Y so it doesn't fly off the card
        y = Math.max(10, Math.min(y, svgHeight - 10));
        
        points.push(`${x},${y}`);
        
        // Update the Floating Price Bubble (only for the newest point at index 0)
        if (i === 0 && headElement) {
            // Convert coordinate to percentage for CSS positioning
            headElement.style.top = (y - 15) + "px"; 
            headElement.innerHTML = `${Math.floor(price).toLocaleString()} <i class="material-icons tiny">navigation</i>`;
        }
    });

    // Create the "D" string for the SVG Path
    const dString = "M " + points.join(" L ");
    pathElement.setAttribute('d', dString);

    // Create the Fill Area (Closed loop to the bottom)
    const fillString = dString + ` L 0,${svgHeight} L ${svgWidth},${svgHeight} Z`;
    if (fillElement) fillElement.setAttribute('d', fillString);
}
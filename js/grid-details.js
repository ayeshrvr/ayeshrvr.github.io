// Configuration
const MAX_POINTS = 30; 
let priceHistory = []; 

// Mock Data for Binding Reference
const activeGrid = {
    sells: [68000, 67500, 67000, 66500],
    buys: [65500, 65000, 64500, 64000],
    min: 63500,
    max: 68500,
    stats: {
        capital: 500.00,
        volatility: "High",
        performance: "+2.4%",
        trades: 142,
        avgProfit: 0.85,
        efficiency: "84.2%"
    }
};

document.addEventListener('DOMContentLoaded', function() {
    initChartDimensions();
    generateSampleData(66000);
    renderGridChart(activeGrid.min, activeGrid.max);
    bindPerformanceStats();
    
    setInterval(() => {
        const lastPrice = priceHistory[0];
        const nextPrice = lastPrice + (Math.random() * 200 - 100);
        updateGridChart(nextPrice, activeGrid.min, activeGrid.max);
    }, 30000); 
});

function initChartDimensions() {
    const svg = document.getElementById('live-chart');
    if (svg) svg.setAttribute('viewBox', '0 0 1000 400');
}

function generateSampleData(startPrice) {
    let current = startPrice;
    for (let i = 0; i < MAX_POINTS; i++) {
        current += (Math.random() * 150 - 75);
        priceHistory.push(current);
    }
}

function updateGridChart(currentPrice, minGrid, maxGrid) {
    priceHistory.unshift(currentPrice);
    if (priceHistory.length > MAX_POINTS) priceHistory.pop();
    renderGridChart(minGrid, maxGrid);
}

function renderGridChart(minGrid, maxGrid) {
    const svgWidth = 1000, svgHeight = 400;
    const pathElement = document.getElementById('price-path');
    const fillElement = document.getElementById('price-fill');
    const headElement = document.getElementById('price-head');
    const gridGroup = document.getElementById('grid-levels-group');
    const labelContainer = document.getElementById('grid-labels-container');

    if (gridGroup) gridGroup.innerHTML = '';
    if (labelContainer) labelContainer.innerHTML = '';

    activeGrid.sells.forEach(p => drawGridLine(p, 'sell', minGrid, maxGrid));
    activeGrid.buys.forEach(p => drawGridLine(p, 'buy', minGrid, maxGrid));

    let points = [];
    priceHistory.forEach((price, i) => {
        let x = svgWidth - (i * (svgWidth / (MAX_POINTS - 1)));
        let y = svgHeight - ((price - minGrid) / (maxGrid - minGrid) * svgHeight);
        y = Math.max(10, Math.min(y, svgHeight - 10));
        points.push(`${x},${y}`);
        
        if (i === 0 && headElement) {
            headElement.style.top = (y - 15) + "px";
            headElement.innerHTML = `${Math.floor(price).toLocaleString()} <i class="material-icons tiny">navigation</i>`;
        }
    });

    const dString = "M " + points.join(" L ");
    pathElement.setAttribute('d', dString);
    if (fillElement) fillElement.setAttribute('d', dString + ` L 0,${svgHeight} L ${svgWidth},${svgHeight} Z`);
}

function drawGridLine(price, type, minGrid, maxGrid) {
    const gridGroup = document.getElementById('grid-levels-group');
    const labelContainer = document.getElementById('grid-labels-container');
    let y = 400 - ((price - minGrid) / (maxGrid - minGrid) * 400);
    const color = type === 'sell' ? '#ef5350' : '#26a69a';

    if (gridGroup) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", "0"); line.setAttribute("y1", y);
        line.setAttribute("x2", "100%"); line.setAttribute("y2", y);
        line.setAttribute("stroke", color); line.setAttribute("stroke-dasharray", "4,4");
        line.setAttribute("opacity", "0.4");
        gridGroup.appendChild(line);
    }

    if (labelContainer) {
        const label = document.createElement("span");
        label.className = `price-tag ${type}`;
        label.style.top = `${(y / 400) * 100}%`;
        label.innerText = price.toLocaleString();
        labelContainer.appendChild(label);
    }
}

function bindPerformanceStats() {
    document.getElementById('capital-allocated').innerText = `$${activeGrid.stats.capital.toFixed(2)}`;
    document.getElementById('vol-category').innerText = activeGrid.stats.volatility;
    document.getElementById('grid-perf').innerText = activeGrid.stats.performance;
    document.getElementById('trades-completed').innerText = activeGrid.stats.trades;
    document.getElementById('avg-profit').innerText = `$${activeGrid.stats.avgProfit.toFixed(2)}`;
    document.getElementById('grid-efficiency').innerText = activeGrid.stats.efficiency;
}
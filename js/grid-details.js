/**
 * grid-details.js - Live Grid Visualization
 */
let detailChart;

document.addEventListener('DOMContentLoaded', () => {
    if (window.supabaseClient) {
        initGridDetails();
    } else {
        window.addEventListener('supabaseReady', initGridDetails);
    }
});

async function initGridDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const symbol = urlParams.get('coin') || 'INJ/USDT';
    
    // Initial Data Load
    await refreshGridDetails(symbol);

    // Real-time subscription for this specific coin
    window.supabaseClient
        .channel(`details-${symbol}`)
        .on('postgres_changes', { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'active_grids',
            filter: `symbol=eq.${symbol}` 
        }, payload => {
            renderPage(payload.new);
        })
        .subscribe();
}

async function refreshGridDetails(symbol) {
    const { data, error } = await window.supabaseClient
        .from('active_grids')
        .select('*')
        .eq('symbol', symbol)
        .single();

    if (!error && data) renderPage(data);
}

function renderPage(grid) {
    const data = grid.grid_data;

    // 1. Update Header (Symbol, Price, and Limits)
    document.getElementById('coin-symbol').innerText = grid.symbol;
    document.getElementById('current-price-header').innerText = `$${data.current_price}`;
    document.getElementById('upper-limit-label').innerText = formatSmartPrice(data.range.upper, data.current_price);
    document.getElementById('lower-limit-label').innerText = formatSmartPrice(data.range.lower, data.current_price);

    // 2. Update Performance Insights
    document.getElementById('grid-perf').innerText = data.insights.avg_profit;
    document.getElementById('vol-category').innerText = data.insights.volatility;
    document.getElementById('trades-completed').innerText = data.counters.total_filled_today;
    document.getElementById('efficiency-percent').innerText = data.insights.efficiency;

    // 3. Render Chart with 8 Open Orders
    updateChart(data);
}

function updateChart(data) {
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    const annotations = {};
    // Loop through the 8 open orders from the JSON
    data.open_orders.forEach((order, i) => {
        const isBuy = order.side === 'buy';
        const formattedPrice = formatSmartPrice(order.price, data.current_price);
        annotations[`line${i}`] = {
            type: 'line',
            yMin: order.price,
            yMax: order.price,
            borderColor: isBuy ? 'rgba(38, 166, 154, 0.4)' : 'rgba(239, 83, 80, 0.4)',
            borderWidth: 1,
            borderDash: [5, 5],
            label: {
                display: true,
                content: `$${formattedPrice}`,
                position: 'end',
                backgroundColor: isBuy ? '#26a69a' : '#ef5350',
                font: { size: 9 }
            }
        };
    });

    if (detailChart) detailChart.destroy();

    detailChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.chart_data.map((_, i) => i),
            datasets: [{
                data: data.chart_data,
                borderColor: '#1A3263',
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                annotation: { annotations: annotations }
            },
            scales: {
                y: { position: 'right', grid: { display: false } },
                x: { display: false }
            }
        }
    });
}

/**
 * Formats a value to match the decimal precision of a reference price.
 * @param {number|string} value - The price/amount to format (e.g., an open order price)
 * @param {number|string} referencePrice - The benchmark price (e.g., current_price)
 */
function formatSmartPrice(value, referencePrice) {
    const num = Number(value);
    const ref = Number(referencePrice);

    if (isNaN(num)) return value;

    // 1. Handle whole numbers (e.g., 1200)
    if (Number.isInteger(num) && (ref && Number.isInteger(ref))) {
        return num.toLocaleString(); 
    }

    // 2. Determine precision of the reference price
    // We convert to string and count digits after the decimal point
    const refString = ref.toString();
    let precision = 0;
    if (refString.includes('.')) {
        precision = refString.split('.')[1].length;
    } else if (ref > 100) {
        precision = 2; // Default for high-value coins if no decimals found
    } else {
        precision = 5; // Default for low-value coins
    }

    // 3. Return the value formatted to that specific precision
    return num.toFixed(precision);
}
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
    document.getElementById('upper-limit-label').innerText = data.range.upper;
    document.getElementById('lower-limit-label').innerText = data.range.lower;

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
        annotations[`line${i}`] = {
            type: 'line',
            yMin: order.price,
            yMax: order.price,
            borderColor: isBuy ? 'rgba(38, 166, 154, 0.4)' : 'rgba(239, 83, 80, 0.4)',
            borderWidth: 1,
            borderDash: [5, 5],
            label: {
                display: true,
                content: order.price,
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
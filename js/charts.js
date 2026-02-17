const ctx = document.getElementById('tradingChart').getContext('2d');

// Sample data from your Supabase cell
const chartJsonString = '{"coin": "BTC/USDT", "last_updated": "13:45:01", "history": [69120.5, 69135.2, 69110.8, 69140.0, 69155.3, 69140.1, 69130.4, 69125.9, 69115.2, 69110.0, 69105.7, 69120.3, 69130.8, 69145.2, 69150.0]}';

const supabaseData = JSON.parse(chartJsonString);

const myChart = new Chart(ctx, {
    type: 'line', // Trading type usually starts with line or candlestick
    data: {
        labels: Array.from({length: 15}, (_, i) => `${(14-i)*30}s ago`),
        datasets: [{
            label: supabaseData.coin,
            data: supabaseData.history,
            borderColor: '#00ff00', // Crypto green
            tension: 0.1,
            fill: false
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { beginAtZero: false } // Crucial for crypto prices
        }
    }
});
document.addEventListener('DOMContentLoaded', function() {
    initEquityChart();
    initDailyProfitChart();
    initCoinDistChart();
});

function initEquityChart() {
    const ctx = document.getElementById('equityChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Feb 1', 'Feb 5', 'Feb 10', 'Feb 15', 'Feb 20', 'Feb 23'],
            datasets: [{
                label: 'Balance',
                data: [450, 480, 475, 510, 505, 542],
                borderColor: '#1A3263',
                backgroundColor: 'rgba(26, 50, 99, 0.05)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: false }, x: { grid: { display: false } } }
        }
    });
}

function initDailyProfitChart() {
    const ctx = document.getElementById('dailyProfitChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            datasets: [{
                data: [12, 19, -5, 8, 15, 10, 22],
                backgroundColor: (context) => {
                    const value = context.dataset.data[context.dataIndex];
                    return value > 0 ? '#26a69a' : '#ef5350'; // Using your success/danger colors
                },
                borderRadius: 5
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { y: { display: false }, x: { grid: { display: false } } }
        }
    });
}

function initCoinDistChart() {
    const ctx = document.getElementById('coinDistChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['BTC', 'ETH', 'SOL'],
            datasets: [{
                data: [60, 25, 15],
                backgroundColor: ['#1A3263', '#547792', '#FAB95B'] // Using your primary/secondary/title colors
            }]
        },
        options: {
            cutout: '70%',
            plugins: { legend: { position: 'right', labels: { boxWidth: 10 } } }
        }
    });
}
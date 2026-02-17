const ctx = document.getElementById('tradingChart').getContext('2d');
let myChart;

fetch_chart_data();
setInterval(fetch_chart_data, 30000);

function fetch_chart_data() {
$.ajax({
      // We filter the query directly in the URL: ?username=eq.VALUE&password=eq.VALUE
      url: `${SB_URL}/rest/v1/positions?id=eq.${1}&select=*`,
      method: "GET",
      headers: {
          "apikey": SB_KEY,
          "Authorization": `Bearer ${SB_KEY}`,
          "Content-Type": "application/json"
      },
      success: function(data) {
          // 2. Check if a matching user was found
          if (data.length > 0) {
              // Success: Save user info to LocalStorage so they stay logged in
              updateChartUI(data[0].chart_data);
          }
      },
      error: function(err) {
           alert("Error fetching chart data from Supabase: " + err.responseText);
      }
  });
}

function updateChartUI(supabaseData) {
const endTime = new Date(supabaseData.last_updated);
const labels = [];

for (let i = 14; i >= 0; i--) {
    // Subtract 30 seconds for each previous slot
    const tick = new Date(endTime.getTime() - (i * 30000));
    // Format as HH:mm:ss
    labels.push(tick.toLocaleTimeString([], { hour12: false }));
}

    if (!myChart) {
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels, // Your 15 timestamps
                datasets: [{
                    label: 'BTC/USDT',
                    data: supabaseData.history,
                    borderColor: '#00ff00',
                    fill: false
                }]
            },
            options: {
                responsive: true,           // Tells chart to resize with window
                maintainAspectRatio: false, // Allows chart to change shape (portrait vs landscape)
                scales: {
                    x: {
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 6 // Prevents overlapping labels on small mobile screens
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: window.innerWidth > 600 // Hide legend on small mobile screens to save space
                    }
                }
            }
        });
    } else {
        myChart.data.datasets[0].data = supabaseData.history;
        myChart.data.datasets[0].label = supabaseData.coin;
        myChart.update();
    }
    $("#msg").text(supabaseData.msg); // Update message below chart
}
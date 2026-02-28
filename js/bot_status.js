/**
 * bot_status.js - Handles real-time Dashboard Header and System Health
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize once Supabase is ready
    if (window.supabaseClient) {
        initBotStatus();
    } else {
        window.addEventListener('supabaseReady', initBotStatus);
    }
});

async function initBotStatus() {
    // 1. Initial Load from DB
    await refreshBotStatus();

    // 2. Subscribe to Real-time Updates
    window.supabaseClient
        .channel('bot-health-status')
        .on('postgres_changes', { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'bot_status' 
        }, payload => {
            updateDashboardUI(payload.new);
        })
        .subscribe();
}

/**
 * Fetches the current state of the bot on page load
 */
async function refreshBotStatus() {
    const { data, error } = await window.supabaseClient
        .from('bot_status')
        .select('*')
        .single(); // Since we only have one row with ID 0000...

    if (!error && data) {
        updateDashboardUI(data);
    }
}

/**
 * Updates the HTML elements identified in index.html
 */
function updateDashboardUI(status) {
    // 1. Update Balance and PNL
    const balanceH2 = document.querySelector('.balance-card h2');
    const pnlDiv = document.querySelector('.balance-card .green-text');

    if (balanceH2) {
        balanceH2.innerText = `$${Number(status.total_balance).toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    }

    if (pnlDiv) {
        const isPos = status.today_pnl >= 0;
        pnlDiv.className = isPos ? 'green-text text-accent-3 strong' : 'red-text text-lighten-2 strong';
        pnlDiv.innerHTML = `${isPos ? '+' : ''}$${status.today_pnl} (${status.today_pnl_perc}%) <small class="white-text">Today</small>`;
    }

    // 2. Update Status Indicators (Bot Running)
    const botDot = document.getElementById('bot-dot');
    const botText = botDot?.nextElementSibling;
    
    if (botDot && botText) {
        const isRunning = status.is_running;
        botDot.className = `btn-floating btn-small waves-effect waves-light ${isRunning ? 'green' : 'red'} pulse`;
        botText.innerText = isRunning ? 'BOT RUNNING' : 'BOT OFFLINE';
    }

    // 3. Update Trading Status
    const tradingDot = document.getElementById('trading-dot');
    const tradingText = tradingDot?.previousElementSibling;

    if (tradingDot && tradingText) {
        const isTrading = status.is_trading;
        tradingDot.className = `btn-floating btn-small waves-effect waves-light ${isTrading ? 'blue' : 'orange'} pulse`;
        tradingText.innerText = isTrading ? 'TRADING ON' : 'TRADING OFF';
    }

    // 4. Update "Updated" Timestamp
    const timeDisplay = document.querySelector('#status-container + .grey-text');
    if (timeDisplay) {
        timeDisplay.innerText = `Updated: ${new Date(status.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    }
}
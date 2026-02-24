/**
 * activeGrids.js - Multi-Page Edition
 */
document.addEventListener('DOMContentLoaded', () => {
    if (window.supabaseClient) {
        initGridSystem();
    } else {
        window.addEventListener('supabaseReady', initGridSystem);
    }
});

async function initGridSystem() {
    // 1. Use the globally initialized client
    // 2. Call the correct functions (renamed to match the multi-page logic)
    await refreshGridData(); 
    setupSubscription();
}

async function refreshGridData() {
    const { data, error } = await window.supabaseClient
        .from('active_grids')
        .select('*');
    
    if (error) {
        console.error("Error fetching data:", error);
        return;
    }
    
    if (data) renderUI(data);
}

function setupSubscription() {
    window.supabaseClient
        .channel('grid_global_sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'active_grids' }, () => {
            refreshGridData();
        })
        .subscribe();
}

function renderUI(grids) {
    // 1. Handle Dashboard Summary
    const dashboardContainer = document.getElementById('active-grids-list');
    if (dashboardContainer) renderDashboardList(grids, dashboardContainer);

    // 2. Handle Grid Status Overview
    const statusContainer = document.getElementById('grid-status-container');
    if (statusContainer) renderStatusOverview(grids, statusContainer);
}

// --- Dashboard Rendering ---
function renderDashboardList(grids, container) {
    if (!grids || grids.length === 0) {
        container.innerHTML = `
            <div class="center-align grey-text" style="padding: 20px;">
                <i class="material-icons large">info_outline</i>
                <p>No active grids running at the moment.</p>
            </div>`;
        return;
    }
    container.innerHTML = grids.map(grid => {
        const data = grid.grid_data;
        const symbolId = grid.symbol.replace('/', '');
        
        return `
            <div class="grid-item" style="padding: 10px 0; border-top: 1px solid #f0f0f0;">
                <div class="row mb-0 valign-wrapper">
                    <div class="col s7">
                        <span class="fw-bold blue-grey-text text-darken-4">${grid.symbol}</span>
                        <span class="${getOneMinVariation(data.chart_data).colorClass}" style="font-size: 0.8rem; margin-left: 5px;">$${data.current_price || 0}</span>
                        <br>
                        <span class="${getOneMinVariation(data.chart_data).colorClass}" style="font-size: 0.75rem;">${getOneMinVariation(data.chart_data).icon} ${getOneMinVariation(data.chart_data).text}</span>
                    </div>
                    <div class="col s5 right-align">
                        <span class="green-text fw-bold">+$${grid.pnl_24h || '0.00'}</span>
                        <br>
                        <span class="score-badge">SCORE: ${grid.score || 0}</span>
                    </div>
                </div>
                <div class="row mb-0" style="margin-top: 8px;">
                    <div class="col s12 grey-text" style="font-size: 0.75rem;">
                        <i class="material-icons tiny" style="vertical-align: middle;">list</i> 
                        ${data.counters?.buy_orders || 0}B / ${data.counters?.sell_orders || 0}S | 
                        ${data.counters?.total_filled_today || 0} Filled
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// --- Grid Status Overview Rendering (The Progress Bar View) ---
function renderStatusOverview(grids, container) {
    if (!grids || grids.length === 0) {
        container.innerHTML = `
            <div class="center-align grey-text" style="padding: 20px;">
                <i class="material-icons large">info_outline</i>
                <p>No active grids running at the moment.</p>
            </div>`;
        return;
    }

    container.innerHTML = grids.map(grid => {
        const data = grid.grid_data;
        
        // 1. Total Safety Range (The Grey Track)
        const totalMin = data.range.lower;
        const totalMax = data.range.upper;
        const totalSpan = totalMax - totalMin;

        // 2. Active Grid Range (The Blue Bar)
        // If your bot doesn't send these yet, we'll fallback to a 20% width around price
        const activeMin = data.range.active_lower || (data.current_price - (totalSpan * 0.1));
        const activeMax = data.range.active_upper || (data.current_price + (totalSpan * 0.1));

        // 3. Calculate Styles
        const leftVal = ((activeMin - totalMin) / totalSpan) * 100;
        const widthVal = ((activeMax - activeMin) / totalSpan) * 100;

        return `
            <div class="card white card-soft waves-effect grid-main-row" onclick="location.href='grid-details.html?coin=${grid.symbol}'" style="display: block; width: 100%; margin-bottom: 15px;">
                <div class="card-content" style="padding: 15px;">
                    <div class="row mb-5 valign-wrapper">
                        <div class="col s6">
                            <span class="asset-name">${grid.symbol}</span>
                            <span class="status-pill status-active" style="margin-left: 10px;">Active</span>
                        </div>
                        <div class="col s6 right-align">
                            <span class="pnl-text green-text">+$${grid.pnl_24h || '0.00'}</span>
                        </div>
                    </div>

                    <div class="row mb-5">
                        <div class="col s6">
                            <span class="stat-label">Price:</span> <span class="fw-bold ${getOneMinVariation(data.chart_data).colorClass}">$${data.current_price}</span>
                        </div>
                        <div class="col s6 right-align">
                            <span class="score-badge">SCORE: ${grid.score}</span>
                        </div>
                    </div>

                    <div class="progress grey lighten-4" style="height: 4px; margin: 10px 0;">
                        <div class="determinate blue" style="width: ${widthVal}%; left: ${leftVal}%"></div>
                    </div>
                    
                    <div class="row mb-0" style="font-size: 0.75rem; color: #757575;">
                        <div class="col s4">Range: ${formatSmartPrice(data.range.lower, data.current_price)} - ${formatSmartPrice(data.range.upper, data.current_price)}</div>
                        <div class="col s4 center-align">Orders: ${data.counters.buy_orders}B / ${data.counters.sell_orders}S</div>
                        <div class="col s4 right-align">Filled Today: ${data.counters.total_filled_today}</div>
                    </div>
                </div>
            </div>`;
    }).join('');
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

/**
 * Calculates 1m variation based on the last two points of chart_data
 * @param {Array} chartData - The array of prices from your JSON
 * @returns {Object} - Returns the percentage string and the appropriate CSS class
 */
function getOneMinVariation(chartData) {
    if (!chartData || chartData.length < 2) {
        return { text: "0.00%", colorClass: "grey-text", icon: "" };
    }

    const current = chartData[chartData.length - 1];
    const previous = chartData[chartData.length - 2];
    
    // Calculate percentage change
    const change = ((current - previous) / previous) * 100;
    const isPositive = change >= 0;
    
    return {
        text: `${Math.abs(change).toFixed(2)}% 1m`,
        colorClass: isPositive ? "green-text" : "red-text",
        icon: isPositive ? "↑" : "↓"
    };
}
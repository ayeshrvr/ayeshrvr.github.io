/**
 * activeGrids.js - Dashboard Edition
 * Dynamically renders the 'Active Grids' list based on Supabase data
 */

let supabaseClient;
const gridContainerId = 'active-grids-list'; // The ID in your index.html

document.addEventListener('DOMContentLoaded', () => {
    initDashboardGrids();
});

async function initDashboardGrids() {
    if (typeof supabase !== 'undefined' && typeof SB_URL !== 'undefined') {
        supabaseClient = supabase.createClient(SB_URL, SB_KEY);
        
        // Initial Fetch
        await refreshDashboardList();
        
        // Realtime Subscription
        setupDashboardSubscription();
    }
}

async function refreshDashboardList() {
    const { data, error } = await supabaseClient
        .from('active_grids')
        .select('*');

    if (!error) {
        renderGridList(data);
    }
}

function setupDashboardSubscription() {
    supabaseClient
        .channel('dashboard_sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'active_grids' }, () => {
            // On any change (insert, update, delete), refresh the whole list to keep it simple
            refreshDashboardList();
        })
        .subscribe();
}

function renderGridList(grids) {
    const container = document.getElementById(gridContainerId);
    if (!container) return;

    if (!grids || grids.length === 0) {
        container.innerHTML = `
            <div class="center-align grey-text" style="padding: 20px;">
                <i class="material-icons large">info_outline</i>
                <p>No active grids running at the moment.</p>
            </div>`;
        return;
    }

    // Map through grids and create the HTML based on your index.html structure
    container.innerHTML = grids.map(grid => {
        const data = grid.grid_data;
        const symbolId = grid.symbol.replace('/', '');
        
        return `
            <div class="grid-item" style="padding: 10px 0; border-top: 1px solid #f0f0f0;">
                <div class="row mb-0 valign-wrapper">
                    <div class="col s7">
                        <span class="fw-bold blue-grey-text text-darken-4">${grid.symbol}</span>
                        <span class="grey-text" style="font-size: 0.8rem; margin-left: 5px;">$${data.current_price || 0}</span>
                        <br>
                        <span class="green-text" style="font-size: 0.75rem;">↑ 0.5% 24h</span>
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
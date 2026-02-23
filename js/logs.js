/**
 * logs.js - Bot Manager Real-time Logger (Latest at Top)
 */

let supabaseClient;

document.addEventListener('DOMContentLoaded', () => {
    initSupabase();
    
    // UI Filter Chip Logic
    const chips = document.querySelectorAll('.chip.clickable');
    chips.forEach(chip => {
        chip.addEventListener('click', function() {
            chips.forEach(c => c.classList.remove('blue', 'white-text'));
            chips.forEach(c => c.classList.add('grey', 'lighten-3'));
            this.classList.remove('grey', 'lighten-3');
            this.classList.add('blue', 'white-text');
        });
    });
});

async function initSupabase() {
    if (typeof supabase !== 'undefined' && typeof SB_URL !== 'undefined') {
        supabaseClient = supabase.createClient(SB_URL, SB_KEY);
        
        const container = document.getElementById('log-container');
        if (container) container.innerHTML = ''; 
        
        await fetchInitialLogs();
        setupRealtimeSubscription();
        
        const statusLabel = document.getElementById('log-status');
        if (statusLabel) statusLabel.innerText = "LIVE FEED ACTIVE";
    }
}

async function fetchInitialLogs() {
    // We fetch newest first
    const { data, error } = await supabaseClient
        .from('bot_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);

    if (data) {
        // We do NOT reverse here; we want the newest to be rendered first at the top
        data.forEach(log => renderLog(log, false));
    }
}

function setupRealtimeSubscription() {
    supabaseClient
        .channel('public:bot_logs')
        .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'bot_logs' 
        }, payload => {
            // Newest database insert goes to the top
            renderLog(payload.new, true);
        })
        .subscribe();
}

function renderLog(log, isNew) {
    const container = document.getElementById('log-container');
    if (!container) return;

    const time = new Date(log.timestamp).toLocaleTimeString([], { 
        hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' 
    });
    
    let icon = "info_outline";
    let colorClass = "blue-text";
    
    if (log.category === 'trade') {
        icon = log.side === 'buy' ? 'add_shopping_cart' : 'monetization_on';
        colorClass = log.side === 'buy' ? 'orange-text' : 'green-text';
    } else if (log.level === 'error') {
        icon = 'report_problem';
        colorClass = 'red-text';
    }

    const logHTML = `
        <div class="log-card ${isNew ? 'new-log-anim' : ''}" style="border-radius: 8px; background: #fff; padding: 12px; margin-bottom: 10px; border: 1px solid #f0f0f0;">
            <div class="log-row" style="display: flex; gap: 12px; align-items: flex-start;">
                <i class="material-icons ${colorClass}" style="font-size: 20px; margin-top: 2px;">${icon}</i>
                <div class="log-content" style="flex-grow: 1;">
                    <div class="log-top-bar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                        <span style="font-weight: 800; font-size: 0.75rem; color: #1a3263;">${log.symbol || 'SYSTEM'}</span>
                        <span style="font-size: 0.7rem; color: #bbb;">${time}</span>
                    </div>
                    <div style="font-size: 0.85rem; color: #444;">${log.message}</div>
                </div>
            </div>
        </div>
    `;

    // THE KEY CHANGE: Use 'afterbegin' to put new items at the top
    container.insertAdjacentHTML('afterbegin', logHTML);
    
    // If it's a new log, we scroll to top instead of bottom
    if (isNew) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
/**
 * notifications.js - Global Badge & List Handler
 */

document.addEventListener('DOMContentLoaded', () => {
    if (window.supabaseClient) {
        startNotificationLogic();
    } else {
        window.addEventListener('supabaseReady', startNotificationLogic);
    }
});

async function startNotificationLogic() {
    // 1. Always sync the badge count for the navbar
    await syncUnreadCount();
    
    // 2. If we are on the notifications.html page, load the list
    const listContainer = document.getElementById('notifications-list');
    if (listContainer) {
        await renderNotificationList(listContainer);
        // Mark as read after user has seen them
        setTimeout(markAllAsRead, 3000);
    }
    
    // 3. Listen for real-time updates
    subscribeToNotifications();
}

/**
 * Syncs the navbar badge count
 */
async function syncUnreadCount() {
    if (!window.supabaseClient) return;

    const { count, error } = await window.supabaseClient
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

    if (!error) updateBadgeUI(count);
}

/**
 * Fetches and renders the list for notifications.html
 * Sorts: Unread first, then by newest date
 */
async function renderNotificationList(container) {
    const { data: notifications, error } = await window.supabaseClient
        .from('notifications')
        .select('*')
        .order('is_read', { ascending: true })
        .order('created_at', { ascending: false });

    if (error) {
        container.innerHTML = `<p class="center red-text">Error loading alerts.</p>`;
        return;
    }

    if (!notifications || notifications.length === 0) {
        container.innerHTML = `<div class="center grey-text" style="padding:40px;">No notifications yet.</div>`;
        return;
    }

    container.innerHTML = notifications.map(notif => {
        const time = new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const date = new Date(notif.created_at).toLocaleDateString();
        const unreadClass = notif.is_read ? '' : 'unread-notif';
        const icon = notif.type === 'success' ? 'check_circle' : notif.type === 'warning' ? 'warning' : 'info';

        return `
            <div class="col s12">
                <div class="card card-soft ${unreadClass}" style="margin-bottom: 10px;">
                    <div class="card-content" style="padding: 15px;">
                        <div class="valign-wrapper" style="align-items: flex-start;">
                            <i class="material-icons ${notif.type}-text" style="margin-right: 15px; margin-top:5px;">${icon}</i>
                            <div style="width: 100%;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span class="fw-bold" style="font-size: 1rem; color: #1a3263;">${notif.title}</span>
                                    <span class="grey-text" style="font-size: 0.7rem;">${time} | ${date}</span>
                                </div>
                                <p class="grey-text text-darken-1" style="font-size: 0.85rem; margin-top: 5px;">
                                    ${notif.message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    }).join('');
}

/**
 * Real-time Subscription
 */
function subscribeToNotifications() {
    window.supabaseClient
        .channel('global-notifications')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, (payload) => {
            syncUnreadCount();
            
            // If user is currently looking at the list, refresh it
            const listContainer = document.getElementById('notifications-list');
            if (listContainer) renderNotificationList(listContainer);
        })
        .subscribe();
}

/**
 * Badge UI Update
 */
function updateBadgeUI(count) {
    const badge = document.getElementById('notification-badge');
    if (!badge) return;

    if (count > 0) {
        badge.innerText = count > 9 ? '9+' : count;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

/**
 * DB Update: Mark as Read
 */
async function markAllAsRead() {
    await window.supabaseClient
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);
    
    updateBadgeUI(0);
}
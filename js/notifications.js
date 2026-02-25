/**
 * notifications.js - Global Badge, List Handler, and System Pop-ups
 */

document.addEventListener('DOMContentLoaded', () => {
    if (window.supabaseClient) {
        startNotificationLogic();
    } else {
        window.addEventListener('supabaseReady', startNotificationLogic);
    }
});

/**
 * Request permission via a user gesture (call this from a button click)
 */
async function requestNotificationPermission() {
    if (!("Notification" in window)) {
        M.toast({html: 'Notifications not supported on this browser'});
        return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        M.toast({html: 'Alerts Enabled!'});
        // Send a test notification immediately to confirm
        new Notification("Notifications Active", {
            body: "You will now receive live bot alerts.",
            icon: '/img/logo.png'
        });
    } else {
        M.toast({html: 'Alerts Blocked. Check browser settings.'});
    }
}

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
 * Real-time Subscription with Pop-up Logic
 */
function subscribeToNotifications() {
    window.supabaseClient
        .channel('global-notifications')
        .on('postgres_changes', { 
            event: 'INSERT', // Only trigger pop-ups on NEW entries
            schema: 'public', 
            table: 'notifications' 
        }, (payload) => {
            const newNotif = payload.new;
            
            // 1. Update UI Badge
            syncUnreadCount();
            
            // 2. Trigger System Pop-up
            showSystemNotification(newNotif.title, newNotif.message);
            
            // 3. Refresh list if on notifications page
            const listContainer = document.getElementById('notifications-list');
            if (listContainer) renderNotificationList(listContainer);
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'notifications' }, () => {
            syncUnreadCount(); // Sync badge if items are marked as read elsewhere
        })
        .subscribe();
}

/**
 * Handles the actual system-level alert
 */
function showSystemNotification(title, message) {
    if (Notification.permission === "granted") {
        const options = {
            body: message,
            icon: '/img/logo.png',
            badge: '/img/icons/badge-72x72.png', // Small icon for Android status bar
            vibrate: [200, 100, 200],
            tag: 'bot-alert' // Prevents flooding by replacing old notifications with new ones
        };
        
        // If app is in background, use Service Worker if available
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, options);
            });
        } else {
            // Fallback for standard browser tab
            new Notification(title, options);
        }
    }
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
        const unreadClass = notif.is_read ? '' : 'unread-notif'; //
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
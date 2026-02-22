function addLogEntry(type, message) {
    const container = document.getElementById('log-container');
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    
    const tagMap = { system: 'SYS', fill: 'FILL', grid: 'GRID', error: 'ERR' };
    
    entry.innerHTML = `
        <span class="log-time">${time}</span>
        <span class="log-tag">${tagMap[type]}</span>
        <span class="log-msg">${message}</span>
    `;
    
    container.appendChild(entry);
    
    // Auto-scroll logic
    if (document.getElementById('autoScrollToggle').checked) {
        container.scrollTop = container.scrollHeight;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all collapsible (accordion) elements
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems, {
        accordion: true // Set to false if you want multiple sections open at once
    });
});

function toggleCustomSettings(show) {
    const customArea = document.getElementById('custom-settings-area');
    if (show) {
        customArea.style.display = 'block';
    } else {
        customArea.style.display = 'none';
    }
}

function toggleVisibility(id) {
    const input = document.getElementById(id);
    const icon = input.nextElementSibling;
    if (input.type === "password") {
        input.type = "text";
        icon.innerText = "visibility_off";
    } else {
        input.type = "password";
        icon.innerText = "visibility";
    }
}

function runTestConnection() {
    const btn = document.getElementById('test-connection-btn');
    const text = document.getElementById('btn-text');
    const loader = document.getElementById('btn-loader');
    const status = document.getElementById('connection-status');

    // Show Loader
    text.innerText = "TESTING...";
    loader.style.display = "inline-block";
    btn.disabled = true;

    // Simulate API Call
    setTimeout(() => {
        loader.style.display = "none";
        text.innerText = "TEST CONNECTION";
        btn.disabled = false;
        
        // Show Success Result
        status.innerText = "Connection Successful: Binance API Active";
        status.className = "status-text success-text mt-10";
        status.style.display = "block";
    }, 2000);
}

function toggleApiEnvironment(isDemo) {
    const liveKeys = document.getElementById('live-api-keys');
    const demoKeys = document.getElementById('demo-api-keys');
    const envLabel = document.getElementById('env-label');
    const testBtn = document.getElementById('test-connection-btn');

    if (isDemo) {
        liveKeys.style.display = 'none';
        demoKeys.style.display = 'block';
        envLabel.innerText = "DEMO TESTNET ACTIVE";
        envLabel.className = "helper-text d-block orange-text text-darken-3 fw-600";
        testBtn.className = "btn orange darken-3 waves-effect btn-block";
    } else {
        liveKeys.style.display = 'block';
        demoKeys.style.display = 'none';
        envLabel.innerText = "LIVE EXCHANGE ACTIVE";
        envLabel.className = "helper-text d-block blue-text fw-600";
        testBtn.className = "btn blue darken-3 waves-effect btn-block";
    }
}
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
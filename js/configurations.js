document.addEventListener('DOMContentLoaded', function() {
    // Initialize all collapsible (accordion) elements
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems, {
        accordion: true // Set to false if you want multiple sections open at once
    });
});
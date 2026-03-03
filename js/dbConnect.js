const SB_URL = "https://wlzggfirqntjhmedxybn.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsemdnZmlycW50amhtZWR4eWJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNjcyNTYsImV4cCI6MjA4NTk0MzI1Nn0.009xOJfRI9FNBjxHqxGjLMJ2iHqBaoQw0UzL8i0DFZs";

// 2. The Singleton Instance
//let supabaseClient; 

// Initialization Logic
if (typeof supabase !== 'undefined') {
    if (!window.supabaseClient) {
        // Explicitly pass the key here
        window.supabaseClient = supabase.createClient(SB_URL, SB_KEY, {
            auth: {
                persistSession: false // Recommended for simple bot PWAs
            }
        });
        console.log("Supabase Singleton Initialized with Key");
        window.dispatchEvent(new CustomEvent('supabaseReady'));
    }
} else {
    console.error("Supabase library not found! Check your CDN script tag.");
}
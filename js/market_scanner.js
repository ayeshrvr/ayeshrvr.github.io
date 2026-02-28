/**
 * newsTicker.js - Fetches free crypto news without API keys
 */

async function initNewsTicker() {
    const marqueeContainer = document.getElementById('news-marquee');
    if (!marqueeContainer) return;

    try {
        // Fetching from a free, no-key-required aggregator
        const response = await fetch('https://free-crypto-news.vercel.app/api/news?limit=10');
        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
            renderMarquee(data.articles, marqueeContainer);
        }
    } catch (error) {
        console.error("News Fetch Error:", error);
        marqueeContainer.innerHTML = "<span>Market news currently unavailable</span>";
    }
}

function renderMarquee(articles, container) {
    // We map each article to a link that opens in a new tab
    const newsHtml = articles.map(item => {
        return `
            <a href="${item.link}" target="_blank" class="white-text" style="text-decoration: none; margin-right: 50px;">
                <span class="orange-text text-lighten-2 fw-bold">[${item.source}]</span> 
                ${item.title}
            </a>
        `;
    }).join('');

    // Injecting into the marquee
    container.innerHTML = `<marquee scrollamount="4" onmouseover="this.stop();" onmouseout="this.start();">
        ${newsHtml}
    </marquee>`;
}

// Start the ticker
document.addEventListener('DOMContentLoaded', initNewsTicker);
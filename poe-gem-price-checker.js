const axios = require('axios');

/**
 * Path of Exile Gem Price Checker
 * 
 * This script fetches your stash gems and compares their prices with poe.ninja market data.
 * It calculates the price difference between your current gem and a level 20 gem with max quality.
 * 
 * Usage:
 * - Set your league name, account name, session ID, and stash tab index.
 * - Run the script with Node.js.
 * 
 * Note: You need a valid POESESSID and account name to access your stash data.
 */

// Settings
const league = 'Mercenaries';
const accountName = 'YOUR_ACCOUNT_NAME'; // <-- Replace with your account name
const sessionId = 'YOUR_SESSION_ID';     // <-- Replace with your POESESSID
const tabIndex = 12;

// Fetch gem prices from poe.ninja
async function fetchGemPrices() {
    const url = `https://poe.ninja/api/data/itemoverview?league=${league}&type=SkillGem`;
    const res = await axios.get(url);
    return res.data.lines;
}

// Fetch gems from your stash tab
async function fetchStashGems() {
    const url = `https://www.pathofexile.com/character-window/get-stash-items?league=${league}&tabs=1&tabIndex=${tabIndex}&accountName=${accountName}`;
    const res = await axios.get(url, {
        headers: {
            Cookie: `POESESSID=${sessionId}`,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
        }
    });
    return res.data.items.filter(item => item.typeLine && item.frameType === 4);
}

// Get price for a gem with specific level and quality
function getGemPrice(prices, gemName, level, quality) {
    return prices.find(gem =>
        gem.name === gemName &&
        gem.gemLevel === level &&
        gem.gemQuality === quality
    )?.chaosValue || null;
}

// Main process
(async () => {
    const prices = await fetchGemPrices();
    const gems = await fetchStashGems();

    const result = gems
        .map(gem => {
            const name = gem.typeLine.replace(/ \(.*\)/, '');
            let quality = 0;
            if (gem.properties) {
                const qualityProp = gem.properties.find(p => p.name === 'Quality');
                if (qualityProp && qualityProp.values && qualityProp.values[0] && qualityProp.values[0][0]) {
                    quality = Number(qualityProp.values[0][0].replace(/[^0-9]/g, '')) || 0;
                }
            }
            const corrupted = gem.corrupted || false;

            let level = 1;
            const levelProp = gem.properties?.find(p => p.name === 'Level');
            if (levelProp && levelProp.values && levelProp.values[0] && levelProp.values[0][0]) {
                level = Number(levelProp.values[0][0].replace(/[^0-9]/g, '')) || 1;
            } else if (gem.level) {
                level = Number(gem.level) || 1;
            }

            if (level < 1 || level >= 20) return null;

            let targetQuality = corrupted ? quality : 20;
            let priceLv20 = getGemPrice(prices, name, 20, targetQuality);
            if (typeof priceLv20 === 'number') priceLv20 = Math.ceil(priceLv20);

            let priceCurrent = null;
            if (quality === 0) {
                priceCurrent = getGemPrice(prices, name, 1, 20);
                if (priceCurrent === null) {
                    priceCurrent = getGemPrice(prices, name, 1, 23);
                }
                if (priceCurrent === null) {
                    priceCurrent = getGemPrice(prices, name, 1, 0);
                }
            } else if (quality >= 1 && quality < 20) {
                if (corrupted) {
                    priceCurrent = getGemPrice(prices, name, 1, 0);
                } else {
                    priceCurrent = getGemPrice(prices, name, 1, 20);
                }
            } else if (quality === 20 || quality === 23) {
                priceCurrent = getGemPrice(prices, name, 1, quality);
            }
            if (typeof priceCurrent === 'number') priceCurrent = Math.ceil(priceCurrent);

            let diff = (typeof priceLv20 === 'number' && typeof priceCurrent === 'number')
                ? priceLv20 - priceCurrent
                : null;

            return {
                'Gem Name': name,
                'Lv20 Price': priceLv20,
                'Current Price': priceCurrent,
                'Difference': diff,
                'Quality': quality,
                'Quality Needed': corrupted ? 0 : 20 - quality,
                'Levels Left': 20 - level,
                'Corrupted': corrupted ? 'Yes' : 'No'
            };
        })
        .filter(Boolean)
        .sort((a, b) => (b['Lv20 Price'] ?? 0) - (a['Lv20 Price'] ?? 0));

    console.table(result);
})();
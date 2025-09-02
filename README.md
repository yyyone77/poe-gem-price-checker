# Path of Exile Gem Price Checker

This Node.js script fetches your stash gems from Path of Exile and compares their prices with poe.ninja market data.  
It calculates the price difference between your current gem and a level 20 gem with max quality, helping you decide which gems are worth leveling or upgrading.

## Features

- Fetches your stash tab gems using official Path of Exile API.
- Gets current market prices for gems from poe.ninja.
- Calculates price difference between your gem and a level 20, max quality version.
- Outputs results in a table format.

## How to Use

### 1. Prerequisites

- [Node.js](https://nodejs.org/) installed.
- [axios](https://www.npmjs.com/package/axios) package installed:
  ```
  npm install axios
  ```
- Your Path of Exile account name.
- Your POESESSID (session ID) cookie value.
- The stash tab index you want to check (starts from 0).
- Your league name (e.g. `Mercenaries`).

### 2. Setup

1. Download or copy `poe-gem-price-checker.js` to your PC.
2. Open the script in a text editor.
3. Edit these lines near the top:
   ```javascript
   const league = 'Mercenaries';         // Your league name
   const accountName = 'YOUR_ACCOUNT_NAME'; // <-- Replace with your account name
   const sessionId = 'YOUR_SESSION_ID';     // <-- Replace with your POESESSID
   const tabIndex = 12;                     // <-- Replace with your stash tab index
   ```
   - **accountName**: Your Path of Exile account name (not your character name).
   - **sessionId**: Your POESESSID value (from browser cookies, while logged in).
   - **tabIndex**: The stash tab index you want to check (first tab is 0).
   - **league**: Your current league name.

### 3. How to Get Your POESESSID

1. Log in to [pathofexile.com](https://www.pathofexile.com/) in your browser.
2. Open browser developer tools (F12).
3. Go to the "Application" or "Storage" tab.
4. Find the `POESESSID` cookie value and copy it.

### 4. Run the Script

Open a terminal in the folder containing the script and run:

```
node poe-gem-price-checker.js
```

### 5. View Results

- The script will print a table showing:
  - Gem name
  - Price for level 20, max quality version
  - Your current gem's price
  - Price difference
  - Quality and levels left
  - Whether the gem is corrupted

## Notes

- Your POESESSID is sensitive. Do not share it.
- The script only checks one stash tab at a time.
- Prices are fetched from poe.ninja and may change frequently.
- Only works for Skill Gems (frameType === 4).

## Troubleshooting

- If you get a "Forbidden" or "Unauthorized" error, check your POESESSID and account name.
- Make sure your stash tab is public or you are logged in.
- If gems are missing, check your tab index and

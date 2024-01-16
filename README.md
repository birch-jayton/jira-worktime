<div align="center">
<h1>Jira - time worked</h1>
<img width="870" alt="Screenshot 2024-01-16 at 11 17 44 AM" src="https://github.com/birch-jayton/jira-worktime/assets/22551809/baa4b926-9a20-44c5-ad8b-429e3b3f7091">
</div>

## Installation <a name="installation"></a>
You need npm.

### For Chrome: <a name="chrome"></a>

1. Edit the src/config.js file with your instance and username
2. Run:
    - Dev: `pnpm dev` or `npm run dev`
    - Prod: `pnpm build` or `npm run build`
2. Open in browser - `chrome://extensions`
3. Check - `Developer mode`
4. Find and Click - `Load unpacked extension`
5. Select - `dist` folder

### For Firefox: <a name="firefox"></a>

1. Edit the src/config.js file with your instance and username
2. Run:
    - Dev: `pnpm dev:firefox` or `npm run dev:firefox`
    - Prod: `pnpm build:firefox` or `npm run build:firefox`
2. Open in browser - `about:debugging#/runtime/this-firefox`
3. Find and Click - `Load Temporary Add-on...`
4. Select - `manifest.json` from `dist` folder

## This is a janky solution that may not work perfectly 

# Installation Instructions

## AI Chat Status Notifier v0.0.5

This extension works with **ChatGPT**, **Claude**, and **Perplexity** to notify you when the AI finishes typing.

---

## Firefox Installation

### Option 1: Install XPI file (Temporary - for testing)

1. Download `ai_chat_status_notifier-0.0.5.xpi` from the `web-ext-artifacts` folder
2. Open Firefox
3. Navigate to `about:debugging#/runtime/this-firefox`
4. Click "Load Temporary Add-on..."
5. Select the `.xpi` file
6. The extension will be installed temporarily (until you restart Firefox)

### Option 2: Install ZIP file

1. Download `ai_chat_status_notifier-0.0.5.zip` from the `web-ext-artifacts` folder
2. Follow the same steps as Option 1, but select the `.zip` file instead

**Note:** For permanent installation, you'll need to sign the extension through Mozilla or use Firefox Developer Edition with signing disabled.

---

## Microsoft Edge (and Chrome) Installation

### Install as Unpacked Extension

1. Download `ai_chat_status_notifier-edge-0.0.5.zip` from the `web-ext-artifacts` folder
2. Extract the ZIP file to a permanent location on your computer (don't delete this folder!)
3. Open Microsoft Edge
4. Navigate to `edge://extensions/`
5. Enable "Developer mode" toggle in the left sidebar
6. Click "Load unpacked"
7. Select the extracted folder
8. The extension will be installed

**For Chrome:** Same process, but navigate to `chrome://extensions/` instead

**Important Notes:**
- Keep the extracted folder - if you delete it, the extension will stop working
- The extension uses the `chrome` API instead of `browser` API for compatibility
- You may see a "Developer mode extension" warning - this is normal for unpacked extensions

---

## Testing the Extension

1. After installation, pin the extension to your toolbar
2. Visit one of the supported sites:
   - https://chat.openai.com (ChatGPT)
   - https://claude.ai (Claude)
   - https://www.perplexity.ai (Perplexity)
3. Start a conversation with the AI
4. Watch the extension icon:
   - Shows "..." while the AI is typing
   - Shows "!" when the AI finishes
   - Plays a sound (if enabled in options)

---

## Configuration

Click the extension icon to:
- Toggle sound notifications on/off
- Access the Options page for more settings

---

## Files Included

- **Firefox:**
  - `ai_chat_status_notifier-0.0.5.xpi` - Firefox extension file
  - `ai_chat_status_notifier-0.0.5.zip` - Alternative Firefox format

- **Edge/Chrome:**
  - `ai_chat_status_notifier-edge-0.0.5.zip` - Edge/Chrome extension (uses `chrome` API)

---

## Troubleshooting

**Extension not detecting AI responses?**
- Make sure you're on one of the supported sites
- Try refreshing the page after installing the extension
- Check the browser console for any errors (F12 → Console)

**Sound not playing?**
- Click the extension icon and make sure the "Sound" checkbox is checked
- Check your browser's sound permissions
- Make sure your system volume is not muted

**Edge/Chrome specific issues?**
- Make sure Developer Mode is enabled
- Don't delete the extracted folder
- Try reloading the extension from `edge://extensions/`

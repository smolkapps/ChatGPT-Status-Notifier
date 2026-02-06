// Author: Michael Smolkin
// Date: 2023-05-08
// License: MIT

/**
 * Waits for a certain element to appear on the page before allowing code to execute.
 * @param {string} selector - The CSS selector of the element to wait for.
 * @param {number} timeout - Maximum time to wait in milliseconds (default: 10000)
 * @returns {Promise} - A promise that resolves when the element is found on the page, or rejects on timeout.
 */
function waitFor(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const startTime = Date.now();
    const intervalId = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(intervalId);
        resolve(element);
      } else if (Date.now() - startTime >= timeout) {
        clearInterval(intervalId);
        reject(new Error(`Timeout waiting for element: ${selector}`));
      }
    }, 100);
  });
}

/**
 * Detect which AI platform we're on
 * @returns {string} - 'chatgpt', 'claude', or 'perplexity'
 */
function detectPlatform() {
    const hostname = window.location.hostname;
    if (hostname.includes('openai.com')) return 'chatgpt';
    if (hostname.includes('claude.ai')) return 'claude';
    if (hostname.includes('perplexity.ai')) return 'perplexity';
    return 'unknown';
}

/**
 * Check if ChatGPT is typing
 * @returns {boolean} - true if generating, false otherwise
 */
function checkChatGPTTyping() {
    const buttons = document.querySelectorAll("button");
    let gptGeneratingButton;

    if (buttons && buttons.length > 0) {
        for (let button of buttons) {
            const text = button.innerText || button.textContent;
            // Check for the specific button text to ensure we find the right button
            if (text === 'Stop generating') {
                gptGeneratingButton = button;
                break;
            }
        }
    }

    // If not generating, check for "Regenerate response" button to confirm idle state
    if (!gptGeneratingButton) {
        for (let button of buttons) {
            const text = button.innerText || button.textContent;
            if (text === 'Regenerate response') {
                // Found regenerate button, meaning it's not generating
                return false;
            }
        }
    }

    if (gptGeneratingButton) {
        const isGenerating = gptGeneratingButton.innerText === 'Stop generating' ||
                           gptGeneratingButton.textContent === 'Stop generating';
        return isGenerating;
    }

    return false;
}

/**
 * Check if Claude is typing
 * @returns {boolean} - true if generating, false otherwise
 */
function checkClaudeTyping() {
    // Claude shows a "Stop" button when generating
    const stopButton = document.querySelector('button[aria-label="Stop"]');
    if (stopButton && stopButton.offsetParent !== null) {
        return true;
    }

    // Also check for the typing indicator
    const typingIndicator = document.querySelector('[data-test-render-type="streaming"]');
    if (typingIndicator) {
        return true;
    }

    return false;
}

/**
 * Check if Perplexity is typing
 * @returns {boolean} - true if generating, false otherwise
 */
function checkPerplexityTyping() {
    // Perplexity shows a stop button when generating
    const stopButton = document.querySelector('button[aria-label="Stop generating"]');
    if (stopButton && stopButton.offsetParent !== null) {
        return true;
    }

    // Check for streaming indicator
    const streamingDiv = document.querySelector('div[class*="streaming"]');
    if (streamingDiv) {
        return true;
    }

    return false;
}

/**
 * Notifies the user whether the AI is still generating a response.
 * Works for ChatGPT, Claude, and Perplexity.
 */
var checkWhetherAITyping = function () {
    const platform = detectPlatform();
    let isGenerating = false;

    switch(platform) {
        case 'chatgpt':
            isGenerating = checkChatGPTTyping();
            break;
        case 'claude':
            isGenerating = checkClaudeTyping();
            break;
        case 'perplexity':
            isGenerating = checkPerplexityTyping();
            break;
        default:
            console.warn('Unknown platform:', window.location.hostname);
            return;
    }

    // Send a message to the background script
    browser.runtime.sendMessage({
        type: "updateGeneratingState",
        data: isGenerating
    });
}

// Call update function every 500ms
setInterval(checkWhetherAITyping, 500);
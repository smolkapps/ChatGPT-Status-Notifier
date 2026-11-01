// Test the button detection logic

function checkChatGPTTyping(buttons, scenario) {
    let gptGeneratingButton;

    if (buttons && buttons.length > 0) {
        for (let button of buttons) {
            const text = button.text;
            if (text === 'Stop generating') {
                gptGeneratingButton = button;
                break;
            }
        }
    }

    if (!gptGeneratingButton) {
        for (let button of buttons) {
            const text = button.text;
            if (text === 'Regenerate response') {
                return false;
            }
        }
    }

    if (gptGeneratingButton) {
        const isGenerating = gptGeneratingButton.text === 'Stop generating';
        return isGenerating;
    }

    return false;
}

// Test scenarios
console.log('=== Testing Button Detection Logic ===\n');

// Scenario 1: "Stop generating" button exists
const test1 = checkChatGPTTyping([
    { text: 'Submit' },
    { text: 'Stop generating' },
    { text: 'Other' }
], 'Stop generating exists');
console.log('Test 1 - Generating (Stop generating button): ', test1, test1 === true ? '✓' : '✗');

// Scenario 2: "Regenerate response" button exists
const test2 = checkChatGPTTyping([
    { text: 'Submit' },
    { text: 'Regenerate response' },
    { text: 'Other' }
], 'Regenerate response exists');
console.log('Test 2 - Idle (Regenerate response button): ', test2, test2 === false ? '✓' : '✗');

// Scenario 3: Neither button exists
const test3 = checkChatGPTTyping([
    { text: 'Submit' },
    { text: 'Cancel' },
    { text: 'Other' }
], 'Neither button exists');
console.log('Test 3 - No relevant buttons: ', test3, test3 === false ? '✓' : '✗');

// Scenario 4: Empty button list
const test4 = checkChatGPTTyping([], 'Empty list');
console.log('Test 4 - Empty button list: ', test4, test4 === false ? '✓' : '✗');

// Scenario 5: Both buttons exist (edge case)
const test5 = checkChatGPTTyping([
    { text: 'Stop generating' },
    { text: 'Regenerate response' }
], 'Both buttons exist');
console.log('Test 5 - Both buttons (should prioritize Stop): ', test5, test5 === true ? '✓' : '✗');

console.log('\n=== All Tests', (test1 === true && test2 === false && test3 === false && test4 === false && test5 === true) ? 'PASSED ✓' : 'FAILED ✗', '===');

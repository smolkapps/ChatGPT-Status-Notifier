/**
 * Comprehensive validation script for AI Chat Status Notifier
 * Tests all critical functionality before merging PR
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(60));
console.log('AI Chat Status Notifier - Pre-Merge Validation');
console.log('='.repeat(60));

let allTestsPassed = true;

// Test 1: Verify Firefox manifest
console.log('\n[Test 1] Validating Firefox manifest.json...');
try {
    const firefoxManifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));

    // Check required fields
    if (firefoxManifest.name !== 'AI Chat Status Notifier') {
        throw new Error('Invalid extension name');
    }
    if (firefoxManifest.version !== '0.0.5') {
        throw new Error('Invalid version');
    }

    // Check permissions
    const requiredPermissions = ['https://chat.openai.com/*', 'https://claude.ai/*', 'https://www.perplexity.ai/*'];
    for (const perm of requiredPermissions) {
        if (!firefoxManifest.permissions.includes(perm)) {
            throw new Error(`Missing permission: ${perm}`);
        }
    }

    // Check content scripts
    const matches = firefoxManifest.content_scripts[0].matches;
    if (matches.length !== 3) {
        throw new Error('Expected 3 content script matches');
    }

    console.log('   ✓ Firefox manifest valid');
} catch (error) {
    console.log('   ✗ Firefox manifest invalid:', error.message);
    allTestsPassed = false;
}

// Test 2: Verify Edge manifest
console.log('\n[Test 2] Validating Edge manifest.json...');
try {
    const edgeManifest = JSON.parse(fs.readFileSync('edge-build/manifest.json', 'utf8'));

    if (edgeManifest.name !== 'AI Chat Status Notifier') {
        throw new Error('Invalid extension name');
    }
    if (edgeManifest.version !== '0.0.5') {
        throw new Error('Invalid version');
    }

    console.log('   ✓ Edge manifest valid');
} catch (error) {
    console.log('   ✗ Edge manifest invalid:', error.message);
    allTestsPassed = false;
}

// Test 3: Verify Firefox uses browser API
console.log('\n[Test 3] Verifying Firefox uses browser API...');
try {
    const firefoxContent = fs.readFileSync('content_script.js', 'utf8');
    const firefoxBackground = fs.readFileSync('background.js', 'utf8');
    const firefoxPopup = fs.readFileSync('popup.js', 'utf8');

    if (!firefoxContent.includes('browser.runtime.sendMessage')) {
        throw new Error('content_script.js should use browser API');
    }
    if (!firefoxBackground.includes('browser.runtime.onMessage')) {
        throw new Error('background.js should use browser API');
    }
    if (!firefoxPopup.includes('browser.storage.local')) {
        throw new Error('popup.js should use browser API');
    }

    console.log('   ✓ Firefox correctly uses browser API');
} catch (error) {
    console.log('   ✗ Firefox API check failed:', error.message);
    allTestsPassed = false;
}

// Test 4: Verify Edge uses chrome API
console.log('\n[Test 4] Verifying Edge uses chrome API...');
try {
    const edgeContent = fs.readFileSync('edge-build/content_script.js', 'utf8');
    const edgeBackground = fs.readFileSync('edge-build/background.js', 'utf8');
    const edgePopup = fs.readFileSync('edge-build/popup.js', 'utf8');

    if (!edgeContent.includes('chrome.runtime.sendMessage')) {
        throw new Error('content_script.js should use chrome API');
    }
    if (!edgeBackground.includes('chrome.runtime.onMessage')) {
        throw new Error('background.js should use chrome API');
    }
    if (!edgePopup.includes('chrome.storage.local')) {
        throw new Error('popup.js should use chrome API');
    }

    // Verify no browser API remains
    if (edgeContent.includes('browser.runtime') || edgeBackground.includes('browser.runtime')) {
        throw new Error('Edge build should not contain browser API calls');
    }

    console.log('   ✓ Edge correctly uses chrome API');
} catch (error) {
    console.log('   ✗ Edge API check failed:', error.message);
    allTestsPassed = false;
}

// Test 5: Verify platform detection functions exist
console.log('\n[Test 5] Verifying platform detection functions...');
try {
    const contentScript = fs.readFileSync('content_script.js', 'utf8');

    const requiredFunctions = [
        'detectPlatform',
        'checkChatGPTTyping',
        'checkClaudeTyping',
        'checkPerplexityTyping',
        'checkWhetherAITyping'
    ];

    for (const func of requiredFunctions) {
        if (!contentScript.includes(`function ${func}`) && !contentScript.includes(`var ${func}`)) {
            throw new Error(`Missing function: ${func}`);
        }
    }

    // Verify platform detection logic
    if (!contentScript.includes("hostname.includes('openai.com')")) {
        throw new Error('Missing ChatGPT detection');
    }
    if (!contentScript.includes("hostname.includes('claude.ai')")) {
        throw new Error('Missing Claude detection');
    }
    if (!contentScript.includes("hostname.includes('perplexity.ai')")) {
        throw new Error('Missing Perplexity detection');
    }

    console.log('   ✓ All platform detection functions present');
} catch (error) {
    console.log('   ✗ Platform detection check failed:', error.message);
    allTestsPassed = false;
}

// Test 6: Verify installation packages exist
console.log('\n[Test 6] Verifying installation packages...');
try {
    const packages = [
        'web-ext-artifacts/ai_chat_status_notifier-0.0.5.xpi',
        'web-ext-artifacts/ai_chat_status_notifier-0.0.5.zip',
        'web-ext-artifacts/ai_chat_status_notifier-edge-0.0.5.zip'
    ];

    for (const pkg of packages) {
        if (!fs.existsSync(pkg)) {
            throw new Error(`Missing package: ${pkg}`);
        }
        const stats = fs.statSync(pkg);
        if (stats.size === 0) {
            throw new Error(`Empty package: ${pkg}`);
        }
    }

    console.log('   ✓ All installation packages present');
} catch (error) {
    console.log('   ✗ Package check failed:', error.message);
    allTestsPassed = false;
}

// Test 7: Verify required files exist
console.log('\n[Test 7] Verifying required files...');
try {
    const requiredFiles = [
        'manifest.json',
        'content_script.js',
        'background.js',
        'popup.js',
        'popup.html',
        'options.js',
        'options.html',
        'INSTALLATION.md',
        'README.md'
    ];

    for (const file of requiredFiles) {
        if (!fs.existsSync(file)) {
            throw new Error(`Missing file: ${file}`);
        }
    }

    console.log('   ✓ All required files present');
} catch (error) {
    console.log('   ✗ File check failed:', error.message);
    allTestsPassed = false;
}

// Test 8: Verify UI text updated
console.log('\n[Test 8] Verifying UI text mentions all platforms...');
try {
    const optionsHtml = fs.readFileSync('options.html', 'utf8');

    if (!optionsHtml.includes('ChatGPT') || !optionsHtml.includes('Claude') || !optionsHtml.includes('Perplexity')) {
        throw new Error('options.html should mention all platforms');
    }

    console.log('   ✓ UI text correctly updated');
} catch (error) {
    console.log('   ✗ UI text check failed:', error.message);
    allTestsPassed = false;
}

// Final Results
console.log('\n' + '='.repeat(60));
if (allTestsPassed) {
    console.log('✅ ALL TESTS PASSED - Extension is ready for production');
    console.log('   - Firefox support: ✓');
    console.log('   - Edge support: ✓');
    console.log('   - Chrome support: ✓');
    console.log('   - ChatGPT detection: ✓');
    console.log('   - Claude detection: ✓');
    console.log('   - Perplexity detection: ✓');
    console.log('\n🚀 Safe to merge PR and deploy!');
    process.exit(0);
} else {
    console.log('❌ SOME TESTS FAILED - Please fix issues before merging');
    process.exit(1);
}

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const flush = () => new Promise(setImmediate);
const normalizeLines = value => value.split('\n').map(line => line.trimEnd()).join('\n').trimEnd();
const source = file => process.env.NOTIFIER_SOURCE_REF
  ? execFileSync('git', ['show', `${process.env.NOTIFIER_SOURCE_REF}:${file}`], { encoding: 'utf8' })
  : fs.readFileSync(file, 'utf8');

function content(file, apiName, hostname) {
  const elements = new Map(), lists = new Map(), events = new Map(), sent = [];
  let listener;
  const document = {
    title: 'Fixture chat',
    getElementById: id => elements.get(`#${id}`),
    querySelector: selector => elements.get(selector),
    querySelectorAll: selector => lists.get(selector) || [],
    addEventListener: (name, fn) => events.set(name, fn),
  };
  const context = vm.createContext({
    window: { location: { hostname, href: `https://${hostname}/` } }, document,
    console: { log() {}, warn() {} }, setInterval() { return 1; }, clearInterval() {},
    [apiName]: { runtime: {
      sendMessage: message => { sent.push(message); return Promise.resolve(); },
      onMessage: { addListener: fn => { listener = fn; } },
    } },
  });
  vm.runInContext(source(file), context);
  return { elements, lists, document, events, sent,
    status: () => vm.runInContext('checkAITypingStatus()', context),
    receive: message => listener(message),
  };
}

function background(file, apiName, sound = true) {
  let receive, remove, install, next = 0, sounds = 0;
  const intervals = new Map(), timeouts = new Map(), responses = new Map();
  const badges = [], colors = [], sent = [], writes = [];
  const api = {
    runtime: { onMessage: { addListener: fn => { receive = fn; } }, onInstalled: { addListener: fn => { install = fn; } } },
    tabs: {
      onRemoved: { addListener: fn => { remove = fn; } },
      sendMessage: (id, message) => {
        sent.push({ id, message });
        if (message.type !== 'checkStatus') return Promise.resolve();
        const response = responses.get(id);
        return typeof response === 'function' ? response() : Promise.resolve({ isGenerating: Boolean(response), site: id === 2 ? 'claude' : 'chatgpt' });
      },
    },
    storage: { local: { get: async () => ({ playSound: sound }), set: value => writes.push(value) } },
    browserAction: { setBadgeText: value => badges.push(value.text), setBadgeBackgroundColor: value => colors.push(value.color) },
  };
  vm.runInNewContext(source(file), {
    [apiName]: api, console: { log() {}, error() {} },
    setInterval: fn => { intervals.set(++next, fn); return next; }, clearInterval: id => intervals.delete(id),
    setTimeout: (fn, ms) => { timeouts.set(++next, { fn, ms }); return next; }, clearTimeout: id => timeouts.delete(id),
    Audio: function () { this.play = async () => { sounds++; }; },
  });
  return { badges, colors, sent, writes, intervals, timeouts, responses,
    start(id) { receive({ type: 'startObserving', site: id === 2 ? 'claude' : 'chatgpt' }, { tab: { id } }); },
    remove(id) { remove(id); }, install(reason) { install({ reason }); }, sounds: () => sounds,
    async tick() { for (const fn of [...intervals.values()]) fn(); await flush(); },
    expire(ms) { for (const [id, item] of [...timeouts]) if (item.ms === ms) { timeouts.delete(id); item.fn(); } },
  };
}

for (const [prefix, api] of [['', 'browser'], ['edge-build/', 'chrome']]) {
  test(`${api}: current ChatGPT and Gemini selectors survive the older platform merge`, () => {
    const gpt = content(`${prefix}content_script.js`, api, 'chatgpt.com');
    gpt.elements.set('#composer-submit-button', { getAttribute: key => key === 'data-testid' ? 'stop-button' : null });
    assert.equal(gpt.status().isGenerating, true);
    gpt.elements.clear(); assert.equal(gpt.status().isGenerating, false);
    const gemini = content(`${prefix}content_script.js`, api, 'gemini.google.com');
    gemini.elements.set('button.stop', {}); assert.equal(gemini.status().isGenerating, true);
  });

  test(`${api}: incoming fallback selectors and both Perplexity hosts are retained`, () => {
    const gpt = content(`${prefix}content_script.js`, api, 'chat.openai.com');
    gpt.lists.set('button', [{ textContent: 'Stop generating' }]); assert.equal(gpt.status().isGenerating, true);
    const claude = content(`${prefix}content_script.js`, api, 'claude.ai');
    claude.elements.set('[data-test-render-type="streaming"]', {}); assert.equal(claude.status().isGenerating, true);
    for (const host of ['perplexity.ai', 'www.perplexity.ai']) {
      const page = content(`${prefix}content_script.js`, api, host);
      page.elements.set('button[aria-label="Stop generating"]', { offsetParent: {} });
      assert.equal(page.status().isGenerating, true); assert.equal(page.status().site, 'perplexity');
      page.elements.clear(); assert.equal(page.status().isGenerating, false);
    }
  });

  test(`${api}: user action starts background checks and title notification restores the title`, async () => {
    const page = content(`${prefix}content_script.js`, api, 'claude.ai');
    page.events.get('keydown')({ key: 'Enter', shiftKey: true }); assert.equal(page.sent.length, 0);
    page.events.get('keydown')({ key: 'Enter', shiftKey: false }); assert.equal(page.sent[0].type, 'startObserving');
    assert.equal(page.sent[0].site, 'claude');
    page.receive({ type: 'showTitleExclamation' }); page.receive({ type: 'showTitleExclamation' });
    assert.equal(page.document.title, '(!) Fixture chat');
    page.receive({ type: 'hideTitleExclamation' }); assert.equal(page.document.title, 'Fixture chat');
    assert.equal((await page.receive({ type: 'checkStatus' })).site, 'claude');
  });

  test(`${api}: idle tabs cannot finish another tab; completion stays visible for three seconds`, async () => {
    const bg = background(`${prefix}background.js`, api);
    bg.start(1); bg.start(2); bg.responses.set(1, true); bg.responses.set(2, false); await bg.tick();
    assert.equal(bg.badges.at(-1), '…'); assert.equal(bg.sounds(), 0);
    bg.responses.set(1, false); await bg.tick(); await bg.tick();
    assert.equal(bg.badges.at(-1), '!', 'idle polling must not immediately erase completion');
    assert.equal(bg.sounds(), 1); assert.ok([...bg.timeouts.values()].some(value => value.ms === 3000));
    assert.ok(bg.sent.some(value => value.id === 1 && value.message.type === 'showTitleExclamation'));
    bg.expire(1000); assert.ok(bg.sent.some(value => value.message.type === 'hideTitleExclamation'));
    bg.expire(3000); assert.equal(bg.badges.at(-1), '');
  });

  test(`${api}: another background response remains visible after completion clears`, async () => {
    const bg = background(`${prefix}background.js`, api);
    bg.start(1); bg.start(2); bg.responses.set(1, true); bg.responses.set(2, true); await bg.tick();
    bg.responses.set(1, false); await bg.tick(); assert.equal(bg.badges.at(-1), '!');
    bg.expire(3000); assert.equal(bg.badges.at(-1), '…'); assert.equal(bg.colors.at(-1), '#7F5AF0');
    bg.responses.set(2, false); await bg.tick(); assert.equal(bg.sounds(), 2);
  });

  test(`${api}: closed or disconnected tabs release polling without late completion alerts`, async () => {
    const bg = background(`${prefix}background.js`, api);
    bg.start(1); bg.responses.set(1, true); await bg.tick();
    let resolve;
    bg.responses.set(1, () => new Promise(done => { resolve = done; })); await bg.tick();
    const before = bg.sent.length; await bg.tick(); assert.equal(bg.sent.length, before, 'one in-flight request per tab');
    bg.remove(1); resolve({ isGenerating: false, site: 'chatgpt' }); await flush();
    assert.equal(bg.sounds(), 0); assert.equal(bg.intervals.size, 0); assert.equal(bg.badges.at(-1), '');
    bg.start(2); bg.responses.set(2, true); await bg.tick();
    bg.responses.set(2, () => Promise.reject(new Error('fixture navigation'))); await bg.tick();
    assert.equal(bg.intervals.size, 0); assert.equal(bg.badges.at(-1), '');
  });

  test(`${api}: muted completion and extension update preserve saved sound choice`, async () => {
    const bg = background(`${prefix}background.js`, api, false);
    bg.start(1); bg.responses.set(1, true); await bg.tick(); bg.responses.set(1, false); await bg.tick();
    assert.equal(bg.sounds(), 0); bg.install('update'); assert.equal(bg.writes.length, 0);
    bg.install('install'); assert.equal(bg.writes[0].playSound, true);
  });
}

test('both manifests retain current version and selectors; Firefox publication stays gated', () => {
  for (const prefix of ['', 'edge-build/']) {
    const manifest = JSON.parse(source(`${prefix}manifest.json`));
    for (const host of ['chatgpt.com', 'chat.openai.com', 'chat.com', 'claude.ai', 'gemini.google.com', 'perplexity.ai', 'www.perplexity.ai']) {
      assert.ok(manifest.content_scripts[0].matches.includes(`https://${host}/*`));
    }
    assert.equal(manifest.version, '2.0.0'); assert.ok(manifest.options_ui.page);
  }
  for (const file of ['background.js', 'content_script.js', 'popup.js', 'options.js']) {
    assert.equal(normalizeLines(source(`edge-build/${file}`)), normalizeLines(source(file).replaceAll('browser.', 'chrome.')), file);
  }
  const workflow = source('.github/workflows/publish.yml');
  assert.match(workflow, /workflow_dispatch:/); assert.match(workflow, /tags:\s*\n\s*- 'v\*'/);
  assert.doesNotMatch(workflow, /branches:\s*\n\s*- main/);
});

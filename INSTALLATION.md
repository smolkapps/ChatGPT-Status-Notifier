# Installation and source testing

The reconciled Firefox source supports ChatGPT, Claude, Gemini and Perplexity. It retains the related source's version 2.0.0 and Gecko identifier. This merge does not represent a new store release.

## Firefox

For the published add-on, use the [Mozilla listing](https://addons.mozilla.org/en-US/firefox/addon/ai-status-notifier/). The listing and this checkout may contain different source or versions.

For temporary source testing in a disposable profile:

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on** and select the root `manifest.json`.
3. Pin the add-on to the toolbar and open a supported site.
4. Send a response using the site's visible controls. The background script checks each participating tab. The global toolbar badge shows `…` while a response is generating and `!` for three seconds when one finishes. The completed tab's title briefly shows `(!)`.
5. Use the popup's **Sound** checkbox or **Options** page to change the saved sound setting.

Complex web apps may pause DOM rendering in entirely hidden tabs; background polling does not eliminate that provider limitation. It does not require focus or suppress completion alerts based on focus.

Use `web-ext build --source-dir=. --overwrite-dest` to create a fresh ZIP in `web-ext-artifacts/`. Historical 0.0.5 archives remain in PR2 branch history; they do not contain the reconciled source and must not be used as current builds. Permanent Firefox installation requires a separately signed release.

## Legacy Edge source

`edge-build/` preserves the PR's separate `chrome.*` API implementation and Manifest V2 packaging. Its notification logic and settings UI match the Firefox source. It can be tested as an unpacked extension only in an isolated browser that still accepts Manifest V2. This reconciliation did not verify native installation in Edge.

Current Chrome no longer supports Manifest V2. Microsoft's Edge timeline also deprecates Manifest V2 and requires Manifest V3 for new store submissions. A Manifest V3 port is separate work. Do not assume this legacy package works in current Chrome or is ready for store submission.

- [Chrome Manifest V2 support timeline](https://developer.chrome.com/docs/extensions/develop/migrate/mv2-deprecation-timeline)
- [Microsoft Edge Manifest V3 timeline](https://learn.microsoft.com/en-us/microsoft-edge/extensions/developer-guide/manifest-v3)

## Verification limits

DOM/API fixtures verify selector and notification transitions without sending prompts to provider accounts. They do not prove that a provider's current signed-in interface still exposes those selectors or that a current browser accepts the extension. Sound playback calls and muted settings can be checked independently; audibility needs a separate listening check.

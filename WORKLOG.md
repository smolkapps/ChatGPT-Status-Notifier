# Worklog

## 2026-10-16 — Studio CI migration

Goal: execute existing CI on the local Studio with explicit hosted rollback.

Changed only runs-on selection to the per-repository STUDIO_CI profile(s), retaining a unique admitted run label. Public fork pull requests retain their original hosted runner label. web-ext lint/syntax/build are portable Node steps; publishing remains manual/tag-only and retains existing AMO side effects. All triggers, job IDs, matrix values, conditions, services, steps and publication gates are preserved.

Validation: parsed before/after workflow comparison permits only runs-on changes; runner variables and default/hosted/fork resolutions checked with a sample run ID. No builds, tests, installs, dispatches, deployments, releases, commits or API writes were performed during preparation. Actual admitted runtime validation remains after central review/application.

Hosted rollback values (JSON quotation marks are required): STUDIO_CI_UBUNTU_LATEST = "ubuntu-latest".

## 2026-11-01 — Related notifier source reconciliation

Goal: preserve completed notifier work in the canonical smolkapps repository without changing release authority.

Compared separate msmolkin/ChatGPT-Status-Notifier main ade880a516bb5d53c9b00f27f1927c117c015fb4 (same Gecko ID, common ancestor 7733187, README canonical link to smolkapps). Its nine unique commits add per-tab background-driven polling, global toolbar aggregation, title completion notices, popup feedback, version 2.0.0 and a no-data declaration. Existing October 18 package receipt and successful manual run 39153174474 bind the exact source blobs and explicitly exclude AMO submission; no earlier functional acceptance is inferred.

Integrated that completed source and preserved the canonical split CI/manual-or-tag publishing workflow. Related automatic main-push signing, old signature debris and stale archives are not imported. Related repository is read-only. PR2 platform work is next; checks and final outcome will be appended before the canonical push.

## 2026-11-01 — PR2 reconciliation and focused verification

Merged the outstanding platform branch 8a3e6d02e02c2cd6359842bc00c41cdca90297a2 against the related completed v2 source. Preserved the current ChatGPT composer selectors, Gemini, Claude, response timing, background per-tab polling, global toolbar aggregation, title notices, popup feedback and dark icons. Added Perplexity bare/www matches, incoming Claude streaming/Stop and legacy ChatGPT fallbacks, and a bounded wait helper. Retained the PR's separate chrome.* Manifest V2 source as a documented legacy Edge package; current Chrome acceptance is not claimed. No Manifest V3 migration or store action.

The PR review already identified cross-tab false completion and badge visibility defects. Production-source fixtures reproduce the remaining completion badge being immediately overwritten and disconnected/closed-tab stale work in the related source. Fixed the shared background boundary: keep completion visible for three seconds before restoring aggregate state, allow one pending check per tab, ignore late removed-tab replies and clear disconnected generating state. No focus filter or notification suppression policy was added. Inspected desktop UI also exposed the inherited feedback link's dark color being overridden by a later CSS rule; corrected only selector specificity in both popup copies.

Validation: 15 production-source Node regression cases pass with zero skips, and the original PR's five independent button examples pass (they copy logic and are not extension acceptance). web-ext 9.1.0 lint/build and all root/Edge JavaScript syntax checks pass. Final Firefox lint reports zero errors/notices/warnings. The package is unsigned and has no test/legacy package/signature/archive payloads; every runtime file and manifest reference is checked against the source. Generated 0.0.5 archives are preserved in PR ancestry, not represented as current artifacts. Prior related October 18 manual package receipt remains separate evidence.

Browser verification uses task-owned Camoufox DOM/API fixtures, no provider requests, personal profile, signed-in chats, outgoing feedback, store navigation or audible playback. Earlier desktop fixtures accepted 1365x900 and exercised four provider flows plus popup/options controls. Final narrow fixtures accepted 390x844 after the dark-link fix and replayed those flows with zero page/console/network errors. A final desktop replay did not reach the expected native inner dimensions within five seconds and is unverified; no further native resizing or relaunch loop was used. The final narrow screenshots were inspected for clipping and link color. Two native addon probes timed out on internal extension/debug URLs, so installed Firefox/Edge/Chrome acceptance is unverified. Earlier fixture initialization/automatic-function invocation and viewport mismatch failures were corrected in the harness; a viewport-resize attempt hit Juggler's known hang and was not repeated. Current fixtures use fresh matching contexts without resizing. Narrow browser evidence does not establish physical mobile compatibility. Full audit evidence is retained outside the public extension source.

Canonical publication workflow is byte-identical to base deaa6ea3997dc34e51c48bb0af045679e688ef8e: normal main pushes run existing CI only; AMO signing/submission remains manual or v* tag and requires separate approval. No signing, dispatch, tag, release, deployment, scheduler, account or service changes were made. No original local checkout for either repository identity was found in the bounded inventory; original review pool refs remain preserved. Final canonical push and remote containment are recorded in the audit receipt.

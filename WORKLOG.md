# Worklog

## 2026-10-16 — Studio CI migration

Goal: execute existing CI on the local Studio with explicit hosted rollback.

Changed only runs-on selection to the per-repository STUDIO_CI profile(s), retaining a unique admitted run label. Public fork pull requests retain their original hosted runner label. web-ext lint/syntax/build are portable Node steps; publishing remains manual/tag-only and retains existing AMO side effects. All triggers, job IDs, matrix values, conditions, services, steps and publication gates are preserved.

Validation: parsed before/after workflow comparison permits only runs-on changes; runner variables and default/hosted/fork resolutions checked with a sample run ID. No builds, tests, installs, dispatches, deployments, releases, commits or API writes were performed during preparation. Actual admitted runtime validation remains after central review/application.

Hosted rollback values (JSON quotation marks are required): STUDIO_CI_UBUNTU_LATEST = "ubuntu-latest".

## 2026-11-01 — Related notifier source reconciliation

Goal: preserve completed notifier work in the canonical smolkapps repository without changing release authority.

Compared separate msmolkin/ChatGPT-Status-Notifier main ade880a516bb5d53c9b00f27f1927c117c015fb4 (same Gecko ID, common ancestor7733187, README canonical link to smolkapps). Its nine unique commits add per-tab background-driven polling, global toolbar aggregation, title completion notices, popup feedback, version2.0.0 and a no-data declaration. Existing October18 package receipt and successful manual run39153174474 bind the exact source blobs and explicitly exclude AMO submission; no earlier functional acceptance is inferred.

Integrated that completed source and preserved the canonical split CI/manual-or-tag publishing workflow. Related automatic main-push signing, old signature debris and stale archives are not imported. Related repository is read-only. PR2 platform work is next; checks and final outcome will be appended before the canonical push.

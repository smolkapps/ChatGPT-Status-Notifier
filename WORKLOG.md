# Worklog

## 2026-10-16 — Studio CI migration

Goal: execute existing CI on the local Studio with explicit hosted rollback.

Changed only runs-on selection to the per-repository STUDIO_CI profile(s), retaining a unique admitted run label. Public fork pull requests retain their original hosted runner label. web-ext lint/syntax/build are portable Node steps; publishing remains manual/tag-only and retains existing AMO side effects. All triggers, job IDs, matrix values, conditions, services, steps and publication gates are preserved.

Validation: parsed before/after workflow comparison permits only runs-on changes; runner variables and default/hosted/fork resolutions checked with a sample run ID. No builds, tests, installs, dispatches, deployments, releases, commits or API writes were performed during preparation. Actual admitted runtime validation remains after central review/application.

Hosted rollback values (JSON quotation marks are required): STUDIO_CI_UBUNTU_LATEST = "ubuntu-latest".

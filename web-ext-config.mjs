// Shared web-ext configuration used by both the CI (lint + build) job and the
// gated publish/sign job. Keeping the ignore list in one place guarantees the
// artifact that CI lints/builds is identical to the one that gets signed.
export default {
  // Files that are NOT part of the shipped Firefox add-on. These are repo
  // scaffolding (docs, build helpers, Chrome-port notes, screenshots), stale
  // signature debris, and source-only vector art.
  ignoreFiles: [
    'META-INF/**',        // leftover signature dir from a previously-signed .xpi
    'porting_to_chrome/**',
    'images/**',          // README screenshots, not add-on assets
    'build',              // interactive bash build helper
    'addon_v*.zip',       // local build outputs
    'web-ext-config.mjs', // this config
    '*.md',               // README / CHANGELOG
    '.github/**',
    'icons/*.svg',        // design sources; only the rasterized PNGs ship
  ],
  build: {
    overwriteDest: true,
  },
};

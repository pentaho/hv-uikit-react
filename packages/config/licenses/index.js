/**
 * Shareable configuration of permissive or internal licenses
 *
 * @see https://github.com/tmorell/license-compliance/
 * @type {import("license-compliance/lib/interfaces").ExtendableConfiguration}
 * */
export default {
  format: "text",
  report: "detailed",
  allow: [
    // Public Domain Licenses
    "0BSD",
    "CC0-1.0",
    "Unlicense",
    "WTFPL",

    // Permissive Licenses (listed)
    "Apache-2.0",
    "Artistic-2.0",
    "BSD-1-Clause",
    "BSD-2-Clause",
    "BSD-3-Clause",
    "CC-BY-3.0",
    "CC-BY-4.0",
    "CPL-1.0",
    "EPL-2.0",
    "ISC",
    "MIT",
    "MIT-0",
    "MPL-2.0",
    "MS-PL",
    "Python-2.0",
    "W3C",
    "Zlib",

    // Permissive Licenses (other)
    "BlueOak-1.0.0",
    "Hippocratic-2.1",
  ],
  exclude: [
    // any of our packages
    /^@hitachivantara/,
    /^@pentaho/,
    /^@pentaho-apps/,

    "browser-assert", // MIT: https://github.com/socialally/browser-assert/pull/1
    "flatbuffers", // Apache-2.0: https://github.com/google/flatbuffers
    "gitconfiglocal", // BSD-3: https://github.com/soldair/node-gitconfiglocal/pull/13
  ],
};

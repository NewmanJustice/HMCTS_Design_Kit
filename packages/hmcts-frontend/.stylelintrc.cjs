module.exports = {
  extends: ["stylelint-config-standard-scss"],
  plugins: ["stylelint-scss"],
  rules: {
    // Allow SCSS @use/@forward
    "at-rule-no-unknown": null,
    "scss/at-rule-no-unknown": true,

    // Don’t force #fff/#000 (we're happy with either)
    "color-hex-length": null,

    // Don’t force keyword casing (Arial should stay "Arial")
    "value-keyword-case": null,

    // Allow empty index files (useful placeholders for layer architecture)
    "no-empty-source": null,

    // These are fine but noisy for a design system repo
    "no-descending-specificity": null,
    "selector-class-pattern": null,

    // Prefer classic media queries rather than range notation
    "media-feature-range-notation": "prefix"
  }
};
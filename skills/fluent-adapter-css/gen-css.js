// Generate CSS custom properties from Fluent tokens, using EXACT @fluentui/tokens
// camelCase names as the custom-property name (most faithful, no mangling).
const d = require('/home/cyrene/codes/default/fluent2-design-skills/data/tokens/fluent-tokens.json');
const fs = require('fs');

const globals = {};
Object.assign(globals, d.spacing.horizontal, d.spacing.vertical);
Object.assign(globals, d.radius, d.strokeWidths, d.durations, d.curves);
Object.assign(globals, d.typography.fontSizes, d.typography.lineHeights, d.typography.fontWeights, d.typography.fontFamilies);

function emit(obj) {
  return Object.entries(obj)
    .map(([k, v]) => `  --${k}: ${v};`)
    .sort((a, b) => a.localeCompare(b))
    .join('\n');
}

const css = `/* Generated from @fluentui/tokens (source of truth: data/tokens/fluent-tokens.json).
   Token names match @fluentui/tokens exactly. Consume as var(--TokenName). */
:root {
${emit(globals)}
}
:root[data-theme="light"], .fluent-light {
${emit(d.alias.lightWeb)}
}
:root[data-theme="dark"], .fluent-dark {
${emit(d.alias.darkWeb)}
}
`;
fs.writeFileSync('/home/cyrene/codes/default/fluent2-design-skills/skills/fluent-adapter-css/fluent.css', css);
console.log('wrote fluent.css lines =', css.split('\n').length,
  'globals =', Object.keys(globals).length,
  'light =', Object.keys(d.alias.lightWeb).length,
  'dark =', Object.keys(d.alias.darkWeb).length);
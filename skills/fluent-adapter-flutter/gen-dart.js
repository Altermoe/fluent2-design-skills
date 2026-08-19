// Generate a clean Flutter Dart token file from Fluent tokens.
const d = require('/home/cyrene/codes/default/fluent2-design-skills/data/tokens/fluent-tokens.json');
const fs = require('fs');

function colorExpr(hex) {
  if (typeof hex !== 'string') return `const Color(0x00000000) /* ${name ?? ''} */`;
  let m = hex.match(/^#([0-9a-fA-F]{6})$/);
  if (m) return `const Color(0xFF${m[1].toUpperCase()})`;
  m = hex.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/);
  if (m) {
    const a = Math.round(parseFloat(m[4]) * 255);
    const r = Number(m[1]).toString(16).padStart(2, '0').toUpperCase();
    const g = Number(m[2]).toString(16).padStart(2, '0').toUpperCase();
    const b = Number(m[3]).toString(16).padStart(2, '0').toUpperCase();
    return `const Color(0x${a.toString(16).toUpperCase()}${r}${g}${b})`;
  }
  if (hex === 'transparent') return 'const Color(0x00000000)';
  return 'const Color(0x00000000)';
}

const camel = (s) => s.replace(/[-_ ](.)/g, (_, c) => c.toUpperCase());
const lightLines = Object.entries(d.alias.lightWeb)
  .map(([k, v]) => `  static const Color ${k} = ${colorExpr(v)}; // ${v}`);
const darkLines = Object.entries(d.alias.darkWeb)
  .map(([k, v]) => `  static const Color ${k} = ${colorExpr(v)}; // ${v}`);

const sp = d.spacing.horizontal;
const spacingBlock = Object.entries(sp)
  .map(([k, v]) => `  static const double ${k} = ${parseFloat(v)}; // ${v}`).join('\n');

const radiusBlock = Object.entries(d.radius)
  .map(([k, v]) => `  static const double ${k} = ${parseFloat(v || '0')}; // ${v}`).join('\n');

const durBlock = Object.entries(d.durations)
  .map(([k, v]) => `  static const Duration ${k} = Duration(milliseconds: ${parseInt(v)}); // ${v}`).join('\n');

const fts = d.typography.fontSizes;
const fontSizeBlock = Object.entries(fts)
  .map(([k, v]) => `  static const double ${k} = ${parseFloat(v)}; // ${v}`).join('\n');

const fw = d.typography.fontWeights;
const fontWeightBlock = Object.entries(fw)
  .map(([k, v]) => `  static const FontWeight ${k} = FontWeight.w${v}; // ${v}`).join('\n');

const out = `// Fluent 2 design tokens for Flutter, generated from @fluentui/tokens.
// Semantic color constants keep the exact @fluentui/tokens camelCase names.
import 'dart:ui';
import 'dart:ui' show FontWeight;

/// Fluent 2 semantic colors — the light theme (default web brand).
/// Values come straight from @fluentui/tokens alias.lightWeb.
abstract class FluentLightColors {
${lightLines.join('\n')}
}

/// Fluent 2 semantic colors — dark theme.
abstract class FluentDarkColors {
${darkLines.join('\n')}
}

/// Fluent 2 global design tokens (spacing, radius, duration, typography).
abstract class FluentTokens {
  // ---- spacing (4px base scale) ----
${spacingBlock}

  // ---- border radius ----
${radiusBlock}

  // ---- motion duration ----
${durBlock}

  // ---- font sizes ----
${fontSizeBlock}

  // ---- font weights ----
${fontWeightBlock}
}
`;
fs.writeFileSync('/home/cyrene/codes/default/fluent2-design-skills/skills/fluent-adapter-flutter/fluent_tokens.dart', out);
console.log('wrote fluent_tokens.dart, lines =', out.split('\n').length, 'light=', lightLines.length, 'dark=', darkLines.length);
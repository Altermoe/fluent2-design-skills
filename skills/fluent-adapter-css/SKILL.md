---
name: fluent-adapter-css
description: Emit Fluent 2 design tokens as CSS custom properties and Tailwind config. Includes a ready-to-use fluent.css mapping every @fluentui/tokens value to var(--TokenName). Pair with fluent-tokens / fluent-components / fluent-patterns.
whenToUse: Targeting plain CSS, CSS Modules, styled-components/CSS-in-JS, or Tailwind CSS, and need Fluent tokens expressed in that framework.
---

# Fluent 2 → CSS / Tailwind Adapter

把 Fluent token 翻译成 CSS 表达。本技能自带生成的 **`fluent.css`**（同目录），把 `data/tokens/fluent-tokens.json` 的每个值映射为 `var(--TokenName)`，token 名与 `@fluentui/tokens` 完全一致。

## 直接使用

```html
<link rel="stylesheet" href="fluent.css">
<style>.app { background: var(--colorNeutralBackground1); color: var(--colorNeutralForeground1); }</style>
```

- 亮/暗主题：在 `<html>` 上切 `data-theme="light"` / `data-theme="dark"`，或在容器加 `.fluent-light` / `.fluent-dark`。
- 全局 token（spacing/radius/stroke/duration/curve/font）在 `:root` 永远可用。

## 命名约定

- CSS 变量名 = 精确 token 名（保留驼峰）：`--colorNeutralBackground2`、`--borderRadiusMedium`、`--spacingHorizontalM`。
- 语义 token 以 `--color...` 出现；全局以 `--spacing...`、`--borderRadius...`、`--strokeWidth...`、`--duration...`、`--curve...`、`--fontSize...` 等出现。
- 在 CSS 里把形式统一为 **semantic-first**：组件用语义 token（`--colorCompoundBrandStroke`）而非全局灰色值。

## 生成/更新 CSS

数值变更是从 token 数据再生成，不手改：
```bash
node gen-css.js          # 重新生成 fluent.css
```
依赖：`data/tokens/fluent-tokens.json`（由 fluent-tokens 提供）。gen-css.js 在 `skills/fluent-adapter-css/` 内。

## Tailwind CSS 映射

把 Fluent token 注入 Tailwind 主题，用法一致：

```js
// tailwind.config.js
const fluent = require('./fluent.css.map.json'); // 可选：生成的颜色/尺寸映射
module.exports = {
  theme: {
    extend: {
      colors: {
        neutral1: 'var(--colorNeutralBackground1)',
        neutral1hover: 'var(--colorNeutralBackground1Hover)',
        brand1: 'var(--colorBrandBackground1)',
        compound1: 'var(--colorCompoundBrandBackground1)',
        fg1: 'var(--colorNeutralForeground1)',
        fg2: 'var(--colorNeutralForeground2)',
        danger: 'var(--colorPaletteRedForeground3)',
        stroke1: 'var(--colorNeutralStroke1)',
      },
      spacing: {
        xxs: 'var(--spacingHorizontalXXS)',
        xs: 'var(--spacingHorizontalXS)',
        s: 'var(--spacingHorizontalS)',
        m: 'var(--spacingHorizontalM)',
        l: 'var(--spacingHorizontalL)',
        xl: 'var(--spacingHorizontalXL)',
        xxl: 'var(--spacingHorizontalXXL)',
        xxxl: 'var(--spacingHorizontalXXXL)',
      },
      borderRadius: { sm: 'var(--borderRadiusSmall)', md: 'var(--borderRadiusMedium)', lg: 'var(--borderRadiusLarge)', xl: 'var(--borderRadiusXLarge)' },
      borderWidth: { DEFAULT: 'var(--strokeWidthThin)', thick: 'var(--strokeWidthThick)' },
      transitionDuration: { fast: 'var(--durationFast)', normal: 'var(--durationNormal)' },
    },
  },
};
```

要点：Tailwind 只是把 Tailwind 类绑定到 `var(--TokenName)`，**语义含义不变**——跨框架同一 token 名。

## 组件示例（CSS）

```css
.fluent-button--primary {
  background: var(--colorBrandBackground1);
  color: var(--colorNeutralForegroundOnColor);
  border: none;
  border-radius: var(--borderRadiusMedium);
  padding: 6px 12px;              /* 高 32 内 12px 水平 */
  font-family: var(--fontFamilyBase);
}
.fluent-button--primary:hover { background: var(--colorBrandBackground1Hover); }
.fluent-button--primary:active{ background: var(--colorBrandBackground1Pressed); }
.fluent-button--primary:focus-visible {
  outline: 2px solid var(--colorCompoundBrandStroke); outline-offset: 2px;
}
```

## 注意事项

- 只引用已存在的 `--TokenName`；拿不准值时查 `fluent.css` 或 `data/tokens/fluent-tokens.json`。
- focus 用 `outline/box-shadow` 模拟描边，避免改变布局尺寸。
- 自定义属性值（`rgba`、`cubic-bezier`）可直接套用，无需转换。

> 结构/组件规格见 `fluent-components`；设计原则见 `fluent-foundations`。
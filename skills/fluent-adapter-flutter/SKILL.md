---
name: fluent-adapter-flutter
description: Apply Fluent 2 design tokens in Flutter — generate ThemeData/ThemeExtension from the included fluent_tokens.dart, and map control patterns to Material-influenced Flutter widgets. Pair with fluent-tokens / fluent-components / fluent-patterns.
whenToUse: Building a Flutter app that should carry the Fluent/Windows design language (Microsoft-style), e.g. desktop Windows clients, and you need the token system mapped into Flutter's theming.
---

# Fluent 2 → Flutter Adapter

Flutter 没有官方 Fluent 组件库，所以本技能负责把 Fluent token **翻译成 Flutter 的表达**：语义颜色进 `ThemeData` / `ThemeExtension`，其它 token 绑定到 `ButtonStyle`、`TextStyle`、间距等。自带 **`fluent_tokens.dart`**（同目录），已把 `data/tokens/fluent-tokens.json` 编译成 Dart 常量。

## 使用 flens_tokens.dart

```dart
import 'fluent_tokens.dart';

Container(
  color: FluentLightColors.colorNeutralBackground1,
  child: Text('hi', style: TextStyle(color: FluentLightColors.colorNeutralForeground1)),
);
```

- 亮色语义：`FluentLightColors.*`；暗色：`FluentDarkColors.*`（同一 token 名，仅主题不同）。
- 全局量：`FluentTokens.spacingHorizontalM`、`FluentTokens.borderRadiusMedium`、`FluentTokens.durationFast` 等。

## 注入 ThemeData（亮/暗）

```dart
import 'package:flutter/material.dart';
import 'fluent_tokens.dart';

ThemeData fluentTheme(Brightness b) {
  final c = b == Brightness.light ? FluentLightColors.class : ...; // 用一个共用类
  return ThemeData(
    brightness: b,
    colorScheme: ColorScheme(
      brightness: b,
      primary: FluentLightColors.colorBrandBackground1,
      onPrimary: FluentLightColors.colorNeutralForegroundOnColor,
      surface: FluentLightColors.colorNeutralBackground1,
      onSurface: FluentLightColors.colorNeutralForeground1,
      error: FluentLightColors.colorPaletteRedForeground3,
      // ... 其余必需槽补全
    ),
    cardTheme: CardThemeData(
      color: FluentLightColors.colorNeutralBackground1,
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(FluentTokens.borderRadiusLarge)),
    ),
    textTheme: const TextTheme(
      titleLarge: TextStyle(fontWeight: FontWeight.w600, fontSize: FluentTokens.fontSizeBase500),
      bodyMedium: TextStyle(fontSize: FluentTokens.fontSizeBase300, color: ...),
    ),
  );
}
```

> `fluent_tokens.dart` 生成自 `data/tokens/fluent-tokens.json`。想手动驱动一个完整 ThemeExtension 时，把语义常量映射成字段即可。

## 控件映射（Flutter widget → Fluent 规格）

| Fluent 概念 | Flutter widget / 方式 |
|---|---|
| primary button | `FilledButton` + `backgroundColor=colorBrandBackground1`；hover `FilledButton.styleFrom(overlayColor:…)` |
| secondary/outline | `OutlinedButton` + `side=BorderSide(color:colorNeutralStroke1)` |
| text input | `TextField`/`InputDecorator` + `filled`、`OutlineInputBorder` |
| card | `Card` + 语义底 + `borderRadius` |
| dialog / overlay | `showDialog` + `backgroundColor=colorNeutralBackground1` + overlay color |
| menu / popover | `MenuAnchor` / `showMenu` |
| tabs / nav | `NavigationRail` / `TabBar` + active 指示色 `colorCompoundBrandStroke` |
| switch / checkbox | Material 自带，配合 `ColorScheme` 注入品牌色 |

这些只是把 Fluent 的**语义颜色/尺寸**接到 Flutter 控件上；结构与状态映射见 `fluent-components`。

## 主题切换

切换亮/暗 = 传不同 `ThemeData` 到 `MaterialApp(theme:, darkTheme:)`。语义 token 名不变，值随主题——这正是跨框架同一设计语言的关键。

## 无障碍

- 触控目标 ≥ 40 逻辑像素。
- 不单靠颜色传状态（配 icon/文本）。
- 动效尊重 `MediaQuery.disableAnimations`.

## 更新数据

`fluent_tokens.dart` 由 Node 脚本生成：`node gen-dart.js`（依赖 `data/tokens/fluent-tokens.json`）。建议把脚本纳入你的 dart 构建前置步骤。

> 设计原则见 `fluent-foundations`；取 token 真值见 `fluent-tokens`。
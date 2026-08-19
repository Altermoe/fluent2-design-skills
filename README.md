# Fluent 2 Design Skills

把微软 [Fluent 2](https://fluent2.microsoft.design/) 设计系统提取为一套**框架无关**的设计 skills，供 AI agent 在任意 UI 框架（CSS/UnoCSS/Tailwind、React、Vue 3、Flutter、Web Component 等）里复用「同一套设计语言」。

> 优先级约定：**TypeScript 优先、Vite 8 优先**（Vite 8 是首个 Rolldown 稳定版），相关框架指南一律用 `.ts` 配置。

## 核心理念

Fluent 2 的设计资产真正与框架解耦的核心是 **design tokens**（`@fluentui/tokens` 里那套语义 token）。
本仓库把「不可变的语义规则」（语言层）与「可变的框架映射」（适配层）分离：

- **语言层**（框架无关）：foundations / tokens / components / patterns / verify
- **适配层**（各框架）：css / vue / react / flutter

改框架不动语言，反之亦然。AI 依据 tokens 输出正确的**语义值**而非硬编码的心血来潮值，再由 adapter 翻译成目标框架表达。

## 技能清单

| Skill 名 | 类型 | 作用 |
|---|---|---|
| `fluent-foundations` | 语言 | 设计原则、栅格、间距标度、层级逻辑、无障碍规则 |
| `fluent-tokens` | 语言 | 语义 token 字典（真实值来自 `@fluentui/tokens`） |
| `fluent-components` | 语言 | 组件解剖（anatomy / parts / 状态 / 尺寸 / 行为规格） |
| `fluent-patterns` | 语言 | 布局 / 导航 / 表单 / 数据展示等模式 |
| `fluent-adapter-css` | 适配 | token → CSS 变量 / **UnoCSS preset（TS）** / Tailwind config |
| `fluent-adapter-vue` | 适配 | token → Vue 3（Vite 8 + TS）+ UnoCSS / Fluent Web Components |
| `fluent-adapter-react` | 适配 | token → React / Fluent UI React v9（TS，Vite 8） |
| `fluent-adapter-flutter` | 适配 | token → Flutter ThemeData / ThemeExtension |
| `fluent-verify` | 工具 | 用 token/规则做一致性审计的 checklist |

## 数据来源

- 语义 token 数值**直接从官方 `@fluentui/tokens` 包抽取**：`data/tokens/fluent-tokens.json`
  （含 global 色板、typography、spacing、radius、stroke、durations、curves，以及 light/dark 两套 184 个语义 token 的真实解析值）。
- 参考官方：[Fluent 2 Design tokens](https://fluent2.microsoft.design/design-tokens) 。
- 本项目 skills 本身为 MIT 许可（Fluent token 值随其包许可证使用）。

## 目录结构

```
fluent2-design-skills/
├── README.md
├── install.sh              # 安装到 DSH 或 .agents skills 目录（Bash / macOS / Linux）
├── install.ps1             # 安装到 DSH 或 .agents skills 目录（PowerShell / Windows）
├── data/                   # 机器可读参考数据（token 等）
│   └── tokens/fluent-tokens.json
├── skills/                 # 标准 SKILL.md 目录集（tool-agnostic）
│   ├── fluent-foundations/
│   ├── fluent-tokens/
│   ├── fluent-components/
│   ├── fluent-patterns/
│   ├── fluent-adapter-css/        # CSS / UnoCSS preset(TS) / Tailwind
│   ├── fluent-adapter-vue/        # Vue 3 + Vite 8 + TS
│   ├── fluent-adapter-react/
│   ├── fluent-adapter-flutter/
│   └── fluent-verify/
└── .dsh/skills/            # 本机 DSH 可加载的符号链接
```

## 安装（DSH / Anthropic skills）

```bash
./install.sh --dsh          # 装到项目 .dsh/skills（或 ~/.dsh/skills）
./install.sh --agents       # 装到 ~/.agents/skills
```

Windows（PowerShell）：

```powershell
.\install.ps1 --dsh           # 装到项目 .dsh/skills（或 -User 装到 ~/.dsh/skills）
.\install.ps1 --agents        # 装到 ~/.agents/skills
```

> `install.ps1` 优先建符号链接；无管理员/开发者模式权限时自动降级为目录联接（junction），再退化为整目录复制，保证在受限环境中也能完成安装。

DSH 会从项目 `.dsh/skills`、`~/.agents/skills`、`~/.dsh/skills` 自动发现 `SKILL.md`。

## 使用方式

触发任意一个 skill（如 `fluent-tokens`、`fluent-foundations`）后，agent 把其内容当作「设计语言规范 + 参照数据」，据此生成框架代码；跨框架时切换对应 `fluent-adapter-*` 即可。
```
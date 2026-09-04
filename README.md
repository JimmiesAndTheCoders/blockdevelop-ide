# 🚀 BlockDevelop IDE

<p align="center">
  <b>Free, open-source Integrated Development Environment inspired by FlashDevelop & HaxeDevelop, built for visual block-based programming.</b>
</p>

<p align="center">
  <a href="https://github.com/JimmiesAndTheCoders/blockdevelop-ide/actions"><img src="https://img.shields.io/github/actions/workflow/status/JimmiesAndTheCoders/blockdevelop-ide/ci.yml?branch=main&label=CI&style=flat-square" alt="CI Status" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="MIT License" /></a>
  <a href="https://pnpm.io"><img src="https://img.shields.io/badge/package%20manager-pnpm-orange?style=flat-square" alt="pnpm" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-18-cyan?style=flat-square" alt="React 18" /></a>
  <a href="https://www.electronjs.org"><img src="https://img.shields.io/badge/Electron-29-blue?style=flat-square" alt="Electron 29" /></a>
</p>

---

## ✨ Features & Architecture

BlockDevelop IDE bridges the productivity of professional text-based IDEs (FlashDevelop/HaxeDevelop) with visual block engines (Google Blockly):

- 🧩 **First-Class Visual Block Support**: Drag-and-drop block coding powered by Google Blockly.
- ⚡ **Dual-Editor Real-Time Sync**: Side-by-side Visual Blocks and generated target code.
- 🖥️ **Dockable Workspace UI**: FlashDevelop-inspired dockable panels, split views, and customizable layouts.
- 🎯 **Multi-Target Code Generators**: Export to JavaScript, TypeScript, Python, Haxe, Lua, and C++.
- 🔒 **Secure Desktop Runtime**: Strict Context Isolation, Chromium OS Sandboxing, and typed IPC Context Bridge (`window.blockDevelopAPI`).
- ⚡ **Turbocharged Monorepo**: Powered by `pnpm` workspaces, `Turborepo`, `Vite`, and `TypeScript`.

---

## 🏗️ Monorepo Package Structure

```text
blockdevelop-ide/
├── apps/
│   └── desktop/        # Electron Main/Preload + React Renderer App
└── packages/
    ├── core/           # Shared types, IPC event maps, Zustand stores, Mitt event bus
    ├── block-engine/   # Custom Blockly canvas integration & block definitions
    ├── code-gen/       # Multi-language code generation pipelines
    └── ui/             # Shared Tailwind CSS components & React hooks
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) >= 20.x
- [pnpm](https://pnpm.io) >= 8.x

### Installation

```bash
# 1. Clone repository
git clone https://github.com/JimmiesAndTheCoders/blockdevelop-ide.git
cd blockdevelop-ide

# 2. Install monorepo dependencies
pnpm install

# 3. Build core packages
pnpm run build

# 4. Launch Desktop IDE in dev mode
pnpm --filter @blockdevelop/desktop dev
```

---

## 🧪 Testing & Quality Assurance

```bash
# Run unit tests across all packages
pnpm run test

# Typecheck TypeScript types
pnpm run typecheck

# Lint workspace files
pnpm run lint
```

---

## 📦 Packaging Desktop Binaries

```bash
# Package executable directory (.exe / .dmg / .AppImage)
pnpm --filter @blockdevelop/desktop package:dir
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

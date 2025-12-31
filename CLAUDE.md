# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Brew Down is a simple macOS markdown viewer built with Electron + React + TypeScript. It displays rendered markdown only (no split editor view).

## Commands

```bash
npm run dev          # Start development (Vite + Electron with hot reload)
npm run build        # Production build (creates DMG for macOS)
npm run build:electron  # Build only Electron files
```

## Architecture

**Process Model (Electron)**
- Main process (`electron/main.ts`): Window management, native dialogs, file system access
- Preload (`electron/preload.ts`): Exposes `window.electronAPI` via context bridge
- Renderer (`src/`): React app loaded via Vite

**IPC Communication**
- `open-file-dialog`: Opens native file picker, returns `{filePath, content, fileName}`
- `read-file`: Reads file by path (used for drag & drop)

**Build Pipeline**
- Electron TypeScript compiled via esbuild (`scripts/build-electron.js`) → `dist-electron/`
- React bundled via Vite → `dist/`
- Dev server runs on port 5180

## Key Dependencies

- `react-markdown` + `remark-gfm`: Markdown rendering with GitHub Flavored Markdown support
- `electron-builder`: macOS app packaging

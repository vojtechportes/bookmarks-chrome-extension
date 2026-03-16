# Bookmarks Chrome Extension

A simple **bookmark manager** designed for speed and simplicity.

This extension supports both dark mode and light mode, card and list data views, full text search, sorting and pinning.

![Application screens](https://github.com/vojtechportes/bookmarks-chrome-extension/blob/main/app-screens.png)

## Prerequisities

- `node` version `^22.13.0`
- `npm` version `^10.0.0`

## Installation

```
npm i
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`
- `npm run test`
- `npm run test:run`
- `npm run test:coverage`
- `npm run format`
- `npm run format:check`
- `npm run format:stage`

## Running the extension in Chrome

Build the extension first

```
npm run build
```

This will generate production files in the `dist` folder.

To load the extension in Chrome:

1. Open chrome://extensions
2. Enable `Developer mode` in upper right corner
3. Click `Load unpacked`
4. Select the `dist` folder from this repository

Alternatively, you can download the extension source code from `[the repository releases section](https://github.com/vojtechportes/bookmarks-chrome-extension/releases/)`.

## Repository structure

Repository is structured into following folders:

```
/src
  /__mocks__
  /background
  /shared
  /sidepanel
  /test
```

- `background` contains `service-worker.ts`, `Chrome API` related functions, and background utilities.
- `shared` contains shared constants, types and database-related functions.
- `sidepanel` then contains React application.

## Data storage

Bookmarks are stored locally in the browser using `chrome.storage.local`. Each bookmark is saved with the following structure:

```
id: string;
title: string;
url: string;
icon?: string;
iconAssetId?: string;
darkIconAssetId?: string;
lightIconAssetId?: string;
screenshotAssetId?: string;
description: string;
addedAt: string;
pinned?: boolean;
```

All bookmark metadata is stored under a single storage key. UI preferences like sorting and view type are stored separately.

Assets, specifically favicons and screenshots are stored in `IndexedDB` to avoid filling the `chrome.storage.local` quota with large image data.

Assets are downscaled and compressed before storage, except for SVG files.

## Library choices

This app uses `vite` as its build tool.

It intentionally keeps dependencies to a minimum to keep the extension lightweight. It does not use a UI framework or styling library, so styling is done with `CSS Modules` (which comes out of the box with `vite`). `radix-ui` is used only for a small number of more complex unstyled primitives.

For search, `minisearch` is used because it is performant, supports indexing and ranking, and works well for fuzzy search.

The extension is also prepared for internationalization and uses `i18next` and `react-i18next` within the React UI, with all copy stored in translation files.

## Architecture

![Diagram](https://github.com/vojtechportes/bookmarks-chrome-extension/blob/main/diagram.png)

This extension uses a **Manifest V3 service worker** as the backend layer and a **React side panel** as the UI layer.

The **side panel** is responsible for rendering bookmarks, search, sorting, view preferences, and user interactions like bookmarking the current tab, opening a bookmark, pinning, unpinning, deleting items, and deleting all items.

Bookmark metadata and user preferences are stored in `chrome.storage.local` and accessed through a `storageApi` abstraction. In the React UI this is used via the `useStorage` hook, which also subscribes to storage changes so the UI automatically updates when bookmark data changes.

Operations that require privileged extension APIs (such as accessing the active tab, capturing screenshots, or modifying bookmarks) are executed through a `runtimeApi` abstraction, which communicates with the background service worker using `chrome.runtime.sendMessage()`.

Overall:

- `runtimeApi` is used to perform operations handled by the background layer
- `storageApi` is used to read and write stored data and observe storage updates

The **service worker** is the main orchestration layer. The side panel communicates with it through `chrome.runtime.sendMessage()`. Inside the worker, `handleMessage()` routes messages to dedicated bookmark actions.

When saving a bookmark, the worker first resolves the **active tab**, checks whether the URL is bookmarkable, or whether the bookmark is not already saved and then uses `chrome.scripting.executeScript()` to extract page metadata like title, URL, description, and favicon from the page DOM. It also captures a screenshot of the current tab.

The extension uses **two storage layers**:

- `chrome.storage.local` stores bookmark metadata and UI preferences.
- `IndexedDB` stores binary assets such as favicons and screenshots.

This split keeps bookmark synchronization and UI updates simple while avoiding filling extension storage entries with large image data. In the side panel, asset are loaded from `IndexedDB` and converted into object URLs and then displayed.

For local browser development outside the extension environment, the project includes **browser fallbacks** for runtime and storage APIs, allowing the UI to run with mocked runtime actions and `localStorage` without requiring the full Chrome extension context.

## Intentional deviation from assignment brief

Sorting is implemented through a dropdown instead of a toggle. I found toggling between four sorting states less intuitive, while a dropdown makes the available options clearer and easier to use.

Scraping page content for bookmark descriptions is also done in the opposite order from the original brief. The extension first prefers the page description and only then falls back to page content.

Raw page content intends to be noisy and not very useful without additional summarization. Eventhough Chrome now provides Prompt API that could potentially summarize page content, it requires significant system resources (RAM/VRAM), which makes it unsuitable for a lightweight browser extension intended to run reliably on most machines. For this reason the extension avoids AI-based summarization and relies on page metadata instead. If it would be up to me, I would skip the raw page content intentionally and go with no description at all in case meta description is not available, but I am keeping it as the brief asked for it. 

### Additional functionality

- User can switch between two different views, where one is more condensed.
- User can delete all bookmarks.
- User can pin bookmarks. If there are any pinned bookmarks, sorting happens in two stages. First pinned bookmarks are sorted, which stay on top and then the rest.

## Known limitations

Fetched favicons do not always work well across dark mode and light mode. For example, an icon fetched in dark mode may not display well in light mode. I tried to improve this for pages that expose both light and dark icon variants in their source code, but it is still an issue.

## Testing

The project uses `vitest` and `@testing-library`. I wrote a few tests, but the overall coverage is still poor due to the time constraints of building the app within four days.

## CI/CD

### CI

Triggers on pull requests to `main`.

Runs and verifies:

- npm ci
- npm run lint
- npm run test
- npm run build

### Release Chrome Extension

Triggers when tag matching pattern `v*` is pushed into the repository.

Runs:

- npm ci
- npm run build

Additional steps:

- Verifies build output.
- Creates a zip file containing build output.
- Creates a release and attaches the zip file.


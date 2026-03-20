# Bookmarks Chrome Extension

A simple **bookmark manager** designed for speed and simplicity.

This extension supports both dark mode and light mode, card and list data views, full text search, sorting and pinning and renaming.

![Application screens](https://github.com/vojtechportes/bookmarks-chrome-extension/blob/main/app-screens.png)

## Prerequisities

- `node` version `^22.13.0`
- `npm` version `^10.0.0`

### Optional VSCode extensions

- CSS Nesting Syntax Highlighting
- CSS Variable Autocomplete
- CSS Modules
- CSS Modules Syntax Highlighter
- Prettier

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

## Precommit hooks

Precommit hooks are run via Husky and runs following commands:

```
npm run lint
npm run test
npm run format:stage
```

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

Alternatively, you can download the extension source code from [the repository releases section](https://github.com/vojtechportes/bookmarks-chrome-extension/releases/).

## Repository structure

Repository is structured into following folders:

```
/src
  /__mocks__
  /background
  /offscreen
  /shared
  /sidepanel
  /test
```

- `background` contains `service-worker.ts`, `Chrome API` related functions, and background utilities.
- `offscreen` hidden document to AI summarize page content when `Use AI generated descriptions` is enabled in extension settings
- `shared` contains shared constants, types and database-related and functions.
- `sidepanel` then contains React application.

## Data storage

Bookmarks are stored in `IndexedDB`. Each bookmark is saved with the following structure:

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
updatedAt: string;
pinned?: boolean;
isGeneratingDescription?: boolean;
```

Assets, specifically favicons and screenshots are stored in `IndexedDB`.
Assets are downscaled and compressed before storage, except for SVG files.

When bookmark is deleted, assets tied to that bookmark are deleted as well. When all bookmarks are deleted, both database tables are emptied.

Preferences, `sorting`, `view type` and `extension settings` are stored in `chrome.local.storage`.

## Library choices

This app uses `vite` as its build tool.

It intentionally keeps dependencies to a minimum to keep the extension lightweight. It does not use a UI framework or styling library, so styling is done with `CSS Modules` (which comes out of the box with `vite`). `radix-ui` is used only for a small number of more complex unstyled primitives.

For search, `minisearch` is used because it is performant, supports indexing and ranking, and works well for fuzzy search.

The extension is also prepared for internationalization and uses `i18next` and `react-i18next` within the React UI, with all copy stored in translation files.

To communicate with `IndexedDb`, `idb` package is used.

## Architecture

![Diagram](https://github.com/vojtechportes/bookmarks-chrome-extension/blob/main/app-diagram.png)

### Architecture overview

- UI: React side panel
- Background: Manifest V3 service worker
- Offscreen: AI summarization
- Persistence: IndexedDB (bookmarks + assets)
- Preferences: chrome.storage.local
- Sync: runtime messaging (with BroadcastChannel fallback)

### Architecture in detail

This extension uses a **Manifest V3 service worker** as the backend layer and a **React side panel** as the UI layer.

The **side panel** is responsible for rendering bookmarks, search, sorting, view preferences, settings and user interactions like bookmarking the current tab, opening a bookmark, pinning, unpinning, deleting items, and deleting all items.

Bookmark metadata and downscaled assets are stored in `IndexedDb` in two separate tables.

User preferences are stored in `chrome.storage.local` and accessed through a `storageApi` abstraction. In the React UI this is used via the `useStorage` hook, which also subscribes to storage changes so the UI automatically updates stored data changes.

Operations that require privileged extension APIs (accessing the active tab, capturing screenshots, AI summarization or opening new tab) are executed through a `runtimeApi` abstraction, which communicates with the background service worker using `chrome.runtime.sendMessage()`.

`IndexedDB` is accessed through a shared database API. Sorting is performed at the database layer, while search is handled in the React UI. State changes are synchronized through messaging between the React UI and the background layer, with `BroadcastChannel` serving as a fallback for non-extension or out-of-context environments.

Overall:

- `runtimeApi` is used to perform operations handled by the background layer and to observe changes.
- `storageApi` is used to read and write stored data and observe storage updates
- shared 

The **service worker** is the main orchestration layer. The side panel communicates with it through `chrome.runtime.sendMessage()`. Inside the worker, `handleMessage()` routes messages to dedicated bookmark actions.

Aside of service worker, there is also an **offscreen** which is used to execute AI analysis of a page content and generate a description.

When saving a bookmark, the worker first resolves the **active tab**, checks whether the URL is bookmarkable, or whether the bookmark is not already saved and then uses `chrome.scripting.executeScript()` to extract page metadata like title, URL, description, and favicon from the page DOM. At the same time, when `Use AI generated descriptions` is enabled and the `Summarizer` is available and AI model downloaded, **page description is AI generated** in `offscreen` in async mode and temporary loading state flag `isGeneratingDescription` is saved to the bookmark metadata and later on updated when generated description is ready. It also captures a screenshot of the current tab. Data is then saved to `IndexedDb`. If unsuccesfull, exception is thrown and communicated to user.

The extension uses **two storage layers**:

- `chrome.storage.local` stores UI preferences.
- `IndexedDB` stores bookmarks metadata and binary assets like favicons and screenshots.

For local browser development outside the extension environment, the project includes **browser fallbacks** for runtime and storage APIs.

## Intentional deviation from assignment brief

Sorting is implemented through a dropdown instead of a toggle. I found toggling between four sorting states less intuitive, while a dropdown makes the available options clearer and easier to use.

Scraping page content for bookmark descriptions is also done in the opposite order from the original brief. The extension first prefers the page description and only then falls back to page content, because raw page content tends to be noisy and very often contains unusable information. In case user opt-ins for AI generated descriptions in the settings, then the AI generated description has the heighest priority and when available, it is used first.

### Additional functionality

- User can switch between two different views, where one is more condensed.
- User can delete all bookmarks.
- User can pin bookmarks. If there are any pinned bookmarks, sorting happens in two stages. First pinned bookmarks are sorted, which stay on top and then the rest.
- Searched text is highlighted (though when original searched text is fuzzy, the match might not be fully displayed)
- User can rename bookmarks/

## Known limitations

Fetched favicons do not always work well across dark mode and light mode. For example, an icon fetched in dark mode may not display well in light mode. I tried to improve this for pages that expose both light and dark icon variants in their source code, but it is still an issue.

## Testing

The project uses `vitest` and `@testing-library`. The coverage is not perfect, but most important parts are tested.

## CI/CD

### CI

Triggers on pull requests to `main`.

Runs and verifies:

- npm ci
- npm run lint
- npm run test
- npm run build

### Release Chrome Extension

Triggers when tag matching pattern `v*` is pushed into `main` branch.

Runs:

- npm ci
- npm run build

Additional steps:

- Verifies build output.
- Creates a zip file containing build output.
- Creates a release and attaches the zip file.

## Post-mortem

Initially, bookmarks were stored in `chrome.storage.local` via the background layer. After further consideration, I realized this approach was not ideal, as it required mutating the entire dataset on each update.

I migrated bookmark metadata to `IndexedDB`, using a dedicated store. This provides a more scalable and flexible solution, especially for future features such as pagination, partial updates, and richer querying. As part of this change, sorting was moved from the client to the database layer.

Search remains implemented on the client using `minisearch`, as it currently provides better flexibility and relevance than what would be practical to achieve directly in IndexedDB.

Additionally, I introduced bookmark renaming as a small usability improvement.

Later on, I also added **AI generated descriptions** and with that Settings section and refactored some parts of the code and improved UI of the extension.

### Potential improvements

Given more time, I would focus on:

- implementing pagination and lazy loading for large datasets  
- exploring more advanced search strategies
- syncing bookmarks and assets state for example through appDataFolder in google drive for logged in user and comparing data between cloud storage and local IndexedDB. That would require different strategy when it comes to deletion (soft delete instead of hard delete) and more informaction about bookmark metadata like updatedDate. Proposed solution: https://github.com/vojtechportes/bookmarks-chrome-extension/milestone/1


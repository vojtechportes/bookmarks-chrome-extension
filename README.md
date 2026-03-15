# Bookmarks

A simple bookmark manager designed for speed and simplicity.

This extension supports both dark mode and light mode, card and list data views, full text search, sorting and pinning.

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

## Repository structure

Repository is structured into following folders

```
/src
  /__mocks__
  /background
  /shared
  /sidepanel
  /test
```

- `background` contains `service-worker.ts`, chrome api related functions and utility functions.
- `shared` contains shared constants, types and database related functions.
- `sidepanel` then contains react application itself

## Data storage

Bookmarks are stored locally in the browser using `chrome.storage.local`. Each bookmark is saved as an object in following structure:

```
id: string;
title: string;
url: string;
icon?: string;
iconAssetId?: string;
screenshotAssetId?: string;
description: string;
addedAt: string;
pinned?: boolean;
```

All bookmarks are stored under single storage key. Additions, deletions, pinning and unpinning are done through a service worker.
All these operations are functional both in browser extension context and outside, meaning the app works in a browser tab as well, outside of sidePanel, though with limited functionality which is sufficient for development purposes.

Information about `sorting` and `view type` are stored under separate storage key.

Assets, specifically icons and screenshots are stored separately in `IndexedDb` to avoid filling storage quota.

## Library choices and architectonical decissions

This app is using minimum dependencies to keep the extension small. It is not using any UI library or styling library aside what vite is providing out of the box. Therefore css modules are used for styling and radix-ui for some more complex components. Though it is using only skeletons of few components from radix-ui, not styles.

All shared components are API-agnostic and do not handle data fetching or persistence.

When it comes to sorting and searching, information about sort direction and view type is stored using `chrome.storage` api. Search and sorting are performed in the React app because they are UI concerns, not storage concerns. The service worker is responsible for storing and updating bookmark data, while the UI handles how that data is displayed, filtered, and ordered for the user.

In general, the service worker in this extension owns data storage and mutation, while the React app owns client-side presentation logic such as searching, and sorting. Performing these operations client-side keeps the architecture simpler and the interaction more responsive.

For search, `minisearch` is used as it is performant, indexes and ranks searched data and handles well things like fuzzy search.

The extension is also prepared for internacionalization and is using `i18next` and `react-i18next` for the React UI with all copy located in translation files.

To make the app functioning both in extension context and in a browser tab, runtime api and storage api have both chrome api functions and classes and browser api functions and classes. This way, the app can be developed and tested in a browser more efficiently providing the same functionality as chrome api.

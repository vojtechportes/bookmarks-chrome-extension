import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/app';
import { NotFound } from './components/not-found/not-found';
import { Panel } from './components/panel/panel';
import { AlertProvider } from './components/alert-provider/alert-provider';
import { BookmarksProvider } from './components/bookmarks-provider/bookmarks-provider';

import './styles/global.css';
import './i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense
      fallback={
        <Panel>
          <NotFound title="" buttonTitle="" alt="" loading />
        </Panel>
      }
    >
      <BookmarksProvider>
        <AlertProvider>
          <App />
        </AlertProvider>
      </BookmarksProvider>
    </Suspense>
  </StrictMode>,
);

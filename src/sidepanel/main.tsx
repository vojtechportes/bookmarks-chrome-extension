import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/app';

import './styles/global.css';
import './i18n';
import { NotFound } from './components/not-found/not-found';
import { Panel } from './components/panel/panel';
import { AlertProvider } from './components/alert-provider/alert-provider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense
      fallback={
        <Panel>
          <NotFound title="" buttonTitle="" loading />
        </Panel>
      }
    >
      <AlertProvider>
        <App />
      </AlertProvider>
    </Suspense>
  </StrictMode>,
);

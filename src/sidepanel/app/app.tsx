import { lazy, Suspense, type FC } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

const BookmarksScene = lazy(() =>
  import('../scenes/bookmarks-scene/bookmarks-scene').then((module) => ({
    default: module.BookmarksScene,
  })),
);

const SettingsScene = lazy(() =>
  import('../scenes/settings-scene/settings-scene').then((module) => ({
    default: module.SettingsScene,
  })),
);

export const App: FC = () => (
  <HashRouter>
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" Component={BookmarksScene} />
        <Route path="/settings" Component={SettingsScene} />
      </Routes>
    </Suspense>
  </HashRouter>
);

import { type FC } from 'react';
// import { prepareSummarizer } from '../utils/prepare-summarizer.util';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { BookmarksScene } from '../scenes/bookmarks-scene/bookmarks-scene';
import { SettingsScene } from '../scenes/settings-scene/settings-scene';

export const App: FC = () => (
  <HashRouter>
    <Routes>
      <Route path="/" Component={BookmarksScene} />
      <Route path="/settings" Component={SettingsScene} />
    </Routes>
  </HashRouter>
);

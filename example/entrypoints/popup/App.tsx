import { useEffect, useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import { settings } from '../../user-settings';
import type { UserSettings } from '../../user-settings';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [currentSettings, setCurrentSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    settings.getAll().then(setCurrentSettings);
    const stop = settings.onChange((next) => setCurrentSettings({ ...next }));
    return () => stop();
  }, []);

  const getDefaultTheme = () => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentSettings?.theme || getDefaultTheme());
  }, [currentSettings?.theme])

  const toggleTheme = async () => {
    if (!currentSettings) return;
    const nextTheme = currentSettings.theme === 'dark' ? 'light' : 'dark';
    await settings.set('theme', nextTheme as UserSettings['theme']);

  };

  return (
    <>
      <div>
        <a href="https://wxt.dev" target="_blank">
          <img src={wxtLogo} className="logo" alt="WXT logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>WXT + React + User Settings</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>entrypoints/popup/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div className="card">
        <h2>User settings</h2>
        {currentSettings ? (
          <div className="settings">
            <div>
              <strong>Theme:</strong> {currentSettings.theme}
            </div>
            <div>
              <strong>Notifications:</strong>{' '}
              {currentSettings.notifications ? 'On' : 'Off'}
            </div>
            <div>
              <strong>Username:</strong> {currentSettings.username}
            </div>
            <button onClick={toggleTheme}>Toggle theme</button>
          </div>
        ) : (
          <p>Loading settings…</p>
        )}
      </div>
      <p className="read-the-docs">Open the module-generated settings page to edit values.</p>
    </>
  );
}

export default App;

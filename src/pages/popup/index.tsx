import { createRoot } from 'react-dom/client';
import { App } from './App';

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find AppContainer');
  }
  const root = createRoot(appContainer);
  root.render(<App />);
}

init();

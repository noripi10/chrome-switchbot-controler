import packageJson from '../package.json';
import { ManifestType } from '@src/manifest-type';

const manifest: ManifestType = {
  manifest_version: 3,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  background: { service_worker: 'src/pages/background/index.js' },
  action: {
    default_popup: 'src/pages/popup/index.html',
    default_icon: 'icon-34.png',
  },
  icons: {
    '128': 'icon-128.png',
  },
  web_accessible_resources: [
    {
      resources: ['assets/jsx-runtime.*.js', 'contentStyle.css', 'icon-128.png', 'icon-34.png'],
      matches: ['*://*/*'],
    },
  ],
  author: 'noripi10',
  permissions: ['storage'],
};

export default manifest;

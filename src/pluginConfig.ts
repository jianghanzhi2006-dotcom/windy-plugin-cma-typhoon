import type { ExternalPluginConfig } from '@windy/plugins';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-cma-typhoon',
    version: '1.0.0',
    icon: '🌀',
    title: 'CMA Typhoon Tracker | 中央气象台台风追踪',
    description: 'China Meteorological Administration (CMA) real-time typhoon tracker with 17-level Beaufort scale and 120h forecast track.',
    author: 'jianghanzhi2006-dotcom',
    repository: 'https://github.com/jianghanzhi2006-dotcom/windy-plugin-cma-typhoon',
    desktopUI: 'rhpane',
    mobileUI: 'fullscreen',
};

export default config;

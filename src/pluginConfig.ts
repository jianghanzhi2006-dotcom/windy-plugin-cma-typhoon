import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-cma-typhoon',
    version: '1.0.2',
    icon: '🌀',
    title: '中央气象台 (CMA) 台风路径追踪',
    description:
        'CMA real-time typhoon tracker using the GB/T 28591-2012 0–17 wind scale, with a clearly labeled extended Level 18 above 61.2 m/s and GB/T 19201-2006 tropical-cyclone categories.',
    author: 'jianghanzhi2006-dotcom',
    repository: 'https://github.com/jianghanzhi2006-dotcom/windy-plugin-cma-typhoon',
    desktopUI: 'rhpane',
    mobileUI: 'fullscreen',
    private: false,
};

export default config;

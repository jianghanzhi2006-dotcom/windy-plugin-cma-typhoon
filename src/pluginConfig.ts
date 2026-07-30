import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-cma-typhoon',
    version: '1.0.0',
    icon: '🌀',
    title: '中央气象台 (CMA) 台风 17 级风级追踪',
    description: '对接中国中央气象台 (CMA) 高频加密数据，提供蒲氏 17 级风级与实时台风路径',
    author: 'JHZ',
    repository: 'https://github.com/JHZ/windy-plugin-cma-typhoon',
    desktopUI: 'rhpane',
    mobileUI: 'fullscreen',
    routerPath: '/cma-typhoon',
    private: true,
};

export default config;


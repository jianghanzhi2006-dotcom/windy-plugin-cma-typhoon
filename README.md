# windy-plugin-cma-typhoon

[![Windy Plugin](https://img.shields.io/badge/Windy-Plugin-blue.svg)](https://www.windy.com)
[![Data Source](<https://img.shields.io/badge/Data%20Source-CMA%20(typhoon.nmc.cn)-red.svg>)](https://typhoon.nmc.cn)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A third-party [Windy.com](https://www.windy.com) plugin for tracking Western Pacific typhoons with China Meteorological Administration (CMA) observed and forecast data.

## Standards and the extended Level 18

- **Wind force Levels 0–17:** mapped from 2-minute average wind speed according to **GB/T 28591-2012, Wind scale**. Under that standard, Level 17 starts at 56.1 m/s and has no separate upper level.
- **Level 18 (extended):** the plugin keeps an additional `> 61.2 m/s` display band because it makes exceptionally intense points easier to distinguish on the map. It is labeled **“18级（扩展）/ Level 18 (extended)”** throughout the UI and is a visualization convention of this plugin, not a level defined by GB/T 28591-2012.
- **Tropical-cyclone categories:** descriptions from tropical depression through super typhoon follow **GB/T 19201-2006, Grade of tropical cyclones**.

## Features

- 📡 **Live CMA data:** requests observed tracks and CMA forecast points directly from `typhoon.nmc.cn`.
- 🌈 **Color-coded track segments:** each observed segment is colored by wind force for quick intensity comparison.
- 🟡 **Golden dashed forecast line:** renders available CMA forecast points as a separate dashed path.
- 🕒 **Beijing-time conversion:** converts source timestamps from UTC to Beijing Time (UTC+8).
- 🖱️ **Interactive, touch-friendly points:** larger transparent hit areas make observed and forecast nodes easier to select.
- 🔄 **Controlled refresh lifecycle:** only one CMA refresh request stays active; closing the plugin cancels it and removes the plugin's own map listener and layers.

## Screenshot

![Plugin screenshot](src/screenshot.jpg)

## Installation status

This plugin is being prepared for Windy review. The official `publish-plugin` GitHub Actions workflow produces an installation URL after a version is uploaded. After Windy approves and lists the plugin, it can also be found from Windy's Plugins panel.

For local development, follow Windy's plugin-development setup and load this repository in developer mode.

## Development

```bash
npm install
npm run start
```

Create the distributable files in `dist/` with:

```bash
npm run build
```

The plugin is read-only with respect to CMA: it requests public track data and does not submit data to the source service.

## License

[MIT License](LICENSE) © 2026

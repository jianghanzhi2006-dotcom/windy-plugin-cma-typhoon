# windy-plugin-cma-typhoon

[![Windy Plugin](https://img.shields.io/badge/Windy-Plugin-blue.svg)](https://www.windy.com)
[![Data Source](https://img.shields.io/badge/Data%20Source-CMA%20(typhoon.nmc.cn)-red.svg)](https://typhoon.nmc.cn)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An official [Windy.com](https://www.windy.com) extension for real-time tracking of Western Pacific typhoons using official China Meteorological Administration (CMA) data and the 17-level Beaufort wind scale (GB/T 19201-2006).

## ✨ Features

- 📡 **Direct Live CMA Integration**: Connects directly to CMA servers (`typhoon.nmc.cn`) for official real-time observed track and 120-hour forecast points.
- 🌀 **17-Level Beaufort Scale**: Converts 2-minute average wind speed (m/s) into 1 to 17 Beaufort scale levels according to Chinese national standard GB/T 19201-2006.
- 🎨 **High Contrast Color Badges**: High contrast badges for both dark and light UI backgrounds, spanning Tropical Depressions to Super Typhoons.
- 🔴 **Dual Polyline Rendering**:
  - **Red Solid Polyline**: Historical observed real-time track.
  - **Golden Dashed Polyline**: CMA official +12h to +120h forecast track.
- 🕒 **Automatic UTC to Beijing Time (UTC+8) Conversion**: Automatically calculates accurate target forecast dates and times.
- 🖱️ **28px Touch-Friendly Hit Radius**: Large invisible hit areas for easy node selection and click-outside dismissal.

## 🚀 How to Use in Windy.com

1. Open [Windy.com](https://www.windy.com).
2. Open the right side panel -> **Plugins**.
3. Search for `cma-typhoon` and click to load!

## 📄 License

[MIT License](LICENSE) © 2026

# windy-plugin-cma-typhoon

[![Windy Plugin](https://img.shields.io/badge/Windy-Plugin-blue.svg)](https://www.windy.com)
[![Data Source](https://img.shields.io/badge/Data%20Source-CMA%20(typhoon.nmc.cn)-red.svg)](https://typhoon.nmc.cn)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An official [Windy.com](https://www.windy.com) extension for real-time tracking of Western Pacific typhoons using official China Meteorological Administration (CMA) data and the 18-level Beaufort wind scale (GB/T 19201-2006).

## ✨ Features

- 📡 **Direct Live CMA Integration**: Connects directly to CMA servers (`typhoon.nmc.cn`) for official real-time observed track and 120-hour forecast points.
- 🌀 **18-Level Beaufort Scale**: Converts 2-minute average wind speed (m/s) into 1–18 Beaufort scale levels according to Chinese national standard GB/T 19201-2006, distinguishing Level 17 and Level 18+ Super Typhoons.
- 🎨 **High Contrast Color Badges**: High contrast badges for both dark and light UI backgrounds, spanning Tropical Depressions to Super Typhoons.
- 🌈 **Color-Coded Track Segments**: Each segment of the observed track is colored by wind intensity level, providing an at-a-glance view of the typhoon's strength evolution.
- 🟡 **Golden Dashed Forecast Line**: CMA official +12h to +120h forecast track rendered as a golden dashed polyline.
- 🕒 **Automatic UTC to Beijing Time (UTC+8) Conversion**: Automatically calculates accurate target forecast dates and times.
- 🖱️ **Touch-Friendly Hit Radius**: Invisible hit areas for easy node selection and click-outside dismissal.

## 📸 Screenshot

![Plugin Screenshot](screenshot.png)

## 🚀 How to Use in Windy.com

1. Open [Windy.com](https://www.windy.com).
2. Open the right side panel -> **Plugins**.
3. Search for `cma-typhoon` and click to load!

## 📄 License

[MIT License](LICENSE) © 2026

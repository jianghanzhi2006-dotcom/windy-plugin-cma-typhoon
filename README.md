# windy-plugin-cma-typhoon

[![Windy Plugin](https://img.shields.io/badge/Windy-Plugin-blue.svg)](https://www.windy.com)
[![Data Source](https://img.shields.io/badge/Data%20Source-CMA%20(typhoon.nmc.cn)-red.svg)](https://typhoon.nmc.cn)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

中国中央气象台 (CMA) 官方实时与未来 120 小时台风 17 级蒲氏风级追踪插件，专为 [Windy.com](https://www.windy.com) 打造。

## ✨ 核心特性

- 📡 **100% 真实直连中央气象台**：直接拉取中国中央气象台 (`typhoon.nmc.cn`) 权威台风实况与预报报文。
- 🌀 **蒲氏 17 级风级全转换**：符合 GB/T 19201-2006 国家标准，精准将 2 分钟平均风速 (m/s) 转换为 1~17 级风力等级。
- 🎨 **高对比度风级配色**：自动适配暗色与亮色背景，清晰标示热带低压到超强台风。
- 🔴 **实况与未来 120 小时预报双折线**：
  - **红色实线**：历史至最新官方实况定位轨迹。
  - **金色虚线**：中央气象台未来 +12h 至 +120h 官方预测路径。
- 🕒 **全自动北京时间 (UTC+8) 换算**：准确计算未来预测目标时间（如明天 08:00、后天 20:00），避免时区混淆。
- 🖱️ **大范围 (28px) 点击感应与一键关闭**：免精准瞄准，在圆点附近轻松点击即可查看完整风力、气压与坐标，点击周围空白处一键收起。

## 🚀 使用方法

### 在 Windy.com 中加载

1. 打开 [Windy.com](https://www.windy.com) 页面。
2. 打开菜单栏 -> **插件 (Plugins)**。
3. 搜索 `cma-typhoon` 并点击加载即可！

## 📄 开源协议

[MIT License](LICENSE) © 2026

<div class="plugin__mobile-header">
    { title }
</div>
<section class="plugin__content">
    <div
        class="plugin__title plugin__title--chevron-back"
        on:click={ () => bcast.emit('rqstOpen', 'menu') }
    >
    { title }
    </div>
    
    <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #ffffff;">
        <div style="background: rgba(24, 144, 255, 0.15); border-left: 4px solid #1890ff; padding: 10px; margin-bottom: 12px; border-radius: 4px;">
            <strong style="color: #40a9ff; font-size: 14px;">🌀 CMA Typhoon Tracker | 中央气象台台风追踪</strong>
            <p style="font-size: 12px; color: #d9d9d9; margin: 4px 0 0 0;">
                Data Source: China Meteorological Administration (typhoon.nmc.cn)<br/>
                Scale: Beaufort 1~17 | 🔴 Track / 实况 🟡 120h Forecast / 预测
            </p>
        </div>

        <div style="margin-bottom: 12px; font-size: 13px; color: #ffffff; background: #1f1f1f; padding: 10px; border-radius: 6px; border: 1px solid #333; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">
            { statusText }
        </div>

        <button 
            on:click={ fetchCMATyphoonLive } 
            style="width: 100%; padding: 10px; background: #1890ff; color: #ffffff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; text-shadow: 0 1px 2px rgba(0,0,0,0.5);"
        >
            📡 刷新 CMA 实时数据 | Refresh Live Data
        </button>

        {#if typhoonListInfo.length > 0}
            <div style="margin-top: 15px;">
                <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #ffffff; font-weight: bold;">🌀 Live Typhoons | 活跃台风列表：</h4>
                {#each typhoonListInfo as item}
                    <div style="background: #1e1e1e; border-radius: 8px; padding: 12px; margin-bottom: 12px; border: 1px solid #3a3a3a; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid #333; padding-bottom: 6px;">
                            <strong style="color: #69c0ff; font-size: 15px;">🌀 {item.no} {item.nameCn} ({item.nameEn})</strong>
                            <span style="background: {item.status === 'Active / 进行中' ? '#275017' : '#434343'}; color: #ffffff; padding: 2px 8px; border-radius: 10px; font-size: 12px; font-weight: bold;">
                                ● {item.status}
                            </span>
                        </div>

                        <div style="margin-top: 8px;">
                            <div style="font-size: 12px; color: #8c8c8c; margin-bottom: 8px; font-weight: bold;">📜 Track Points | 历史实况轨迹 (Click to fly):</div>
                            <div style="max-height: 520px; overflow-y: auto; padding-right: 4px;">
                                {#each item.historyPoints as pt, idx}
                                    <div 
                                        on:click={() => focusPoint(pt)}
                                        style="background: {idx === 0 ? '#1b3547' : '#262626'}; border-radius: 6px; padding: 8px 12px; margin-bottom: 6px; font-size: 13px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; border: 1px solid {idx === 0 ? '#1890ff' : '#383838'}; transition: background 0.2s;"
                                    >
                                        <div style="display: flex; align-items: center; gap: 6px;">
                                            {#if idx === 0}
                                                <span style="background: #1890ff; color: #fff; font-size: 10px; padding: 1px 4px; border-radius: 3px; font-weight: bold;">Latest / 最新</span>
                                            {/if}
                                            <span style="color: #ffffff; font-weight: {idx === 0 ? 'bold' : 'normal'};">🕒 {pt.formatTime}</span>
                                        </div>

                                        <div style="display: flex; align-items: center; gap: 10px;">
                                            <span style="color: #aaa; font-size: 12px;">{pt.pressure} hPa</span>
                                            <span style="background: {pt.bft.color}; color: {pt.bft.textColor}; padding: 3px 10px; border-radius: 4px; font-weight: bold; text-shadow: {pt.bft.textColor === '#ffffff' ? '0 1px 2px rgba(0,0,0,0.8)' : 'none'}; min-width: 110px; text-align: center;">
                                                {pt.bft.text} ({pt.speedMs}m/s)
                                            </span>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</section>

<script lang="ts">
    import bcast from "@windy/broadcast";
    import { map } from "@windy/map";
    import { onDestroy, onMount } from 'svelte';
    import config from './pluginConfig';

    const { title } = config;

    let statusText = 'Click button to fetch CMA typhoon data / 点击发起中央气象台请求...';
    let typhoonListInfo: Array<any> = [];
    let layerGroup: any = null;

    function getBeaufort(ms: number) {
        if (ms < 0.3) return { text: "0级 / Calm", color: "#E8E8E8", textColor: "#000000" };
        if (ms <= 1.5) return { text: "1级 / Light Air", color: "#B5F5EC", textColor: "#000000" };
        if (ms <= 3.3) return { text: "2级 / Light Breeze", color: "#87E8DE", textColor: "#000000" };
        if (ms <= 5.4) return { text: "3级 / Gentle Breeze", color: "#5CDBD3", textColor: "#000000" };
        if (ms <= 7.9) return { text: "4级 / Moderate Breeze", color: "#95DE64", textColor: "#000000" };
        if (ms <= 10.7) return { text: "5级 / Fresh Breeze", color: "#73D13D", textColor: "#000000" };
        if (ms <= 13.8) return { text: "6级 / Strong Breeze", color: "#389E0D", textColor: "#FFFFFF" };
        if (ms <= 17.1) return { text: "7级 / High Wind", color: "#FADB14", textColor: "#000000" };
        if (ms <= 20.7) return { text: "8级 / TD (8级低压)", color: "#FA8C16", textColor: "#FFFFFF" };
        if (ms <= 24.4) return { text: "9级 / TS (9级风暴)", color: "#ED571A", textColor: "#FFFFFF" };
        if (ms <= 28.4) return { text: "10级 / STS (强热带风暴)", color: "#CF1322", textColor: "#FFFFFF" };
        if (ms <= 32.6) return { text: "11级 / Violent Storm", color: "#A8071A", textColor: "#FFFFFF" };
        if (ms <= 36.9) return { text: "12级 / TY (12级台风)", color: "#C41D7F", textColor: "#FFFFFF" };
        if (ms <= 41.4) return { text: "13级 / TY (13级台风)", color: "#9E1068", textColor: "#FFFFFF" };
        if (ms <= 46.1) return { text: "14级 / STY (强台风)", color: "#722ED1", textColor: "#FFFFFF" };
        if (ms <= 50.9) return { text: "15级 / STY (15级强台风)", color: "#531DAB", textColor: "#FFFFFF" };
        if (ms <= 56.0) return { text: "16级 / SuperTY (超强台风)", color: "#391085", textColor: "#FFFFFF" };
        return { text: "17级+ / SuperTY (17级超强台风)", color: "#120338", textColor: "#FFFFFF" };
    }

    function formatCleanTime(str: string) {
        if (!str || str.length < 12) return str;
        try {
            const y = parseInt(str.substring(0, 4), 10);
            const m = parseInt(str.substring(4, 6), 10) - 1;
            const d = parseInt(str.substring(6, 8), 10);
            const h = parseInt(str.substring(8, 10), 10);

            const utcDate = new Date(Date.UTC(y, m, d, h, 0, 0));
            const bjTimeMs = utcDate.getTime() + 8 * 3600 * 1000;
            const bjDate = new Date(bjTimeMs);

            const bjM = String(bjDate.getUTCMonth() + 1).padStart(2, '0');
            const bjD = String(bjDate.getUTCDate()).padStart(2, '0');
            const bjH = String(bjDate.getUTCHours()).padStart(2, '0');

            return `${bjM}-${bjD} ${bjH}:00`;
        } catch (e) {
            return str;
        }
    }

    function formatForecastTime(baseStr: string, fcHours: number) {
        if (!baseStr || baseStr.length < 12) return baseStr;
        try {
            const y = parseInt(baseStr.substring(0, 4), 10);
            const m = parseInt(baseStr.substring(4, 6), 10) - 1;
            const d = parseInt(baseStr.substring(6, 8), 10);
            const h = parseInt(baseStr.substring(8, 10), 10);

            const utcDate = new Date(Date.UTC(y, m, d, h, 0, 0));
            const targetMs = utcDate.getTime() + (fcHours * 3600 * 1000) + (8 * 3600 * 1000);
            const targetDate = new Date(targetMs);

            const bjM = String(targetDate.getUTCMonth() + 1).padStart(2, '0');
            const bjD = String(targetDate.getUTCDate()).padStart(2, '0');
            const bjH = String(targetDate.getUTCHours()).padStart(2, '0');

            return `${bjM}-${bjD} ${bjH}:00`;
        } catch (e) {
            return baseStr;
        }
    }

    export const onopen = (_params: unknown) => {
        fetchCMATyphoonLive();
    };

    export const onclose = () => {
        if (layerGroup) {
            layerGroup.clearLayers();
        }
    };

    function focusPoint(pt: any) {
        map.flyTo([pt.lat, pt.lng], 6);
        if (pt.markerInstance) {
            pt.markerInstance.openPopup();
        }
    }

    function renderTyphoonData(tfId: string, tfNo: string, tfNameCn: string, tfNameEn: string, rawData: any, tfStatus = 'Active / 进行中') {
        if (!window.L || !layerGroup) return;

        const points = rawData[8] || [];
        const realLatlngs: any[] = [];
        const realPointsList: any[] = [];

        map.off('click');
        map.on('click', () => { map.closePopup(); });

        // 1. 绘制历史实况点（双语 Popup）
        points.forEach((p: any) => {
            const timeStr = p[1];
            const lng = p[4];
            const lat = p[5];
            const pressure = p[6];
            const speedMs = p[7];
            const bft = getBeaufort(speedMs);
            const formattedT = formatCleanTime(timeStr);

            realLatlngs.push([lat, lng]);

            const popupHtml = `
                <div style="font-size:13px; line-height:1.6; color:#000; font-family:sans-serif; padding:2px;">
                    <strong style="font-size:15px; color:#1890ff;">🌀 ${tfNo} ${tfNameCn} (${tfNameEn}) [Observed / 实况]</strong><br/>
                    <b>📍 Time / 时间</b>：${formattedT}<br/>
                    <b>🌬️ Wind / 风级</b>：<span style="background:${bft.color}; color:${bft.textColor}; padding:2px 6px; border-radius:3px; font-weight:bold;">${bft.text} (${speedMs} m/s)</span><br/>
                    <b>📉 Pressure / 气压</b>：${pressure} hPa<br/>
                    <b>🧭 Location / 坐标</b>：${lat}°N, ${lng}°E
                </div>
            `;

            const popupOptions = { closeOnClick: true, autoClose: true };

            const hitArea = window.L.circleMarker([lat, lng], {
                radius: 28, stroke: false, fill: true, fillColor: '#ffffff', fillOpacity: 0.001, interactive: true
            }).addTo(layerGroup);

            const marker = window.L.circleMarker([lat, lng], {
                radius: 8, color: '#ffffff', weight: 2, fillColor: bft.color, fillOpacity: 0.95, interactive: true
            }).addTo(layerGroup);

            hitArea.bindPopup(popupHtml, popupOptions);
            marker.bindPopup(popupHtml, popupOptions);

            realPointsList.push({ lat, lng, timeStr, formatTime: formattedT, pressure, speedMs, bft, isForecast: false, markerInstance: hitArea });
        });

        if (realLatlngs.length > 0) {
            window.L.polyline(realLatlngs, { color: '#ff4d4f', weight: 4.5 }).addTo(layerGroup);
        }

        // 2. 绘制未来预测虚线（双语 Popup）
        if (points.length > 0) {
            const lastPointObj = points[points.length - 1];
            const forecastDict = lastPointObj[11] || {};
            const babjForecast = forecastDict['BABJ'] || (Object.values(forecastDict)[0] as any[]) || [];

            if (babjForecast.length > 0 && realLatlngs.length > 0) {
                const lastRealCoord = realLatlngs[realLatlngs.length - 1];
                const forecastLatlngs: any[] = [lastRealCoord];

                babjForecast.forEach((fc: any) => {
                    const fcHours = fc[0];
                    const baseTimeStr = fc[1];
                    const lng = fc[2];
                    const lat = fc[3];
                    const pressure = fc[4];
                    const speedMs = fc[5];
                    const bft = getBeaufort(speedMs);

                    const targetFormattedTime = formatForecastTime(baseTimeStr, fcHours);

                    forecastLatlngs.push([lat, lng]);

                    const fcPopupHtml = `
                        <div style="font-size:13px; line-height:1.6; color:#000; font-family:sans-serif; padding:2px;">
                            <strong style="font-size:15px; color:#faad14;">🔮 ${tfNo} ${tfNameCn} [CMA +${fcHours}h Forecast / 预测]</strong><br/>
                            <b>📍 Target Time / 时间</b>：${targetFormattedTime}<br/>
                            <b>🌬️ Forecast Wind / 风级</b>：<span style="background:${bft.color}; color:${bft.textColor}; padding:2px 6px; border-radius:3px; font-weight:bold;">${bft.text} (${speedMs} m/s)</span><br/>
                            <b>📉 Pressure / 气压</b>：${pressure} hPa<br/>
                            <b>🧭 Location / 坐标</b>：${lat}°N, ${lng}°E
                        </div>
                    `;

                    const popupOptions = { closeOnClick: true, autoClose: true };

                    const fcHitArea = window.L.circleMarker([lat, lng], {
                        radius: 28, stroke: false, fill: true, fillColor: '#ffffff', fillOpacity: 0.001, interactive: true
                    }).addTo(layerGroup);

                    const fcMarker = window.L.circleMarker([lat, lng], {
                        radius: 8, color: '#faad14', weight: 2.5, fillColor: bft.color, fillOpacity: 0.95, interactive: true
                    }).addTo(layerGroup);

                    fcHitArea.bindPopup(fcPopupHtml, popupOptions);
                    fcMarker.bindPopup(fcPopupHtml, popupOptions);
                });

                window.L.polyline(forecastLatlngs, { color: '#faad14', weight: 4, dashArray: '8,8' }).addTo(layerGroup);
            }
        }

        if (realPointsList.length > 0) {
            const reversedReal = [...realPointsList].reverse();

            typhoonListInfo = [...typhoonListInfo.filter(t => t.id !== tfId), {
                id: tfId,
                no: tfNo,
                nameCn: tfNameCn,
                nameEn: tfNameEn,
                status: tfStatus,
                historyPoints: reversedReal
            }];

            const latestPt = realLatlngs[realLatlngs.length - 1];
            map.flyTo([latestPt[0], latestPt[1]], 5);
        }
    }

    async function fetchCMATyphoonLive() {
        if (!window.L) return;
        if (!layerGroup) {
            layerGroup = window.L.layerGroup().addTo(map);
        }
        layerGroup.clearLayers();

        statusText = '🌐 Connecting to CMA server (typhoon.nmc.cn) / 正在发起请求...';
        typhoonListInfo = [];

        try {
            const currentYear = new Date().getFullYear();
            const listUrl = `https://typhoon.nmc.cn/weatherservice/typhoon/jsons/list_${currentYear}?callback=cmaLiveList`;
            
            const res = await fetch(listUrl);
            const text = await res.text();
            
            const match = text.match(/\((.*)\)/);
            if (!match || !match[1]) {
                statusText = '❌ Response format error / 数据解析失败';
                return;
            }

            const data = JSON.parse(match[1]);
            if (!data || !data.typhoonList || data.typhoonList.length === 0) {
                statusText = '⚠️ No active typhoon found / 当前无活跃台风';
                return;
            }

            const active = data.typhoonList.filter((t: any) => t[7] === 'start');
            const targetList = active.length > 0 ? active : data.typhoonList.slice(0, 3);

            statusText = `✅ Loaded ${targetList.length} typhoon(s) from CMA / 成功渲染台风轨迹`;

            for (const item of targetList) {
                const tfId = item[0];
                const tfNameEn = item[1];
                const tfNameCn = item[2];
                const tfNo = item[4];
                const tfStatus = item[7] === 'start' ? 'Active / 进行中' : 'Stopped / 已停编';

                const viewUrl = `https://typhoon.nmc.cn/weatherservice/typhoon/jsons/view_${tfId}?callback=cmaLiveView`;
                const viewRes = await fetch(viewUrl);
                const viewText = await viewRes.text();
                const viewMatch = viewText.match(/\((.*)\)/);
                if (viewMatch && viewMatch[1]) {
                    const viewData = JSON.parse(viewMatch[1]);
                    if (viewData && viewData.typhoon) {
                        renderTyphoonData(
                            tfId,
                            tfNo,
                            tfNameCn,
                            tfNameEn,
                            viewData.typhoon,
                            tfStatus
                        );
                    }
                }
            }
            
            statusText = `✅ Live track & 120h forecast rendered! / 红色实况与金色预报线条就绪！`;
        } catch (err: any) {
            console.error("Fetch error", err);
            statusText = `❌ Request blocked / 请求被拦截: ${err.message || 'Error'}`;
        }
    }

    onMount(() => {
        if (window.L && !layerGroup) {
            layerGroup = window.L.layerGroup().addTo(map);
        }
    });

    onDestroy(() => {
        onclose();
    });
</script>

<style lang="less">
    .plugin__content {
        color: #fff;
    }
</style>

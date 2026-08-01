<div class="plugin__mobile-header">
    {title}
</div>
<section class="plugin__content">
    <div
        class="plugin__title plugin__title--chevron-back"
        on:click={() => bcast.emit('rqstOpen', 'menu')}
    >
        {title}
    </div>

    <div
        style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #ffffff;"
    >
        <div
            style="background: rgba(24, 144, 255, 0.15); border-left: 4px solid #1890ff; padding: 10px; margin-bottom: 12px; border-radius: 4px;"
        >
            <strong style="color: #40a9ff; font-size: 14px;"
                >🌀 中央气象台 (CMA) 实时与预报路径</strong
            >
            <p style="font-size: 12px; color: #d9d9d9; margin: 4px 0 0 0;">
                数据来源：CMA 官方接口 (typhoon.nmc.cn)<br />
                风力标准：GB/T 28591-2012（0–17级，2分钟平均风速）<br />
                扩展显示：风速 &gt; 61.2 m/s 时标记为“18级（扩展）”<br />
                气旋等级：GB/T 19201-2006（热带低压至超强台风）<br />
                轨迹说明：🌈 分色实线 (实况) | 🟡 金色虚线 (120h预测)
            </p>
        </div>

        <div
            style="margin-bottom: 12px; font-size: 13px; color: #ffffff; background: #1f1f1f; padding: 10px; border-radius: 6px; border: 1px solid #333; text-shadow: 0 1px 2px rgba(0,0,0,0.8);"
        >
            {statusText}
        </div>

        <button
            on:click={fetchCMATyphoonLive}
            disabled={isLoading}
            style="width: 100%; padding: 10px; background: #1890ff; color: #ffffff; border: none; border-radius: 6px; font-weight: bold; cursor: {isLoading
                ? 'wait'
                : 'pointer'}; opacity: {isLoading
                ? 0.72
                : 1}; text-shadow: 0 1px 2px rgba(0,0,0,0.5);"
        >
            {isLoading ? '⏳ 正在刷新中央气象台数据…' : '📡 刷新中央气象台实时数据'}
        </button>

        {#if typhoonListInfo.length > 0}
            <div style="margin-top: 15px;">
                <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #ffffff; font-weight: bold;">
                    🌀 台风历史实况演变（最新在顶部）：
                </h4>
                {#each typhoonListInfo as item}
                    <div
                        style="background: #1e1e1e; border-radius: 8px; padding: 12px; margin-bottom: 12px; border: 1px solid #3a3a3a; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"
                    >
                        <div
                            style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid #333; padding-bottom: 6px;"
                        >
                            <strong style="color: #69c0ff; font-size: 15px;"
                                >🌀 {item.no} {item.nameCn} ({item.nameEn})</strong
                            >
                            <span
                                style="background: {item.status === '进行中'
                                    ? '#275017'
                                    : '#434343'}; color: #ffffff; padding: 2px 8px; border-radius: 10px; font-size: 12px; font-weight: bold;"
                            >
                                ● {item.status}
                            </span>
                        </div>

                        <div style="margin-top: 8px;">
                            <div
                                style="font-size: 12px; color: #8c8c8c; margin-bottom: 8px; font-weight: bold;"
                            >
                                📜 全程风力演变轨迹（最新在顶部，点击直达）：
                            </div>
                            <div style="max-height: 520px; overflow-y: auto; padding-right: 4px;">
                                {#each item.historyPoints as pt, idx}
                                    <div
                                        on:click={() => focusPoint(pt)}
                                        style="background: {idx === 0
                                            ? '#132738'
                                            : '#262626'}; border-radius: 6px; padding: 8px 12px; margin-bottom: 6px; font-size: 13px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; border: {idx ===
                                        0
                                            ? '1.5px solid #1890ff'
                                            : '1px solid #383838'}; box-shadow: {idx === 0
                                            ? '0 0 8px rgba(24,144,255,0.35)'
                                            : 'none'}; transition: all 0.2s;"
                                    >
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <span
                                                style="color: {idx === 0
                                                    ? '#40a9ff'
                                                    : '#ffffff'}; font-weight: {idx === 0
                                                    ? 'bold'
                                                    : 'normal'};">{pt.formatTime}</span
                                            >
                                        </div>

                                        <div style="display: flex; align-items: center; gap: 10px;">
                                            <span style="color: #aaa; font-size: 12px;"
                                                >{pt.pressure} hPa</span
                                            >
                                            <div
                                                style="background: {pt.bft.color}; color: {pt.bft
                                                    .textColor}; padding: 4px 10px; border-radius: 6px; font-weight: bold; text-shadow: {pt
                                                    .bft.textColor === '#ffffff'
                                                    ? '0 1px 2px rgba(0,0,0,0.8)'
                                                    : 'none'}; min-width: 110px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;"
                                            >
                                                <span
                                                    style="font-size: 13px; line-height: 1.2; white-space: nowrap;"
                                                    >{pt.bft.text}</span
                                                >
                                                <span
                                                    style="font-size: 12px; line-height: 1.2; opacity: 0.95; margin-top: 2px; white-space: nowrap;"
                                                    >({pt.speedMs}m/s){#if pt.bft.qualifier}<span
                                                            style="font-size: 10px; margin-left: 4px; padding: 0 3px; border: 1px solid currentColor; border-radius: 3px; opacity: 0.9;"
                                                            >{pt.bft.qualifier}</span
                                                        >{/if}</span
                                                >
                                            </div>
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
    import bcast from '@windy/broadcast';
    import { map } from '@windy/map';
    import { onDestroy, onMount } from 'svelte';
    import config from './pluginConfig';

    const { title } = config;

    let statusText = '点击上方按钮发起中央气象台实时联网请求...';
    let typhoonListInfo: any[] = [];
    let layerGroup: any = null;
    let activeRequest: AbortController | null = null;
    let requestSequence = 0;
    let isLoading = false;

    const handleMapClick = () => {
        map.closePopup();
    };

    function ensureLayerGroup() {
        if (!window.L) {
            return false;
        }

        if (!layerGroup) {
            layerGroup = window.L.layerGroup().addTo(map);
        }

        return true;
    }

    function releaseMapResources() {
        map.off('click', handleMapClick);
        map.closePopup();

        if (layerGroup) {
            layerGroup.clearLayers();
            (map as any).removeLayer(layerGroup);
            layerGroup = null;
        }
    }

    function cancelActiveRequest() {
        activeRequest?.abort();
        activeRequest = null;
        requestSequence += 1;
        isLoading = false;
    }

    async function fetchText(url: string, signal: AbortSignal) {
        const response = await fetch(url, { signal });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`.trim());
        }
        return response.text();
    }

    function parseJsonp(text: string, label: string) {
        const start = text.indexOf('(');
        const end = text.lastIndexOf(')');
        if (start < 0 || end <= start + 1) {
            throw new Error(`${label}返回格式异常`);
        }

        try {
            return JSON.parse(text.slice(start + 1, end));
        } catch {
            throw new Error(`${label}返回内容不是有效 JSON`);
        }
    }

    function isAbortError(error: unknown) {
        return error instanceof DOMException
            ? error.name === 'AbortError'
            : Boolean(
                  error &&
                  typeof error === 'object' &&
                  'name' in error &&
                  error.name === 'AbortError',
              );
    }

    type BeaufortInfo = {
        text: string;
        color: string;
        textColor: string;
        qualifier?: string;
    };

    function getBeaufort(ms: number): BeaufortInfo {
        if (ms < 0.3) {
            return { text: '0级无风', color: '#E8E8E8', textColor: '#000000' };
        }
        if (ms <= 1.5) {
            return { text: '1级软风', color: '#B5F5EC', textColor: '#000000' };
        }
        if (ms <= 3.3) {
            return { text: '2级轻风', color: '#87E8DE', textColor: '#000000' };
        }
        if (ms <= 5.4) {
            return { text: '3级微风', color: '#5CDBD3', textColor: '#000000' };
        }
        if (ms <= 7.9) {
            return { text: '4级和风', color: '#95DE64', textColor: '#000000' };
        }
        if (ms <= 10.7) {
            return { text: '5级清风', color: '#73D13D', textColor: '#000000' };
        }
        if (ms <= 13.8) {
            return { text: '6级强风', color: '#389E0D', textColor: '#FFFFFF' };
        }
        if (ms <= 17.1) {
            return { text: '7级劲风', color: '#FADB14', textColor: '#000000' };
        }
        if (ms <= 20.7) {
            return { text: '8级热带低压', color: '#FA8C16', textColor: '#FFFFFF' };
        }
        if (ms <= 24.4) {
            return { text: '9级热带风暴', color: '#ED571A', textColor: '#FFFFFF' };
        }
        if (ms <= 28.4) {
            return { text: '10级强热带风暴', color: '#CF1322', textColor: '#FFFFFF' };
        }
        if (ms <= 32.6) {
            return { text: '11级暴风', color: '#A8071A', textColor: '#FFFFFF' };
        }
        if (ms <= 36.9) {
            return { text: '12级台风', color: '#C41D7F', textColor: '#FFFFFF' };
        }
        if (ms <= 41.4) {
            return { text: '13级台风', color: '#9E1068', textColor: '#FFFFFF' };
        }
        if (ms <= 46.1) {
            return { text: '14级强台风', color: '#722ED1', textColor: '#FFFFFF' };
        }
        if (ms <= 50.9) {
            return { text: '15级强台风', color: '#531DAB', textColor: '#FFFFFF' };
        }
        if (ms <= 56.0) {
            return { text: '16级超强台风', color: '#391085', textColor: '#FFFFFF' };
        }
        if (ms <= 61.2) {
            return { text: '17级超强台风', color: '#230759', textColor: '#FFFFFF' };
        }
        // GB/T 28591-2012 ends at Level 17 (>=56.1 m/s). We retain this
        // explicitly labelled extension to make exceptionally high winds easier
        // to distinguish; it is a display convention, not a separate GB/T grade.
        return {
            text: '18级超强台风',
            qualifier: '扩展',
            color: '#120338',
            textColor: '#FFFFFF',
        };
    }

    function getBeaufortPopupText(bft: BeaufortInfo) {
        return bft.qualifier ? `${bft.text}（${bft.qualifier}显示）` : bft.text;
    }

    function formatCleanTime(str: string) {
        if (!str || str.length < 12) {
            return str;
        }
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
        if (!baseStr || baseStr.length < 12) {
            return baseStr;
        }
        try {
            const y = parseInt(baseStr.substring(0, 4), 10);
            const m = parseInt(baseStr.substring(4, 6), 10) - 1;
            const d = parseInt(baseStr.substring(6, 8), 10);
            const h = parseInt(baseStr.substring(8, 10), 10);

            const utcDate = new Date(Date.UTC(y, m, d, h, 0, 0));
            const targetMs = utcDate.getTime() + fcHours * 3600 * 1000 + 8 * 3600 * 1000;
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
        if (ensureLayerGroup()) {
            void fetchCMATyphoonLive();
        }
    };

    export const onclose = () => {
        cancelActiveRequest();
        releaseMapResources();
        typhoonListInfo = [];
        statusText = '插件已关闭；重新打开后可刷新中央气象台实时数据。';
    };

    function focusPoint(pt: any) {
        map.flyTo([pt.lat, pt.lng], 6);
        if (pt.markerInstance) {
            pt.markerInstance.openPopup();
        }
    }

    function renderTyphoonData(
        tfId: string,
        tfNo: string,
        tfNameCn: string,
        tfNameEn: string,
        rawData: any,
        tfStatus = '进行中',
    ) {
        if (!window.L || !layerGroup) {
            return;
        }

        const points = rawData[8] || [];
        const realSegments: any[] = []; // { latlng, color }
        const realPointsList: any[] = [];

        // 1. 绘制历史实况点（纯正中文）
        points.forEach((p: any) => {
            const timeStr = p[1];
            const lng = p[4];
            const lat = p[5];
            const pressure = p[6];
            const speedMs = p[7];
            const bft = getBeaufort(speedMs);
            const formattedT = formatCleanTime(timeStr);

            realSegments.push({ latlng: [lat, lng], color: bft.color });

            const popupHtml = `
                <div style="font-size:13px; line-height:1.6; color:#000; font-family:sans-serif; padding:2px;">
                    <strong style="font-size:15px; color:#1890ff;">🌀 ${tfNo} ${tfNameCn} (${tfNameEn}) [实况点]</strong><br/>
                    <b>📍 时间</b>：${formattedT}<br/>
                    <b>🌬️ 风力等级</b>：<span style="background:${bft.color}; color:${bft.textColor}; padding:2px 6px; border-radius:3px; font-weight:bold;">${getBeaufortPopupText(bft)} (${speedMs} m/s)</span><br/>
                    <b>📉 中心气压</b>：${pressure} hPa<br/>
                    <b>🧭 坐标</b>：${lat}°N, ${lng}°E
                </div>
            `;

            const popupOptions = { closeOnClick: true, autoClose: true };

            const hitArea = window.L.circleMarker([lat, lng], {
                radius: 18,
                stroke: false,
                fill: true,
                fillColor: '#ffffff',
                fillOpacity: 0.001,
                interactive: true,
            }).addTo(layerGroup);

            const marker = window.L.circleMarker([lat, lng], {
                radius: 4,
                color: '#ffffff',
                weight: 1.5,
                fillColor: bft.color,
                fillOpacity: 1,
                interactive: true,
            }).addTo(layerGroup);

            hitArea.bindPopup(popupHtml, popupOptions);
            marker.bindPopup(popupHtml, popupOptions);

            realPointsList.push({
                lat,
                lng,
                timeStr,
                formatTime: formattedT,
                pressure,
                speedMs,
                bft,
                isForecast: false,
                markerInstance: hitArea,
            });
        });

        // 绘制按风力等级分色的实况路径线段
        for (let i = 0; i < realSegments.length - 1; i++) {
            const segColor = realSegments[i].color;
            window.L.polyline([realSegments[i].latlng, realSegments[i + 1].latlng], {
                color: segColor,
                weight: 2.5,
            }).addTo(layerGroup);
        }

        // 2. 绘制未来预测线（纯正中文）
        if (points.length > 0) {
            const lastPointObj = points[points.length - 1];
            const forecastDict = lastPointObj[11] || {};
            const babjForecast =
                forecastDict['BABJ'] || (Object.values(forecastDict)[0] as any[]) || [];

            if (babjForecast.length > 0 && realSegments.length > 0) {
                const lastRealCoord = realSegments[realSegments.length - 1].latlng;
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
                            <strong style="font-size:15px; color:#faad14;">🔮 ${tfNo} ${tfNameCn} [中央气象台 +${fcHours}h 未来预测]</strong><br/>
                            <b>📍 预测目标时间</b>：${targetFormattedTime}<br/>
                            <b>🌬️ 预测风力</b>：<span style="background:${bft.color}; color:${bft.textColor}; padding:2px 6px; border-radius:3px; font-weight:bold;">${getBeaufortPopupText(bft)} (${speedMs} m/s)</span><br/>
                            <b>📉 预测中心气压</b>：${pressure} hPa<br/>
                            <b>🧭 坐标</b>：${lat}°N, ${lng}°E
                        </div>
                    `;

                    const popupOptions = { closeOnClick: true, autoClose: true };

                    const fcHitArea = window.L.circleMarker([lat, lng], {
                        radius: 18,
                        stroke: false,
                        fill: true,
                        fillColor: '#ffffff',
                        fillOpacity: 0.001,
                        interactive: true,
                    }).addTo(layerGroup);

                    const fcMarker = window.L.circleMarker([lat, lng], {
                        radius: 4,
                        color: '#faad14',
                        weight: 1.5,
                        fillColor: bft.color,
                        fillOpacity: 1,
                        interactive: true,
                    }).addTo(layerGroup);

                    fcHitArea.bindPopup(fcPopupHtml, popupOptions);
                    fcMarker.bindPopup(fcPopupHtml, popupOptions);
                });

                window.L.polyline(forecastLatlngs, {
                    color: '#faad14',
                    weight: 2.5,
                    dashArray: '6,6',
                }).addTo(layerGroup);
            }
        }

        if (realPointsList.length > 0) {
            const reversedReal = [...realPointsList].reverse();

            typhoonListInfo = [
                ...typhoonListInfo.filter(t => t.id !== tfId),
                {
                    id: tfId,
                    no: tfNo,
                    nameCn: tfNameCn,
                    nameEn: tfNameEn,
                    status: tfStatus,
                    historyPoints: reversedReal,
                },
            ];

            const latestPt = realSegments[realSegments.length - 1].latlng;
            map.flyTo([latestPt[0], latestPt[1]], 5);
        }
    }

    async function fetchCMATyphoonLive() {
        if (!ensureLayerGroup()) {
            statusText = '❌ 地图运行环境尚未就绪。';
            return;
        }

        activeRequest?.abort();
        const controller = new AbortController();
        activeRequest = controller;
        const requestId = ++requestSequence;
        isLoading = true;

        layerGroup.clearLayers();

        statusText = '🌐 正在向中央气象台服务器 (typhoon.nmc.cn) 请求实时与预报数据...';
        typhoonListInfo = [];
        let renderedCount = 0;
        let failedCount = 0;

        try {
            const currentYear = new Date().getFullYear();
            const listUrl = `https://typhoon.nmc.cn/weatherservice/typhoon/jsons/list_${currentYear}?callback=cmaLiveList`;

            const text = await fetchText(listUrl, controller.signal);
            if (controller.signal.aborted || requestId !== requestSequence) {
                return;
            }

            const data = parseJsonp(text, '台风列表');
            if (!Array.isArray(data?.typhoonList) || data.typhoonList.length === 0) {
                statusText = '⚠️ 中央气象台当前没有可显示的台风数据。';
                return;
            }

            const active = data.typhoonList.filter((t: any) => t[7] === 'start');
            const targetList = active.length > 0 ? active : data.typhoonList.slice(0, 3);

            statusText =
                active.length > 0
                    ? `✅ 台风列表获取成功，正在绘制 ${targetList.length} 个活跃台风...`
                    : `⚠️ 当前无活跃台风，正在显示最近 ${targetList.length} 个台风...`;

            for (const item of targetList) {
                if (controller.signal.aborted || requestId !== requestSequence) {
                    return;
                }

                const tfId = item[0];
                const tfNameEn = item[1];
                const tfNameCn = item[2];
                const tfNo = item[4];
                const tfStatus = item[7] === 'start' ? '进行中' : '已停编';

                try {
                    const viewUrl = `https://typhoon.nmc.cn/weatherservice/typhoon/jsons/view_${tfId}?callback=cmaLiveView`;
                    const viewText = await fetchText(viewUrl, controller.signal);
                    if (controller.signal.aborted || requestId !== requestSequence) {
                        return;
                    }

                    const viewData = parseJsonp(viewText, `${tfNo} 台风详情`);
                    if (viewData && viewData.typhoon) {
                        renderTyphoonData(
                            tfId,
                            tfNo,
                            tfNameCn,
                            tfNameEn,
                            viewData.typhoon,
                            tfStatus,
                        );
                        renderedCount += 1;
                    } else {
                        failedCount += 1;
                    }
                } catch (error) {
                    if (isAbortError(error)) {
                        throw error;
                    }
                    failedCount += 1;
                    console.warn(`获取台风 ${tfNo} 详情失败`, error);
                }
            }

            if (controller.signal.aborted || requestId !== requestSequence) {
                return;
            }
            statusText =
                renderedCount > 0
                    ? `✅ 已绘制 ${renderedCount} 个台风的实况路径与金色预报虚线${failedCount > 0 ? `，${failedCount} 个详情请求失败` : ''}。`
                    : '❌ 台风列表已返回，但未能绘制任何详情数据。';
        } catch (error: unknown) {
            if (isAbortError(error)) {
                return;
            }

            console.error('中央气象台实时数据请求失败', error);
            const message = error instanceof Error ? error.message : String(error);
            if (/返回格式|有效 JSON/.test(message)) {
                statusText = `❌ 数据解析失败：${message}。`;
            } else if (/^HTTP /.test(message)) {
                statusText = `❌ 中央气象台服务器返回错误：${message}。`;
            } else {
                statusText = `❌ 网络请求失败：${message || '请检查网络连接、浏览器策略或数据源状态'}。`;
            }
        } finally {
            if (activeRequest === controller) {
                activeRequest = null;
            }
            if (requestId === requestSequence) {
                isLoading = false;
            }
        }
    }

    onMount(() => {
        if (ensureLayerGroup()) {
            // Register exactly once per component lifecycle. Never remove listeners owned by Windy.
            map.off('click', handleMapClick);
            map.on('click', handleMapClick);
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

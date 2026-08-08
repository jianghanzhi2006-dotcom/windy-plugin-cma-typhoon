<div class="plugin__mobile-header">
    {title}
</div>
<section class="plugin__content">
    <div
        class="plugin__title plugin__title--chevron-back"
        on:click={returnToMenu}
        on:keydown={event => handleActivationKeydown(event, returnToMenu)}
        role="button"
        tabindex="0"
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
                风力级数：GB/T 28591-2012（0–17级）<br />
                扩展显示：风速 &gt; 61.2 m/s 时标记为“18级（扩展）”<br />
                气旋等级：GB/T 19201-2006（2分钟平均风）<br />
                轨迹说明：🌈 分色实线 (实况) | 🟡 金色虚线 (120h预测)<br />
                更新与停编：打开时及手动刷新；已停编仅显示历史实况
            </p>
        </div>

        <div
            style="margin-bottom: 12px; font-size: 13px; color: #ffffff; background: #1f1f1f; padding: 10px; border-radius: 6px; border: 1px solid #333; text-shadow: 0 1px 2px rgba(0,0,0,0.8);"
        >
            {statusText}
        </div>

        <button
            on:click={() => void fetchCMATyphoonLive('manual')}
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
                        <button
                            type="button"
                            on:click={() => toggleTyphoonPanel(item.id)}
                            aria-expanded={expandedTyphoonId === item.id}
                            style="width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 0 0 {expandedTyphoonId ===
                            item.id
                                ? '6px'
                                : '0'}; margin: 0 0 {expandedTyphoonId === item.id
                                ? '8px'
                                : '0'}; border: none; border-bottom: {expandedTyphoonId === item.id
                                ? '1px solid #333'
                                : 'none'}; background: transparent; color: inherit; text-align: left; cursor: pointer; font: inherit;"
                        >
                            <strong style="color: #69c0ff; font-size: 15px;"
                                >🌀 {item.no} {item.nameCn} ({item.nameEn})</strong
                            >
                            <span
                                style="display: flex; align-items: center; gap: 7px; flex-shrink: 0;"
                            >
                                <span
                                    style="background: {item.status === '进行中'
                                        ? '#275017'
                                        : '#434343'}; color: #ffffff; padding: 2px 8px; border-radius: 10px; font-size: 12px; font-weight: bold;"
                                >
                                    ● {item.status}
                                </span>
                                <span
                                    aria-hidden="true"
                                    style="color: #bfbfbf; font-size: 12px; line-height: 1; width: 12px; text-align: center;"
                                    >{expandedTyphoonId === item.id ? '▼' : '▶'}</span
                                >
                            </span>
                        </button>

                        {#if expandedTyphoonId === item.id}
                            <div style="margin-top: 8px;">
                                <div
                                    style="font-size: 12px; color: #8c8c8c; margin-bottom: 8px; font-weight: bold;"
                                >
                                    📜 全程风力演变轨迹（最新在顶部，点击直达）：
                                </div>
                                <div
                                    style="max-height: 520px; overflow-y: auto; padding-right: 4px;"
                                >
                                    {#each item.historyPoints as pt, idx}
                                        <div
                                            on:click={() => focusPoint(pt)}
                                            on:keydown={event =>
                                                handleActivationKeydown(event, () =>
                                                    focusPoint(pt),
                                                )}
                                            role="button"
                                            tabindex="0"
                                            style="background: {idx === 0
                                                ? '#132738'
                                                : '#262626'}; border-radius: 6px; padding: 8px 12px; margin-bottom: 6px; font-size: 13px; display: grid; grid-template-columns: 64px 48px minmax(108px, 126px); column-gap: 8px; justify-content: space-between; align-items: center; cursor: pointer; border: {idx ===
                                            0
                                                ? '1.5px solid #1890ff'
                                                : '1px solid #383838'}; box-shadow: {idx === 0
                                                ? '0 0 8px rgba(24,144,255,0.35)'
                                                : 'none'}; transition: all 0.2s;"
                                        >
                                            <div
                                                style="min-width: 0; display: flex; flex-direction: column; align-items: flex-start; line-height: 1.25; font-variant-numeric: tabular-nums;"
                                            >
                                                <span
                                                    style="color: {idx === 0
                                                        ? '#40a9ff'
                                                        : '#ffffff'}; font-weight: {idx === 0
                                                        ? 'bold'
                                                        : 'normal'}; white-space: nowrap;"
                                                    >{pt.displayDate}</span
                                                >
                                                <span
                                                    style="color: {idx === 0
                                                        ? '#40a9ff'
                                                        : '#ffffff'}; font-weight: {idx === 0
                                                        ? 'bold'
                                                        : 'normal'}; white-space: nowrap;"
                                                    >{pt.displayTime}</span
                                                >
                                            </div>

                                            <div
                                                style="min-width: 0; display: flex; flex-direction: column; align-items: flex-start; color: #aaa; font-size: 12px; line-height: 1.25; font-variant-numeric: tabular-nums;"
                                            >
                                                <span style="white-space: nowrap;"
                                                    >{pt.pressure}</span
                                                >
                                                <span style="white-space: nowrap;">hPa</span>
                                            </div>

                                            <div
                                                style="box-sizing: border-box; width: 100%; min-width: 0; background: {pt
                                                    .bft.color}; color: {pt.bft
                                                    .textColor}; padding: 4px 6px; border-radius: 6px; font-weight: bold; text-shadow: {pt
                                                    .bft.textColor === '#ffffff'
                                                    ? '0 1px 2px rgba(0,0,0,0.8)'
                                                    : 'none'}; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;"
                                            >
                                                <span
                                                    style="font-size: 13px; line-height: 1.2; white-space: nowrap;"
                                                    >{pt.bft.text}</span
                                                >
                                                <span
                                                    style="font-size: 12px; line-height: 1.2; opacity: 0.95; margin-top: 2px; white-space: nowrap;"
                                                    >({pt.speedDisplay}){#if pt.bft.qualifier}<span
                                                            style="font-size: 10px; margin-left: 4px; padding: 0 3px; border: 1px solid currentColor; border-radius: 3px; opacity: 0.9;"
                                                            >{pt.bft.qualifier}</span
                                                        >{/if}</span
                                                >
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        {/if}
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
    import {
        escapeHtml,
        formatBeijingRefreshTime,
        formatCleanTime,
        formatForecastTime,
        getBeaufort,
        getCmaListYears,
        getLatestObservationTime,
        isValidLatLng,
        parseJsonpPayload,
        selectDefaultTyphoon,
        selectRecentStopped,
        shouldRenderForecast,
        splitDisplayTime,
        toFiniteNumber,
        toNonNegativeNumber,
    } from './typhoonLogic';

    type TyphoonStatus = '进行中' | '已停编';
    type RefreshReason = 'open' | 'manual';

    type LoadedTyphoon = {
        id: string;
        no: string;
        nameCn: string;
        nameEn: string;
        rawData: any;
        status: TyphoonStatus;
        latestObservationTime: string;
    };

    type CachedStoppedTyphoon = {
        value: LoadedTyphoon;
        cachedAt: number;
    };

    const { title } = config;
    const REQUEST_TIMEOUT_MS = 20 * 1000;
    const REFRESH_TIMEOUT_MS = 30 * 1000;
    const STOPPED_CACHE_MS = 30 * 60 * 1000;
    const DETAIL_CONCURRENCY = 6;
    const RECENT_STOPPED_WITH_ACTIVE = 1;
    const RECENT_STOPPED_WITHOUT_ACTIVE = 3;

    let statusText = '点击上方按钮发起中央气象台实时联网请求...';
    let typhoonListInfo: any[] = [];
    let layerGroup: any = null;
    let activeRequest: AbortController | null = null;
    let requestSequence = 0;
    let isLoading = false;
    let expandedTyphoonId: string | number | null = null;
    const stoppedTyphoonCache = new Map<string, CachedStoppedTyphoon>();

    const handleMapClick = () => {
        map.closePopup();
    };

    function returnToMenu() {
        bcast.emit('rqstOpen', 'menu');
    }

    function handleActivationKeydown(event: KeyboardEvent, action: () => void) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            action();
        }
    }

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
        const requestController = new AbortController();
        let timedOut = false;
        const forwardAbort = () => requestController.abort();

        if (signal.aborted) {
            requestController.abort();
        } else {
            signal.addEventListener('abort', forwardAbort, { once: true });
        }

        const timeoutId = setTimeout(() => {
            timedOut = true;
            requestController.abort();
        }, REQUEST_TIMEOUT_MS);

        try {
            const response = await fetch(url, { signal: requestController.signal });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} ${response.statusText}`.trim());
            }
            return await response.text();
        } catch (error) {
            if (timedOut) {
                throw new Error(`请求超时（${REQUEST_TIMEOUT_MS / 1000} 秒）`);
            }
            throw error;
        } finally {
            clearTimeout(timeoutId);
            signal.removeEventListener('abort', forwardAbort);
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

    export const onopen = (_params: unknown) => {
        if (ensureLayerGroup()) {
            void fetchCMATyphoonLive('open');
        }
    };

    export const onclose = () => {
        cancelActiveRequest();
        releaseMapResources();
        typhoonListInfo = [];
        expandedTyphoonId = null;
        statusText = '插件已关闭；重新打开后可刷新中央气象台实时数据。';
    };

    function toggleTyphoonPanel(tfId: string | number) {
        expandedTyphoonId = expandedTyphoonId === tfId ? null : tfId;
    }

    function restoreSelectionAfterRefresh(
        previousExpandedId: string | number | null,
        hadPreviousDisplay: boolean,
    ) {
        if (hadPreviousDisplay) {
            if (previousExpandedId === null) {
                expandedTyphoonId = null;
                return;
            }

            const stillAvailable = typhoonListInfo.some(
                item => String(item.id) === String(previousExpandedId),
            );
            if (stillAvailable) {
                expandedTyphoonId = previousExpandedId;
                return;
            }

            expandedTyphoonId = selectDefaultTyphoon(typhoonListInfo)?.id ?? null;
            return;
        }

        const selected = selectDefaultTyphoon(typhoonListInfo);

        if (!selected) {
            expandedTyphoonId = null;
            return;
        }

        expandedTyphoonId = selected.id;
        const latestPoint = selected.historyPoints?.[0];
        if (latestPoint) {
            map.flyTo([latestPoint.lat, latestPoint.lng], 5);
        }
    }

    function focusPoint(pt: any) {
        map.flyTo([pt.lat, pt.lng], 6);
        if (pt.markerInstance) {
            pt.markerInstance.openPopup();
        }
    }

    function renderTyphoonData(
        targetLayerGroup: any,
        tfId: string,
        tfNo: string,
        tfNameCn: string,
        tfNameEn: string,
        rawData: any,
        tfStatus: TyphoonStatus = '进行中',
    ) {
        if (!window.L || !targetLayerGroup) {
            return null;
        }

        const points = Array.isArray(rawData?.[8]) ? rawData[8] : [];
        const realSegments: any[] = []; // { latlng, color }
        const realPointsList: any[] = [];
        const safeNo = escapeHtml(tfNo);
        const safeNameCn = escapeHtml(tfNameCn);
        const safeNameEn = escapeHtml(tfNameEn);

        // 1. 绘制历史实况点（纯正中文）
        for (const point of points) {
            if (!Array.isArray(point) || !isValidLatLng(point[5], point[4])) {
                continue;
            }

            const timeStr =
                typeof point[1] === 'string' && point[1].trim() !== ''
                    ? point[1]
                    : '时间未知';
            const lng = toFiniteNumber(point[4]);
            const lat = toFiniteNumber(point[5]);
            if (lat === null || lng === null) {
                continue;
            }

            const pressureValue = toNonNegativeNumber(point[6]);
            const pressure = pressureValue === null ? '—' : pressureValue;
            const speedMs = toNonNegativeNumber(point[7]);
            const speedDisplay = speedMs === null ? '—' : `${speedMs}m/s`;
            const bft = getBeaufort(speedMs);
            const formattedT = formatCleanTime(timeStr);
            const { date: displayDate, time: displayTime } = splitDisplayTime(formattedT);
            const safeFormattedTime = escapeHtml(formattedT);
            const safePressure = escapeHtml(pressure);
            const safeSpeedDisplay = escapeHtml(speedMs === null ? '—' : `${speedMs} m/s`);
            const safeLat = escapeHtml(lat);
            const safeLng = escapeHtml(lng);

            realSegments.push({ latlng: [lat, lng], color: bft.color });

            const popupHtml = `
                <div style="font-size:13px; line-height:1.6; color:#000; font-family:sans-serif; padding:2px;">
                    <strong style="font-size:15px; color:#1890ff;">🌀 ${safeNo} ${safeNameCn} (${safeNameEn}) [实况点]</strong><br/>
                    <b>📍 时间</b>：${safeFormattedTime}<br/>
                    <b>🌬️ 风力等级</b>：<span style="background:${bft.color}; color:${bft.textColor}; padding:2px 6px; border-radius:3px; font-weight:bold;">${escapeHtml(bft.text)} (${safeSpeedDisplay})</span><br/>
                    <b>📉 中心气压</b>：${safePressure} hPa<br/>
                    <b>🧭 坐标</b>：${safeLat}°N, ${safeLng}°E
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
            }).addTo(targetLayerGroup);

            const marker = window.L.circleMarker([lat, lng], {
                radius: 4,
                stroke: false,
                fill: true,
                fillColor: bft.color,
                fillOpacity: 1,
                interactive: true,
            }).addTo(targetLayerGroup);

            hitArea.bindPopup(popupHtml, popupOptions);
            marker.bindPopup(popupHtml, popupOptions);

            realPointsList.push({
                lat,
                lng,
                timeStr,
                formatTime: formattedT,
                displayDate,
                displayTime,
                pressure,
                speedMs,
                speedDisplay,
                bft,
                isForecast: false,
                markerInstance: hitArea,
            });
        }

        // 绘制按风力等级分色的实况路径线段
        for (let i = 0; i < realSegments.length - 1; i++) {
            const segColor = realSegments[i].color;
            window.L.polyline([realSegments[i].latlng, realSegments[i + 1].latlng], {
                color: segColor,
                weight: 2.5,
            }).addTo(targetLayerGroup);
        }

        // 2. 只有仍在编号的台风才绘制未来预测线；停编台风只保留历史实况。
        if (shouldRenderForecast(tfStatus) && points.length > 0) {
            const lastPointObj = points[points.length - 1];
            const forecastDict =
                Array.isArray(lastPointObj) &&
                lastPointObj[11] &&
                typeof lastPointObj[11] === 'object'
                    ? lastPointObj[11]
                    : {};
            const forecastCandidate =
                forecastDict['BABJ'] || Object.values(forecastDict)[0] || [];
            const babjForecast = Array.isArray(forecastCandidate) ? forecastCandidate : [];

            if (babjForecast.length > 0 && realSegments.length > 0) {
                const lastRealCoord = realSegments[realSegments.length - 1].latlng;
                const forecastLatlngs: any[] = [lastRealCoord];

                for (const forecastPoint of babjForecast) {
                    if (
                        !Array.isArray(forecastPoint) ||
                        !isValidLatLng(forecastPoint[3], forecastPoint[2])
                    ) {
                        continue;
                    }

                    const fcHours = toNonNegativeNumber(forecastPoint[0]);
                    const baseTimeStr =
                        typeof forecastPoint[1] === 'string' ? forecastPoint[1] : '';
                    const lng = toFiniteNumber(forecastPoint[2]);
                    const lat = toFiniteNumber(forecastPoint[3]);
                    if (fcHours === null || lat === null || lng === null) {
                        continue;
                    }

                    const pressureValue = toNonNegativeNumber(forecastPoint[4]);
                    const pressure = pressureValue === null ? '—' : pressureValue;
                    const speedMs = toNonNegativeNumber(forecastPoint[5]);
                    const bft = getBeaufort(speedMs);

                    const targetFormattedTime = formatForecastTime(baseTimeStr, fcHours);
                    const safeForecastTime = escapeHtml(targetFormattedTime);
                    const safePressure = escapeHtml(pressure);
                    const safeSpeedDisplay = escapeHtml(
                        speedMs === null ? '—' : `${speedMs} m/s`,
                    );

                    forecastLatlngs.push([lat, lng]);

                    const fcPopupHtml = `
                        <div style="font-size:13px; line-height:1.6; color:#000; font-family:sans-serif; padding:2px;">
                            <strong style="font-size:15px; color:#faad14;">🔮 ${safeNo} ${safeNameCn} [中央气象台 +${fcHours}h 未来预测]</strong><br/>
                            <b>📍 预测目标时间</b>：${safeForecastTime}<br/>
                            <b>🌬️ 预测风力</b>：<span style="background:${bft.color}; color:${bft.textColor}; padding:2px 6px; border-radius:3px; font-weight:bold;">${escapeHtml(bft.text)} (${safeSpeedDisplay})</span><br/>
                            <b>📉 预测中心气压</b>：${safePressure} hPa<br/>
                            <b>🧭 坐标</b>：${escapeHtml(lat)}°N, ${escapeHtml(lng)}°E
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
                    }).addTo(targetLayerGroup);

                    const fcMarker = window.L.circleMarker([lat, lng], {
                        radius: 4,
                        color: '#faad14',
                        weight: 1.5,
                        fillColor: bft.color,
                        fillOpacity: 1,
                        interactive: true,
                    }).addTo(targetLayerGroup);

                    fcHitArea.bindPopup(fcPopupHtml, popupOptions);
                    fcMarker.bindPopup(fcPopupHtml, popupOptions);
                }

                if (forecastLatlngs.length > 1) {
                    window.L.polyline(forecastLatlngs, {
                        color: '#faad14',
                        weight: 2.5,
                        dashArray: '6,6',
                    }).addTo(targetLayerGroup);
                }
            }
        }

        if (realPointsList.length > 0) {
            const reversedReal = [...realPointsList].reverse();

            return {
                id: tfId,
                no: tfNo,
                nameCn: tfNameCn,
                nameEn: tfNameEn,
                status: tfStatus,
                latestObservationTime: getLatestObservationTime(rawData),
                historyPoints: reversedReal,
            };
        }

        return null;
    }

    async function mapWithConcurrency<T, R>(
        items: T[],
        concurrency: number,
        mapper: (item: T) => Promise<R>,
    ): Promise<R[]> {
        const results = new Array<R>(items.length);
        let nextIndex = 0;

        async function worker() {
            while (nextIndex < items.length) {
                const currentIndex = nextIndex;
                nextIndex += 1;
                results[currentIndex] = await mapper(items[currentIndex]);
            }
        }

        const workerCount = Math.min(items.length, Math.max(1, concurrency));
        await Promise.all(Array.from({ length: workerCount }, () => worker()));
        return results;
    }

    function mergeTyphoonLists(lists: any[][]): any[] {
        const merged = new Map<string, any>();

        for (const list of lists) {
            for (const item of list) {
                if (!Array.isArray(item) || item[0] === null || item[0] === undefined) {
                    continue;
                }

                const id = String(item[0]);
                const existing = merged.get(id);
                if (!existing || item[7] === 'start') {
                    merged.set(id, item);
                }
            }
        }

        return [...merged.values()];
    }

    async function loadTyphoonLists(
        years: number[],
        controller: AbortController,
        requestId: number,
    ): Promise<{ items: any[]; failedYears: number[] }> {
        const failedYears: number[] = [];
        let firstFailure: unknown = null;
        const lists = await Promise.all(
            years.map(async year => {
                const listUrl = `https://typhoon.nmc.cn/weatherservice/typhoon/jsons/list_${year}?callback=cmaLiveList`;
                try {
                    const text = await fetchText(listUrl, controller.signal);
                    if (controller.signal.aborted || requestId !== requestSequence) {
                        return [];
                    }

                    const data = parseJsonpPayload<any>(text, `${year} 年台风列表`);
                    return Array.isArray(data?.typhoonList) ? data.typhoonList : [];
                } catch (error) {
                    if (isAbortError(error)) {
                        throw error;
                    }
                    firstFailure ??= error;
                    failedYears.push(year);
                    console.warn(`获取 ${year} 年台风列表失败`, error);
                    return [];
                }
            }),
        );

        if (failedYears.length === years.length) {
            throw firstFailure instanceof Error
                ? firstFailure
                : new Error(`全部年度台风列表请求失败（${years.join('、')}）`);
        }

        return { items: mergeTyphoonLists(lists), failedYears };
    }

    async function loadTyphoonDetail(
        item: any,
        status: TyphoonStatus,
        controller: AbortController,
        requestId: number,
    ): Promise<LoadedTyphoon | null> {
        const id = String(item[0]);
        const no = String(item[4] ?? '');
        const nameEn = String(item[1] ?? '');
        const nameCn = String(item[2] ?? '');

        if (status === '已停编') {
            const cached = stoppedTyphoonCache.get(id);
            if (cached && Date.now() - cached.cachedAt < STOPPED_CACHE_MS) {
                return cached.value;
            }
        }

        const viewUrl = `https://typhoon.nmc.cn/weatherservice/typhoon/jsons/view_${encodeURIComponent(id)}?callback=cmaLiveView`;
        const viewText = await fetchText(viewUrl, controller.signal);
        if (controller.signal.aborted || requestId !== requestSequence) {
            return null;
        }

        const viewData = parseJsonpPayload<any>(viewText, `${no} 台风详情`);
        if (!viewData?.typhoon) {
            return null;
        }

        const value: LoadedTyphoon = {
            id,
            no,
            nameCn,
            nameEn,
            rawData: viewData.typhoon,
            status,
            latestObservationTime: getLatestObservationTime(viewData.typhoon),
        };

        if (status === '已停编') {
            stoppedTyphoonCache.set(id, { value, cachedAt: Date.now() });
        }

        return value;
    }

    async function fetchCMATyphoonLive(reason: RefreshReason = 'manual') {
        if (!ensureLayerGroup()) {
            statusText = '❌ 地图运行环境尚未就绪。';
            return;
        }

        const previousExpandedId = expandedTyphoonId;
        const hadPreviousDisplay = typhoonListInfo.length > 0;
        activeRequest?.abort();
        const controller = new AbortController();
        let refreshTimedOut = false;
        const refreshTimeoutId = setTimeout(() => {
            refreshTimedOut = true;
            controller.abort();
        }, REFRESH_TIMEOUT_MS);
        activeRequest = controller;
        const requestId = ++requestSequence;
        isLoading = true;

        statusText =
            reason === 'manual'
                ? '🌐 正在手动刷新中央气象台实时与预报数据；完成前保留当前地图和选择...'
                : '🌐 正在加载中央气象台实时与预报数据...';
        let failedCount = 0;
        let pendingLayerGroup: any = null;

        try {
            const listYears = getCmaListYears(new Date());
            const { items: typhoonItems, failedYears } = await loadTyphoonLists(
                listYears,
                controller,
                requestId,
            );
            if (controller.signal.aborted || requestId !== requestSequence) {
                return;
            }

            if (typhoonItems.length === 0) {
                statusText = hadPreviousDisplay
                    ? '⚠️ 中央气象台当前列表为空；已保留上次成功显示。'
                    : '⚠️ 中央气象台当前没有可显示的台风数据。';
                return;
            }

            const activeItems = typhoonItems.filter((item: any) => item[7] === 'start');
            const stoppedItems = typhoonItems.filter((item: any) => item[7] === 'stop');
            const ignoredStatusCount = typhoonItems.length - activeItems.length - stoppedItems.length;
            const recentStoppedLimit =
                activeItems.length > 0
                    ? RECENT_STOPPED_WITH_ACTIVE
                    : RECENT_STOPPED_WITHOUT_ACTIVE;

            statusText =
                activeItems.length > 0
                    ? `✅ 台风列表获取成功，正在加载 ${activeItems.length} 个活跃台风，并核对 ${stoppedItems.length} 个停编记录的最后实况时间...`
                    : `⚠️ 当前无活跃台风，正在核对 ${stoppedItems.length} 个停编记录并查找最近 ${recentStoppedLimit} 个...`;

            const loadSafely = async (item: any, itemStatus: TyphoonStatus) => {
                try {
                    const loaded = await loadTyphoonDetail(
                        item,
                        itemStatus,
                        controller,
                        requestId,
                    );
                    if (!loaded) {
                        failedCount += 1;
                    }
                    return loaded;
                } catch (error) {
                    if (isAbortError(error)) {
                        throw error;
                    }
                    failedCount += 1;
                    console.warn(`获取台风 ${String(item[4] ?? '')} 详情失败`, error);
                    return null;
                }
            };

            const [activeResults, stoppedResults] = await Promise.all([
                Promise.all(activeItems.map((item: any) => loadSafely(item, '进行中'))),
                mapWithConcurrency(stoppedItems, DETAIL_CONCURRENCY, (item: any) =>
                    loadSafely(item, '已停编'),
                ),
            ]);

            if (controller.signal.aborted || requestId !== requestSequence) {
                return;
            }

            const loadedActive = activeResults.filter(
                (item): item is LoadedTyphoon => item !== null,
            );
            const loadedStopped = stoppedResults.filter(
                (item): item is LoadedTyphoon => item !== null,
            );
            const recentStopped = selectRecentStopped(loadedStopped, recentStoppedLimit);
            const targetData = [...loadedActive, ...recentStopped];

            if (targetData.length === 0) {
                statusText = hadPreviousDisplay
                    ? '❌ 台风列表已返回，但未能加载任何详情数据；已保留上次成功显示。'
                    : '❌ 台风列表已返回，但未能加载任何详情数据。';
                return;
            }

            pendingLayerGroup = window.L.layerGroup();
            const nextTyphoonListInfo: any[] = [];

            for (const item of targetData) {
                const stormLayerGroup = window.L.layerGroup();
                try {
                    const rendered = renderTyphoonData(
                        stormLayerGroup,
                        item.id,
                        item.no,
                        item.nameCn,
                        item.nameEn,
                        item.rawData,
                        item.status,
                    );
                    if (rendered) {
                        stormLayerGroup.addTo(pendingLayerGroup);
                        nextTyphoonListInfo.push(rendered);
                    } else {
                        stormLayerGroup.clearLayers();
                        failedCount += 1;
                    }
                } catch (error) {
                    stormLayerGroup.clearLayers();
                    failedCount += 1;
                    console.warn(`绘制台风 ${item.no} 失败`, error);
                }
            }

            if (nextTyphoonListInfo.length === 0) {
                pendingLayerGroup.clearLayers();
                pendingLayerGroup = null;
                statusText = hadPreviousDisplay
                    ? '❌ 台风详情中没有有效的可绘制实况点；已保留上次成功显示。'
                    : '❌ 台风详情中没有有效的可绘制实况点。';
                return;
            }

            const previousLayerGroup = layerGroup;
            pendingLayerGroup.addTo(map);
            try {
                if (previousLayerGroup) {
                    (map as any).removeLayer(previousLayerGroup);
                }
            } catch (error) {
                (map as any).removeLayer(pendingLayerGroup);
                pendingLayerGroup.clearLayers();
                pendingLayerGroup = null;
                throw error;
            }

            previousLayerGroup?.clearLayers();
            layerGroup = pendingLayerGroup;
            pendingLayerGroup = null;
            typhoonListInfo = nextTyphoonListInfo;
            restoreSelectionAfterRefresh(previousExpandedId, hadPreviousDisplay);

            const renderedActiveCount = typhoonListInfo.filter(
                item => item.status === '进行中',
            ).length;
            const renderedStoppedCount = typhoonListInfo.filter(
                item => item.status === '已停编',
            ).length;
            const failureSuffix =
                failedCount > 0 ? `；${failedCount} 个详情未能加载` : '';
            const listFailureSuffix =
                failedYears.length > 0
                    ? `；${failedYears.join('、')} 年列表暂未加载成功`
                    : '';
            const ignoredStatusSuffix =
                ignoredStatusCount > 0 ? `；忽略 ${ignoredStatusCount} 条未知状态记录` : '';
            const refreshSuffix = `；最后刷新（北京时间）${formatBeijingRefreshTime(new Date())}`;

            if (renderedActiveCount > 0) {
                const stoppedSuffix =
                    renderedStoppedCount > 0
                        ? `，并保留最近 ${renderedStoppedCount} 个停编台风的历史实况`
                        : '';
                statusText = `✅ 已绘制 ${renderedActiveCount} 个活跃台风的实况轨迹与可用预报${stoppedSuffix}${failureSuffix}${listFailureSuffix}${ignoredStatusSuffix}${refreshSuffix}。`;
            } else if (renderedStoppedCount > 0) {
                const activeFailurePrefix =
                    activeItems.length > 0 ? '活跃台风详情暂未加载成功；' : '当前无活跃台风；';
                statusText = `⚠️ ${activeFailurePrefix}已显示最近 ${renderedStoppedCount} 个停编台风的历史实况（不显示预报）${failureSuffix}${listFailureSuffix}${ignoredStatusSuffix}${refreshSuffix}。`;
            } else {
                statusText = hadPreviousDisplay
                    ? '❌ 台风详情不包含可绘制的实况点；已保留上次成功显示。'
                    : '❌ 台风详情不包含可绘制的实况点。';
            }
        } catch (error: unknown) {
            if (pendingLayerGroup) {
                if ((map as any).hasLayer(pendingLayerGroup)) {
                    (map as any).removeLayer(pendingLayerGroup);
                }
                pendingLayerGroup.clearLayers();
            }
            if (isAbortError(error) && !refreshTimedOut) {
                return;
            }

            console.error('中央气象台实时数据请求失败', error);
            const message = refreshTimedOut
                ? `整体刷新超时（${REFRESH_TIMEOUT_MS / 1000} 秒）`
                : error instanceof Error
                  ? error.message
                  : String(error);
            const preserveSuffix = hadPreviousDisplay ? '；已保留上次成功显示' : '';
            if (/请求超时|刷新超时/.test(message)) {
                statusText = `❌ 中央气象台请求超时：${message}${preserveSuffix}。`;
            } else if (/返回格式|有效 JSON/.test(message)) {
                statusText = `❌ 数据解析失败：${message}${preserveSuffix}。`;
            } else if (/^HTTP /.test(message)) {
                statusText = `❌ 中央气象台服务器返回错误：${message}${preserveSuffix}。`;
            } else {
                statusText = `❌ 网络请求失败：${message || '请检查网络连接、浏览器策略或数据源状态'}${preserveSuffix}。`;
            }
        } finally {
            clearTimeout(refreshTimeoutId);
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

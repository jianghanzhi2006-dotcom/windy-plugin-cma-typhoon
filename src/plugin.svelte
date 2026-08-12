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
                扩展显示：风速 &gt; <span translate="no">61.2 m/s</span> 时标记为“18级（扩展）”<br />
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
                                            on:click={() => focusLivePoint(item, pt)}
                                            on:keydown={event =>
                                                handleActivationKeydown(event, () =>
                                                    focusLivePoint(item, pt),
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
                                                <span translate="no" style="white-space: nowrap;"
                                                    >hPa</span
                                                >
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
                                                    translate="no"
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

        <div class="history-query">
            <button
                type="button"
                class="history-query__toggle"
                on:click={() => void toggleHistoryPanel()}
                aria-expanded={historyPanelOpen}
            >
                <span>📚 近一年台风</span>
                <span class="history-query__toggle-meta">
                    <span
                        class:history-query__path-state--visible={visibleStoppedPathCount > 0}
                        class="history-query__path-state"
                        >历史 {visibleStoppedPathCount}/{MAX_HISTORICAL_PATHS}</span
                    >
                    <span class="history-query__chevron" aria-hidden="true"
                        >{historyPanelOpen ? '▼' : '▶'}</span
                    >
                </span>
            </button>

            {#if historyPanelOpen}
                <div class="history-query__body">
                    <p class="history-query__hint">
                        活跃台风可在此关闭或恢复路径且不占额度；最多同时显示 3 条停编历史路径，最多保留 6 条已选历史记录，超出时自动清理最早关闭的记录。
                    </p>

                    <div class="history-query__status-row">
                        <div class="history-query__status" aria-live="polite">
                            {historyStatusText}
                        </div>
                        {#if historyLoadFailed && !historyListLoading}
                            <button
                                type="button"
                                class="history-query__retry-action"
                                on:click={() => void loadRecentHistoricalTyphoons()}
                            >
                                重试
                            </button>
                        {/if}
                    </div>

                    {#each historicalPaths as selectedPath (selectedPath.item.id)}
                        <div class="history-query__selected-path">
                            <div class="history-query__selected">
                                <div class="history-query__selected-name">
                                    <span
                                        >{selectedPath.source === 'live'
                                            ? '当前活跃路径'
                                            : '已选停编路径'}</span
                                    >
                                    <strong
                                        >{selectedPath.item.no || selectedPath.item.id}
                                        {selectedPath.item.nameCn || selectedPath.item.nameEn}</strong
                                    >
                                </div>
                                <div class="history-query__selected-actions">
                                    <label class="history-query__switch">
                                        <input
                                            type="checkbox"
                                            role="switch"
                                            checked={selectedPath.visible}
                                            on:change={event =>
                                                handleHistoricalPathToggle(
                                                    selectedPath.item.id,
                                                    event,
                                                )}
                                        />
                                        <span>{selectedPath.visible ? '已显示' : '已关闭'}</span>
                                    </label>
                                    {#if selectedPath.source === 'history'}
                                        <button
                                            type="button"
                                            class="history-query__remove-action"
                                            on:click={() =>
                                                removeHistoricalPath(selectedPath.item.id)}
                                        >
                                            移除
                                        </button>
                                    {/if}
                                </div>
                            </div>

                            {#if selectedPath.source === 'history'}
                                <div class="history-wind-list">
                                    <button
                                        type="button"
                                        class="history-wind-list__toggle"
                                        on:click={() =>
                                            toggleHistoricalWindList(selectedPath.item.id)}
                                        aria-expanded={selectedPath.windListOpen}
                                    >
                                        <span>📜 风力演变</span>
                                        <span class="history-wind-list__toggle-meta">
                                            {selectedPath.rendered.historyPoints.length} 个实况点
                                            <span aria-hidden="true"
                                                >{selectedPath.windListOpen ? '▼' : '▶'}</span
                                            >
                                        </span>
                                    </button>

                                    {#if selectedPath.windListOpen}
                                        <div class="history-wind-list__hint">
                                            最新在顶部，点击任一记录只打开该点弹窗，不移动地图视野。
                                        </div>
                                        <div class="history-wind-list__points">
                                            {#each selectedPath.rendered.historyPoints as pt, idx}
                                                <button
                                                    type="button"
                                                    class:history-wind-list__point--latest={idx === 0}
                                                    class="history-wind-list__point"
                                                    on:click={() =>
                                                        focusHistoricalPoint(
                                                            selectedPath.item.id,
                                                            pt,
                                                        )}
                                                >
                                                    <span class="history-wind-list__time">
                                                        <span>{pt.displayDate}</span>
                                                        <span>{pt.displayTime}</span>
                                                    </span>
                                                    <span class="history-wind-list__pressure">
                                                        <span>{pt.pressure}</span>
                                                        <span translate="no">hPa</span>
                                                    </span>
                                                    <span
                                                        class="history-wind-list__level"
                                                        style="background: {pt.bft.color}; color: {pt.bft
                                                            .textColor}; text-shadow: {pt.bft
                                                            .textColor === '#ffffff'
                                                        ? '0 1px 2px rgba(0,0,0,0.8)'
                                                        : 'none'};"
                                                    >
                                                        <span>{pt.bft.text}</span>
                                                        <span
                                                            translate="no"
                                                            class="history-wind-list__speed"
                                                            >({pt.speedDisplay}){#if pt.bft.qualifier}<span
                                                                    class="history-wind-list__qualifier"
                                                                    >{pt.bft.qualifier}</span
                                                                >{/if}</span
                                                        >
                                                    </span>
                                                </button>
                                            {/each}
                                        </div>
                                    {/if}
                                </div>
                            {/if}
                        </div>
                    {/each}

                    {#if historyItems.length > 0}
                        <div class="history-query__result-meta">
                            已停编台风，按生成时间从新到旧，共 {historyItems.length} 个；当前显示
                            {visibleStoppedPathCount}/{MAX_HISTORICAL_PATHS}
                        </div>

                        <div class="history-query__results">
                            {#each historyItems as historyItem (historyItem.id)}
                                <button
                                    type="button"
                                    class:history-query__result--selected={isHistoricalPathSelected(
                                        historyItem.id,
                                    )}
                                    class="history-query__result"
                                    on:click={() => void showHistoricalTyphoon(historyItem)}
                                    disabled={historyListLoading ||
                                        historyDetailLoadingId !== null ||
                                        !canShowHistoricalPath(historyItem.id)}
                                >
                                    <span class="history-query__result-name">
                                        <strong
                                            >{historyItem.no || historyItem.id}
                                            {historyItem.nameCn || '未命名'}</strong
                                        >
                                        {#if historyItem.nameEn}
                                            <span>{historyItem.nameEn}</span>
                                        {/if}
                                    </span>
                                    <span class="history-query__result-action">
                                        {getHistoricalResultAction(historyItem)}
                                    </span>
                                </button>
                            {/each}
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</section>

<script lang="ts">
    import bcast from '@windy/broadcast';
    import { map } from '@windy/map';
    import { onDestroy, onMount } from 'svelte';
    import config from './pluginConfig';
    import type { HistoricalTyphoonListItem } from './typhoonLogic';
    import {
        escapeHtml,
        formatBeijingRefreshTime,
        formatCleanTime,
        formatForecastTime,
        getBeaufort,
        getCmaListYears,
        getFirstObservationTime,
        getLatestObservationTime,
        isValidLatLng,
        normalizeHistoricalTyphoonList,
        parseJsonpPayload,
        selectDefaultTyphoon,
        selectTyphoonsGeneratedWithinOneYear,
        shouldRenderForecast,
        splitDisplayTime,
        toFiniteNumber,
        toNonNegativeNumber,
    } from './typhoonLogic';

    type TyphoonStatus = '进行中' | '已停编';
    type RefreshReason = 'open' | 'manual';
    type RenderMode = 'live' | 'history';

    type LoadedTyphoon = {
        id: string;
        no: string;
        nameCn: string;
        nameEn: string;
        rawData: any;
        status: TyphoonStatus;
        latestObservationTime: string;
        usingPreviousData?: boolean;
    };

    type RecentHistoricalTyphoon = HistoricalTyphoonListItem & {
        generationTime: string;
        rawData: any;
    };

    type HistoricalPathState = {
        item: HistoricalTyphoonListItem;
        layerGroup: any;
        rendered: any;
        source: 'live' | 'history';
        visible: boolean;
        windListOpen: boolean;
    };

    type HistoricalDetailCacheEntry = {
        generationTime: string;
        rawData: any;
        cachedAt: number;
    };

    const { title } = config;
    const REQUEST_TIMEOUT_MS = 20 * 1000;
    const REFRESH_TIMEOUT_MS = 30 * 1000;
    const HISTORY_DETAIL_TIMEOUT_MS = 60 * 1000;
    const HISTORY_DETAIL_CACHE_TTL_MS = 30 * 60 * 1000;
    const DETAIL_CONCURRENCY = 6;
    const MAX_HISTORICAL_PATHS = 3;
    const MAX_RETAINED_HISTORICAL_PATHS = 6;

    let statusText = '点击上方按钮发起中央气象台实时联网请求...';
    let typhoonListInfo: any[] = [];
    let layerGroup: any = null;
    let activeRequest: AbortController | null = null;
    let requestSequence = 0;
    let isLoading = false;
    let expandedTyphoonId: string | number | null = null;
    let historyPanelOpen = false;
    let historyItems: RecentHistoricalTyphoon[] = [];
    let historyStatusText = '首次展开后将自动加载近一年台风。';
    let historyListLoading = false;
    let historyListLoaded = false;
    let historyLoadFailed = false;
    let historyDetailLoadingId: string | null = null;
    let historyRequest: AbortController | null = null;
    let historyRequestSequence = 0;
    let historicalPaths: HistoricalPathState[] = [];
    let visibleStoppedPathCount = 0;
    const historicalDetailCache = new Map<string, HistoricalDetailCacheEntry>();

    // Keep the quota label reactive; function calls in the outer markup are not
    // invalidated reliably when a selected path is added or removed.
    $: visibleStoppedPathCount = historicalPaths.filter(
        path => path.source === 'history' && path.visible,
    ).length;

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

    function releaseHistoricalPathLayer(historicalPath: HistoricalPathState) {
        if ((map as any).hasLayer(historicalPath.layerGroup)) {
            (map as any).removeLayer(historicalPath.layerGroup);
        }
        historicalPath.layerGroup.clearLayers();
    }

    function releaseHistoricalPathResources() {
        for (const historicalPath of historicalPaths) {
            releaseHistoricalPathLayer(historicalPath);
        }
        historicalPaths = [];
    }

    function pruneRetainedHistoricalPaths(additionalCount = 0): number {
        const stoppedPaths = historicalPaths.filter(path => path.source === 'history');
        const overflow =
            stoppedPaths.length + additionalCount - MAX_RETAINED_HISTORICAL_PATHS;
        if (overflow <= 0) {
            return 0;
        }

        const hiddenPaths = stoppedPaths.filter(path => !path.visible);
        const preferred = hiddenPaths.filter(path => !path.windListOpen);
        const fallback = hiddenPaths.filter(path => path.windListOpen);
        const pathsToRemove = [...preferred, ...fallback].slice(0, overflow);
        const removedPaths = new Set(pathsToRemove);
        for (const historicalPath of pathsToRemove) {
            releaseHistoricalPathLayer(historicalPath);
        }
        historicalPaths = historicalPaths.filter(path => !removedPaths.has(path));
        return pathsToRemove.length;
    }

    function releaseMapResources() {
        map.off('click', handleMapClick);
        map.closePopup();

        if (layerGroup) {
            layerGroup.clearLayers();
            (map as any).removeLayer(layerGroup);
            layerGroup = null;
        }

        releaseHistoricalPathResources();
    }

    function cancelActiveRequest() {
        activeRequest?.abort();
        activeRequest = null;
        requestSequence += 1;
        isLoading = false;
    }

    function cancelHistoryRequest() {
        historyRequest?.abort();
        historyRequest = null;
        historyRequestSequence += 1;
        historyListLoading = false;
        historyDetailLoadingId = null;
    }

    function refreshHistoryAfterManualLiveUpdate(reason: RefreshReason) {
        if (reason !== 'manual') {
            return;
        }

        if (historyRequest || historyListLoading) {
            cancelHistoryRequest();
        }
        historyListLoaded = false;
        historyLoadFailed = false;

        if (historyPanelOpen) {
            void loadRecentHistoricalTyphoons();
        } else if (historyItems.length > 0) {
            historyStatusText = '实时数据已刷新；下次展开时将重新核对近一年停编台风。';
        }
    }

    async function fetchText(
        url: string,
        signal: AbortSignal,
        cache: RequestCache = 'default',
    ) {
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
            const response = await fetch(url, {
                signal: requestController.signal,
                cache,
            });
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
        cancelHistoryRequest();
        releaseMapResources();
        typhoonListInfo = [];
        expandedTyphoonId = null;
        historyPanelOpen = false;
        historyItems = [];
        historyListLoaded = false;
        historyLoadFailed = false;
        historicalDetailCache.clear();
        historyStatusText = '首次展开后将自动加载近一年台风。';
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

    function setLivePathVisibility(item: any, visible: boolean) {
        if (!layerGroup || !item.pathLayerGroup) {
            return;
        }

        if (visible) {
            if (!(layerGroup as any).hasLayer(item.pathLayerGroup)) {
                (layerGroup as any).addLayer(item.pathLayerGroup);
            }
        } else if ((layerGroup as any).hasLayer(item.pathLayerGroup)) {
            (layerGroup as any).removeLayer(item.pathLayerGroup);
            map.closePopup();
        }

        item.pathVisible = visible;
        typhoonListInfo = [...typhoonListInfo];
    }

    function syncActiveHistoricalPaths(liveItems: any[]) {
        const previousActiveById = new Map(
            historicalPaths
                .filter(path => path.source === 'live')
                .map(path => [path.item.id, path]),
        );
        const liveIds = new Set(liveItems.map(item => String(item.id)));

        for (const duplicatePath of historicalPaths.filter(
            path => path.source === 'history' && liveIds.has(path.item.id),
        )) {
            if ((map as any).hasLayer(duplicatePath.layerGroup)) {
                (map as any).removeLayer(duplicatePath.layerGroup);
            }
            duplicatePath.layerGroup.clearLayers();
        }

        const activePaths: HistoricalPathState[] = liveItems.map(item => {
            const id = String(item.id);
            const previousPath = previousActiveById.get(id);
            return {
                item: {
                    id,
                    no: String(item.no ?? ''),
                    nameEn: String(item.nameEn ?? ''),
                    nameCn: String(item.nameCn ?? ''),
                    sourceStatus: 'start',
                },
                layerGroup: item.pathLayerGroup,
                rendered: item,
                source: 'live',
                visible: item.pathVisible !== false,
                windListOpen: previousPath?.windListOpen ?? false,
            };
        });

        const stoppedPaths = historicalPaths.filter(
            path => path.source === 'history' && !liveIds.has(path.item.id),
        );

        historicalPaths = [...activePaths, ...stoppedPaths];
    }

    function clearTrackedLivePathLayers() {
        for (const historicalPath of historicalPaths) {
            if (historicalPath.source === 'live') {
                historicalPath.layerGroup.clearLayers();
            }
        }
    }

    function focusLivePoint(item: any, pt: any) {
        if (item.pathVisible === false) {
            setHistoricalPathVisibility(String(item.id), true);
            if (item.pathVisible === false) {
                return;
            }
        }
        focusPoint(pt);
    }

    function focusHistoricalPoint(pathId: string, pt: any) {
        const historicalPath = historicalPaths.find(path => path.item.id === pathId);
        if (!historicalPath) {
            return;
        }

        if (!historicalPath.visible) {
            setHistoricalPathVisibility(pathId, true);
            if (!historicalPath.visible) {
                return;
            }
        }

        if (historicalPath.source === 'live') {
            focusPoint(pt);
            return;
        }

        map.closePopup();
        if (pt.markerInstance) {
            pt.markerInstance.openPopup();
        }
    }

    function beginHistoryRequest() {
        historyRequest?.abort();
        historyListLoading = false;
        historyDetailLoadingId = null;

        const controller = new AbortController();
        historyRequest = controller;
        const requestId = ++historyRequestSequence;
        return { controller, requestId };
    }

    async function toggleHistoryPanel() {
        historyPanelOpen = !historyPanelOpen;
        if (historyPanelOpen && !historyListLoaded && !historyListLoading) {
            await loadRecentHistoricalTyphoons();
        }
    }

    function getRecentHistoricalListYears(date: Date): number[] {
        const beijingDate = new Date(date.getTime() + 8 * 3600 * 1000);
        const currentYear = beijingDate.getUTCFullYear();
        return [currentYear, currentYear - 1];
    }

    async function loadRecentHistoricalTyphoons() {
        const now = new Date();
        const years = getRecentHistoricalListYears(now);
        const { controller, requestId } = beginHistoryRequest();
        historyListLoading = true;
        historyLoadFailed = false;
        historyStatusText = '正在获取近一年涉及的台风列表…';
        let detailTimedOut = false;
        let detailTimeoutId: ReturnType<typeof setTimeout> | null = null;

        try {
            const failedYears: number[] = [];
            let firstAnnualFailure: unknown = null;
            const annualLists = await Promise.all(
                years.map(async year => {
                    const listUrl = `https://typhoon.nmc.cn/weatherservice/typhoon/jsons/list_${year}?callback=cmaHistoryList`;
                    try {
                        const text = await fetchText(listUrl, controller.signal, 'no-store');
                        if (controller.signal.aborted || requestId !== historyRequestSequence) {
                            return [];
                        }

                        const data = parseJsonpPayload<any>(text, `${year} 年台风列表`);
                        return Array.isArray(data?.typhoonList) ? data.typhoonList : [];
                    } catch (error) {
                        if (isAbortError(error)) {
                            throw error;
                        }
                        firstAnnualFailure ??= error;
                        failedYears.push(year);
                        console.warn(`获取 ${year} 年历史台风列表失败`, error);
                        return [];
                    }
                }),
            );
            if (controller.signal.aborted || requestId !== historyRequestSequence) {
                return;
            }
            if (failedYears.length === years.length) {
                throw firstAnnualFailure instanceof Error
                    ? firstAnnualFailure
                    : new Error(`全部历史年度列表请求失败（${years.join('、')}）`);
            }

            const candidates = normalizeHistoricalTyphoonList(annualLists.flat()).filter(
                item => item.sourceStatus === 'stop',
            );
            if (candidates.length === 0) {
                historyItems = [];
                historyListLoaded = true;
                historyLoadFailed = failedYears.length > 0;
                historyStatusText = `⚠️ 已加载的年度列表没有可用停编记录${
                    failedYears.length > 0
                        ? `；${failedYears.join('、')} 年列表暂未加载成功，可重试`
                        : ''
                }。`;
                return;
            }

            let processedCount = 0;
            let failedCount = 0;
            let cacheHitCount = 0;
            historyStatusText = `正在按生成时间核对 0/${candidates.length} 个台风…`;
            detailTimeoutId = setTimeout(() => {
                detailTimedOut = true;
                controller.abort();
            }, HISTORY_DETAIL_TIMEOUT_MS);

            const detailedItems = await mapWithConcurrency(
                candidates,
                DETAIL_CONCURRENCY,
                async (item): Promise<RecentHistoricalTyphoon | null> => {
                    const cached = historicalDetailCache.get(item.id);
                    if (
                        cached &&
                        now.getTime() - cached.cachedAt <= HISTORY_DETAIL_CACHE_TTL_MS
                    ) {
                        cacheHitCount += 1;
                        processedCount += 1;
                        if (!controller.signal.aborted && requestId === historyRequestSequence) {
                            historyStatusText = `正在按生成时间核对 ${processedCount}/${candidates.length} 个台风…`;
                        }
                        return {
                            ...item,
                            generationTime: cached.generationTime,
                            rawData: cached.rawData,
                        };
                    }
                    if (cached) {
                        historicalDetailCache.delete(item.id);
                    }

                    try {
                        const viewUrl = `https://typhoon.nmc.cn/weatherservice/typhoon/jsons/view_${encodeURIComponent(
                            item.id,
                        )}?callback=cmaHistoryView`;
                        const viewText = await fetchText(viewUrl, controller.signal);
                        if (controller.signal.aborted || requestId !== historyRequestSequence) {
                            return null;
                        }

                        const viewData = parseJsonpPayload<any>(
                            viewText,
                            `${item.no || item.id} 台风详情`,
                        );
                        const rawData = viewData?.typhoon;
                        const generationTime = getFirstObservationTime(rawData);
                        if (!rawData || !generationTime) {
                            failedCount += 1;
                            return null;
                        }

                        historicalDetailCache.set(item.id, {
                            generationTime,
                            rawData,
                            cachedAt: now.getTime(),
                        });
                        return { ...item, generationTime, rawData };
                    } catch (error) {
                        if (isAbortError(error)) {
                            if (detailTimedOut) {
                                return null;
                            }
                            throw error;
                        }
                        failedCount += 1;
                        console.warn(`核对台风 ${item.no || item.id} 的生成时间失败`, error);
                        return null;
                    } finally {
                        processedCount += 1;
                        if (!controller.signal.aborted && requestId === historyRequestSequence) {
                            historyStatusText = `正在按生成时间核对 ${processedCount}/${candidates.length} 个台风…`;
                        }
                    }
                },
            );
            if (detailTimeoutId !== null) {
                clearTimeout(detailTimeoutId);
                detailTimeoutId = null;
            }
            if (
                requestId !== historyRequestSequence ||
                (controller.signal.aborted && !detailTimedOut)
            ) {
                return;
            }

            const completedItems = detailedItems.filter(
                (item): item is RecentHistoricalTyphoon => item !== null,
            );
            const recentItems = selectTyphoonsGeneratedWithinOneYear(completedItems, now);
            const unresolvedCount = candidates.length - completedItems.length;
            const warnings: string[] = [];
            if (failedYears.length > 0) {
                warnings.push(`${failedYears.join('、')} 年列表暂未加载成功`);
            }
            if (detailTimedOut) {
                warnings.push(
                    `详情核对达到 ${HISTORY_DETAIL_TIMEOUT_MS / 1000} 秒上限，${unresolvedCount} 个尚未完成`,
                );
            } else if (failedCount > 0) {
                warnings.push(`${failedCount} 个详情未能核对`);
            }
            if (cacheHitCount > 0) {
                warnings.push(`复用 ${cacheHitCount} 个会话缓存详情`);
            }

            historyItems = recentItems;
            historyListLoaded = true;
            historyLoadFailed =
                failedYears.length > 0 || detailTimedOut || failedCount > 0;
            const warningSuffix = warnings.length > 0 ? `；${warnings.join('；')}` : '';
            historyStatusText =
                recentItems.length > 0
                    ? `✅ 已找到按生成时间计算的近一年停编台风 ${recentItems.length} 个${warningSuffix}；可勾选显示路径。`
                    : `⚠️ 没有找到生成于近一年的可用停编台风记录${warningSuffix}。`;
        } catch (error) {
            if (isAbortError(error)) {
                return;
            }

            console.warn('加载近一年台风失败', error);
            const message = error instanceof Error ? error.message : String(error);
            historyLoadFailed = true;
            historyStatusText = `❌ 近一年台风加载失败：${message}。`;
        } finally {
            if (detailTimeoutId !== null) {
                clearTimeout(detailTimeoutId);
            }
            if (historyRequest === controller) {
                historyRequest = null;
            }
            if (requestId === historyRequestSequence) {
                historyListLoading = false;
            }
        }
    }

    function isHistoricalPathSelected(pathId: string): boolean {
        return historicalPaths.some(path => path.item.id === pathId);
    }

    function getVisibleStoppedPathCount(): number {
        return historicalPaths.filter(
            path => path.source === 'history' && path.visible,
        ).length;
    }

    function canShowHistoricalPath(pathId: string): boolean {
        const historicalPath = historicalPaths.find(path => path.item.id === pathId);
        return (
            historicalPath?.visible === true ||
            getVisibleStoppedPathCount() < MAX_HISTORICAL_PATHS
        );
    }

    function setHistoricalPathVisibility(pathId: string, visible: boolean) {
        const historicalPath = historicalPaths.find(path => path.item.id === pathId);
        if (!historicalPath) {
            return;
        }

        if (
            visible &&
            !historicalPath.visible &&
            historicalPath.source === 'history' &&
            getVisibleStoppedPathCount() >= MAX_HISTORICAL_PATHS
        ) {
            historyStatusText = `最多同时显示 ${MAX_HISTORICAL_PATHS} 条停编历史路径；请先取消一条历史路径的对勾。`;
            historicalPaths = [...historicalPaths];
            return;
        }

        if (historicalPath.source === 'live') {
            const liveItem = typhoonListInfo.find(
                item => String(item.id) === String(historicalPath.item.id),
            );
            if (!liveItem) {
                return;
            }
            setLivePathVisibility(liveItem, visible);
        } else {
            if (visible) {
                if (!(map as any).hasLayer(historicalPath.layerGroup)) {
                    historicalPath.layerGroup.addTo(map);
                }
            } else if ((map as any).hasLayer(historicalPath.layerGroup)) {
                (map as any).removeLayer(historicalPath.layerGroup);
                map.closePopup();
            }
        }

        historicalPath.visible = visible;
        historicalPaths = [...historicalPaths];
        const pathKind = historicalPath.source === 'live' ? '活跃路径' : '历史路径';
        historyStatusText = visible
            ? `✅ 已在地图显示 ${historicalPath.item.no || historicalPath.item.id} ${
                  historicalPath.item.nameCn || historicalPath.item.nameEn
              } 的${pathKind}。`
            : `已关闭 ${historicalPath.item.no || historicalPath.item.id} ${
                  historicalPath.item.nameCn || historicalPath.item.nameEn
              } 的${pathKind}；路径仍保留在显示列表中。`;
    }

    function handleHistoricalPathToggle(pathId: string, event: Event) {
        setHistoricalPathVisibility(
            pathId,
            (event.currentTarget as HTMLInputElement).checked,
        );
    }

    function removeHistoricalPath(pathId: string) {
        const historicalPath = historicalPaths.find(
            path => path.item.id === pathId && path.source === 'history',
        );
        if (!historicalPath) {
            return;
        }

        if ((map as any).hasLayer(historicalPath.layerGroup)) {
            map.closePopup();
        }
        releaseHistoricalPathLayer(historicalPath);
        historicalPaths = historicalPaths.filter(path => path !== historicalPath);
        historyStatusText = `已移除 ${historicalPath.item.no || historicalPath.item.id} ${
            historicalPath.item.nameCn || historicalPath.item.nameEn
        } 的历史路径；当前历史显示 ${getVisibleStoppedPathCount()}/${MAX_HISTORICAL_PATHS}。`;
    }

    function toggleHistoricalWindList(pathId: string) {
        const historicalPath = historicalPaths.find(path => path.item.id === pathId);
        if (!historicalPath) {
            return;
        }

        historicalPath.windListOpen = !historicalPath.windListOpen;
        historicalPaths = [...historicalPaths];
    }

    function getHistoricalResultAction(item: RecentHistoricalTyphoon) {
        if (historyDetailLoadingId === item.id) {
            return '加载中…';
        }

        const selectedPath = historicalPaths.find(path => path.item.id === item.id);
        if (selectedPath) {
            if (selectedPath.visible) {
                return '查看列表';
            }
            return canShowHistoricalPath(item.id) ? '重新显示' : '已达上限';
        }
        return canShowHistoricalPath(item.id) ? '显示路径' : '已达上限';
    }

    function showHistoricalTyphoon(item: RecentHistoricalTyphoon) {
        const selectedPath = historicalPaths.find(path => path.item.id === item.id);
        if (selectedPath) {
            historicalPaths = historicalPaths.map(path => ({
                ...path,
                windListOpen: path.item.id === item.id,
            }));
            setHistoricalPathVisibility(item.id, true);
            return;
        }

        if (getVisibleStoppedPathCount() >= MAX_HISTORICAL_PATHS) {
            historyStatusText = `最多同时显示 ${MAX_HISTORICAL_PATHS} 条停编历史路径；请先取消一条历史路径的对勾。`;
            return;
        }

        if (!ensureLayerGroup()) {
            historyStatusText = '❌ 地图运行环境尚未就绪。';
            return;
        }

        historyDetailLoadingId = item.id;
        historyStatusText = `正在绘制 ${item.no || item.id} ${item.nameCn || item.nameEn} 的历史路径…`;
        let candidateLayerGroup: any = null;

        try {
            candidateLayerGroup = window.L.layerGroup();
            const rendered = renderTyphoonData(
                candidateLayerGroup,
                item.id,
                item.no,
                item.nameCn,
                item.nameEn,
                item.rawData,
                '已停编',
                'history',
            );
            if (!rendered) {
                throw new Error('详情中没有有效的可绘制实况点');
            }

            candidateLayerGroup.addTo(map);
            const prunedCount = pruneRetainedHistoricalPaths(1);
            historicalPaths = [
                ...historicalPaths.map(path => ({ ...path, windListOpen: false })),
                {
                    item,
                    layerGroup: candidateLayerGroup,
                    rendered,
                    source: 'history',
                    visible: true,
                    windListOpen: true,
                },
            ];
            candidateLayerGroup = null;
            historyStatusText = `✅ 已添加 ${item.no || item.id} ${
                item.nameCn || item.nameEn
            } 的历史实况路径；当前历史显示 ${getVisibleStoppedPathCount()}/${MAX_HISTORICAL_PATHS}${
                prunedCount > 0
                    ? `；为控制性能已自动清理 ${prunedCount} 条最早关闭的历史记录`
                    : ''
            }。`;
        } catch (error) {
            if (candidateLayerGroup) {
                if ((map as any).hasLayer(candidateLayerGroup)) {
                    (map as any).removeLayer(candidateLayerGroup);
                }
                candidateLayerGroup.clearLayers();
            }
            console.warn(`加载历史台风 ${item.no || item.id} 失败`, error);
            const message = error instanceof Error ? error.message : String(error);
            historyStatusText = `❌ ${item.no || item.id} 历史路径加载失败：${message}；当前地图路径未改变。`;
        } finally {
            historyDetailLoadingId = null;
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
        renderMode: RenderMode = 'live',
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
        const pointKind = renderMode === 'history' ? '历史实况点' : '实况点';

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
            const safeSpeedDisplay = escapeHtml(speedMs === null ? '—' : `${speedMs}m/s`);
            const safeLat = escapeHtml(lat);
            const safeLng = escapeHtml(lng);

            realSegments.push({ latlng: [lat, lng], color: bft.color });

            const popupHtml = `
                <div style="font-size:13px; line-height:1.6; color:#000; font-family:sans-serif; padding:2px;">
                    <strong style="font-size:15px; color:#1890ff;">🌀 ${safeNo} ${safeNameCn} (${safeNameEn}) [${pointKind}]</strong><br/>
                    <b>📍 时间</b>：${safeFormattedTime}<br/>
                    <b>🌬️ 风力等级</b>：<span style="background:${bft.color}; color:${bft.textColor}; padding:2px 6px; border-radius:3px; font-weight:bold;">${escapeHtml(bft.text)} <span translate="no">(${safeSpeedDisplay})</span></span><br/>
                    <b>📉 中心气压</b>：<span translate="no">${safePressure} hPa</span><br/>
                    <b>🧭 坐标</b>：${safeLat}°N, ${safeLng}°E
                </div>
            `;

            const popupOptions = {
                closeOnClick: true,
                autoClose: true,
                autoPan: renderMode !== 'history',
            };

            const hitArea =
                renderMode === 'live'
                    ? window.L.circleMarker([lat, lng], {
                          radius: 18,
                          stroke: false,
                          fill: true,
                          fillColor: '#ffffff',
                          fillOpacity: 0.001,
                          interactive: true,
                      }).addTo(targetLayerGroup)
                    : null;

            const marker = window.L.circleMarker([lat, lng], {
                radius: 4,
                stroke: false,
                fill: true,
                fillColor: bft.color,
                fillOpacity: 1,
                interactive: true,
            }).addTo(targetLayerGroup);

            hitArea?.bindPopup(popupHtml, popupOptions);
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
                markerInstance: hitArea ?? marker,
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
                        speedMs === null ? '—' : `${speedMs}m/s`,
                    );

                    forecastLatlngs.push([lat, lng]);

                    const fcPopupHtml = `
                        <div style="font-size:13px; line-height:1.6; color:#000; font-family:sans-serif; padding:2px;">
                            <strong style="font-size:15px; color:#faad14;">🔮 ${safeNo} ${safeNameCn} [中央气象台 +${fcHours}h 未来预测]</strong><br/>
                            <b>📍 预测目标时间</b>：${safeForecastTime}<br/>
                            <b>🌬️ 预测风力</b>：<span style="background:${bft.color}; color:${bft.textColor}; padding:2px 6px; border-radius:3px; font-weight:bold;">${escapeHtml(bft.text)} <span translate="no">(${safeSpeedDisplay})</span></span><br/>
                            <b>📉 预测中心气压</b>：<span translate="no">${safePressure} hPa</span><br/>
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
                    const text = await fetchText(listUrl, controller.signal, 'no-store');
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

        const viewUrl = `https://typhoon.nmc.cn/weatherservice/typhoon/jsons/view_${encodeURIComponent(id)}?callback=cmaLiveView`;
        const viewText = await fetchText(viewUrl, controller.signal, 'no-store');
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

        return value;
    }

    async function fetchCMATyphoonLive(reason: RefreshReason = 'manual') {
        if (!ensureLayerGroup()) {
            statusText = '❌ 地图运行环境尚未就绪。';
            return;
        }

        const previousExpandedId = expandedTyphoonId;
        const hadPreviousDisplay = typhoonListInfo.length > 0;
        const previousTyphoonById = new Map<string, any>(
            typhoonListInfo.map(item => [String(item.id), item]),
        );
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
        let detailFailureCount = 0;
        let renderFailureCount = 0;
        let staleFallbackCount = 0;
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

            if (activeItems.length === 0) {
                if (failedYears.length > 0 && hadPreviousDisplay) {
                    statusText = `⚠️ 已加载的年度列表暂未发现活跃台风，但 ${failedYears.join(
                        '、',
                    )} 年列表请求失败；为避免误删，已保留上次成功显示。`;
                    return;
                }

                pendingLayerGroup = window.L.layerGroup();
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

                clearTrackedLivePathLayers();
                previousLayerGroup?.clearLayers();
                layerGroup = pendingLayerGroup;
                pendingLayerGroup = null;
                typhoonListInfo = [];
                expandedTyphoonId = null;
                syncActiveHistoricalPaths([]);
                const listFailureSuffix =
                    failedYears.length > 0
                        ? `；${failedYears.join('、')} 年列表暂未加载成功`
                        : '';
                const ignoredStatusSuffix =
                    ignoredStatusCount > 0 ? `；忽略 ${ignoredStatusCount} 条未知状态记录` : '';
                statusText = `⚠️ 当前无活跃台风；已停编台风可在下方“近一年台风”中查看${listFailureSuffix}${ignoredStatusSuffix}；最后刷新（北京时间）${formatBeijingRefreshTime(new Date())}。`;
                refreshHistoryAfterManualLiveUpdate(reason);
                return;
            }

            statusText = `✅ 台风列表获取成功，正在加载 ${activeItems.length} 个活跃台风；${stoppedItems.length} 个停编记录请在下方“近一年台风”中查看...`;

            const loadSafely = async (item: any, itemStatus: TyphoonStatus) => {
                try {
                    const loaded = await loadTyphoonDetail(
                        item,
                        itemStatus,
                        controller,
                        requestId,
                    );
                    if (!loaded) {
                        detailFailureCount += 1;
                    }
                    return loaded;
                } catch (error) {
                    if (isAbortError(error)) {
                        throw error;
                    }
                    detailFailureCount += 1;
                    console.warn(`获取台风 ${String(item[4] ?? '')} 详情失败`, error);
                    return null;
                }
            };

            const activeResults = await Promise.all(
                activeItems.map((item: any) => loadSafely(item, '进行中')),
            );

            if (controller.signal.aborted || requestId !== requestSequence) {
                return;
            }

            const targetData: LoadedTyphoon[] = [];
            for (let index = 0; index < activeItems.length; index += 1) {
                const loaded = activeResults[index];
                if (loaded) {
                    targetData.push(loaded);
                    continue;
                }

                const listItem = activeItems[index];
                const id = String(listItem[0]);
                const previous = previousTyphoonById.get(id);
                if (!previous?.rawData) {
                    continue;
                }

                staleFallbackCount += 1;
                targetData.push({
                    id,
                    no: String(listItem[4] ?? previous.no ?? ''),
                    nameEn: String(listItem[1] ?? previous.nameEn ?? ''),
                    nameCn: String(listItem[2] ?? previous.nameCn ?? ''),
                    rawData: previous.rawData,
                    status: '进行中',
                    latestObservationTime: String(previous.latestObservationTime ?? ''),
                    usingPreviousData: true,
                });
            }

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
                        const previous = previousTyphoonById.get(String(item.id));
                        const pathVisible = previous ? previous.pathVisible !== false : true;
                        if (pathVisible) {
                            stormLayerGroup.addTo(pendingLayerGroup);
                        }
                        nextTyphoonListInfo.push({
                            ...rendered,
                            rawData: item.rawData,
                            usingPreviousData: item.usingPreviousData === true,
                            pathLayerGroup: stormLayerGroup,
                            pathVisible,
                        });
                    } else {
                        stormLayerGroup.clearLayers();
                        renderFailureCount += 1;
                    }
                } catch (error) {
                    stormLayerGroup.clearLayers();
                    renderFailureCount += 1;
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

            clearTrackedLivePathLayers();
            previousLayerGroup?.clearLayers();
            layerGroup = pendingLayerGroup;
            pendingLayerGroup = null;
            typhoonListInfo = nextTyphoonListInfo;
            syncActiveHistoricalPaths(typhoonListInfo);
            restoreSelectionAfterRefresh(previousExpandedId, hadPreviousDisplay);
            refreshHistoryAfterManualLiveUpdate(reason);

            const renderedActiveCount = typhoonListInfo.filter(
                item => item.status === '进行中',
            ).length;
            const unavailableDetailCount = Math.max(
                0,
                detailFailureCount - staleFallbackCount,
            );
            const staleFallbackSuffix =
                staleFallbackCount > 0
                    ? `；${staleFallbackCount} 个活跃台风暂用上次成功数据`
                    : '';
            const failureParts: string[] = [];
            if (unavailableDetailCount > 0) {
                failureParts.push(`${unavailableDetailCount} 个详情未能加载且没有旧数据`);
            }
            if (renderFailureCount > 0) {
                failureParts.push(`${renderFailureCount} 个台风未能绘制`);
            }
            const failureSuffix =
                failureParts.length > 0 ? `；${failureParts.join('；')}` : '';
            const listFailureSuffix =
                failedYears.length > 0
                    ? `；${failedYears.join('、')} 年列表暂未加载成功`
                    : '';
            const ignoredStatusSuffix =
                ignoredStatusCount > 0 ? `；忽略 ${ignoredStatusCount} 条未知状态记录` : '';
            const refreshSuffix = `；最后刷新（北京时间）${formatBeijingRefreshTime(new Date())}`;
            const stoppedSuffix =
                stoppedItems.length > 0
                    ? `；${stoppedItems.length} 个停编台风可在下方“近一年台风”中查看`
                    : '';
            statusText = `✅ 已绘制 ${renderedActiveCount} 个活跃台风的实况轨迹与可用预报${stoppedSuffix}${staleFallbackSuffix}${failureSuffix}${listFailureSuffix}${ignoredStatusSuffix}${refreshSuffix}。`;
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

    .history-query {
        margin-top: 14px;
        padding-top: 12px;
        border-top: 1px solid #333;
    }

    .history-query__toggle {
        width: 100%;
        min-height: 42px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 8px 2px;
        border: 0;
        background: transparent;
        color: #d9d9d9;
        font: inherit;
        font-size: 14px;
        font-weight: 700;
        text-align: left;
        cursor: pointer;
    }

    .history-query__chevron {
        width: 14px;
        flex: 0 0 auto;
        color: #8c8c8c;
        font-size: 11px;
        text-align: center;
    }

    .history-query__toggle-meta {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }

    .history-query__path-state {
        color: #8c8c8c;
        font-size: 11px;
        font-weight: 500;
    }

    .history-query__path-state--visible {
        color: #69c0ff;
    }

    .history-query__body {
        padding: 10px 0 2px;
        border-top: 1px solid #2d2d2d;
    }

    .history-query__hint {
        margin: 0 0 10px;
        color: #a6a6a6;
        font-size: 12px;
        line-height: 1.5;
    }

    .history-query__status-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
    }

    .history-query__status {
        min-width: 0;
        color: #bfbfbf;
        font-size: 12px;
        line-height: 1.5;
    }

    .history-query__retry-action {
        flex: 0 0 auto;
        min-height: 28px;
        padding: 0 8px;
        border: 1px solid #1890ff;
        border-radius: 4px;
        background: transparent;
        color: #69c0ff;
        font: inherit;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
    }

    .history-query__retry-action:hover {
        background: rgba(24, 144, 255, 0.1);
    }

    .history-query__selected-path {
        margin-top: 10px;
    }

    .history-query__selected {
        padding: 9px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        border-top: 1px solid #333;
        border-bottom: 1px solid #333;
    }

    .history-query__selected-name {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
        color: #8c8c8c;
        font-size: 11px;
    }

    .history-query__selected-name strong {
        overflow: hidden;
        color: #69c0ff;
        font-size: 13px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .history-query__selected-actions {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        gap: 9px;
    }

    .history-query__switch {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: #d9d9d9;
        font-size: 12px;
        cursor: pointer;
    }

    .history-query__switch input {
        width: 17px;
        height: 17px;
        margin: 0;
        accent-color: #1890ff;
        cursor: pointer;
    }

    .history-query__remove-action {
        min-height: 28px;
        padding: 0 8px;
        border: 1px solid #595959;
        border-radius: 4px;
        background: transparent;
        color: #bfbfbf;
        font: inherit;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: border-color 0.16s ease, color 0.16s ease, background 0.16s ease;
    }

    .history-query__remove-action:hover {
        border-color: #ff7875;
        background: rgba(255, 77, 79, 0.08);
        color: #ff7875;
    }

    .history-wind-list {
        margin-top: 8px;
        padding-bottom: 10px;
        border-bottom: 1px solid #333;
    }

    .history-wind-list__toggle {
        box-sizing: border-box;
        width: 100%;
        min-height: 38px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 6px 2px;
        border: 0;
        background: transparent;
        color: #d9d9d9;
        font: inherit;
        font-size: 12px;
        font-weight: 700;
        text-align: left;
        cursor: pointer;
    }

    .history-wind-list__toggle-meta {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        color: #8c8c8c;
        font-size: 11px;
        font-weight: 500;
    }

    .history-wind-list__hint {
        margin: 0 2px 7px;
        color: #8c8c8c;
        font-size: 11px;
        line-height: 1.45;
    }

    .history-wind-list__points {
        max-height: 520px;
        overflow-y: auto;
        padding-right: 4px;
    }

    .history-wind-list__point {
        box-sizing: border-box;
        width: 100%;
        min-height: 58px;
        display: grid;
        grid-template-columns: 64px 48px minmax(108px, 126px);
        align-items: center;
        justify-content: space-between;
        column-gap: 8px;
        margin-bottom: 6px;
        padding: 8px 12px;
        border: 1px solid #383838;
        border-radius: 6px;
        background: #262626;
        color: #fff;
        font: inherit;
        font-size: 13px;
        text-align: left;
        cursor: pointer;
        transition: background 0.16s ease, border-color 0.16s ease;
    }

    .history-wind-list__point:hover {
        background: #2d2d2d;
        border-color: #4a4a4a;
    }

    .history-wind-list__point--latest {
        border: 1.5px solid #1890ff;
        background: #132738;
        box-shadow: 0 0 8px rgba(24, 144, 255, 0.35);
    }

    .history-wind-list__time,
    .history-wind-list__pressure {
        min-width: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        line-height: 1.25;
        font-variant-numeric: tabular-nums;
    }

    .history-wind-list__time span,
    .history-wind-list__pressure span {
        white-space: nowrap;
    }

    .history-wind-list__point--latest .history-wind-list__time {
        color: #40a9ff;
        font-weight: 700;
    }

    .history-wind-list__pressure {
        color: #aaa;
        font-size: 12px;
    }

    .history-wind-list__level {
        box-sizing: border-box;
        width: 100%;
        min-width: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4px 6px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 700;
        line-height: 1.2;
        text-align: center;
    }

    .history-wind-list__level > span {
        white-space: nowrap;
    }

    .history-wind-list__speed {
        margin-top: 2px;
        font-size: 12px;
        opacity: 0.95;
    }

    .history-wind-list__qualifier {
        margin-left: 4px;
        padding: 0 3px;
        border: 1px solid currentColor;
        border-radius: 3px;
        font-size: 10px;
        opacity: 0.9;
    }

    .history-query__result-meta {
        margin: 7px 0 5px;
        color: #737373;
        font-size: 11px;
    }

    .history-query__results {
        max-height: 280px;
        overflow-y: auto;
        border-top: 1px solid #333;
    }

    .history-query__result {
        box-sizing: border-box;
        width: 100%;
        min-height: 48px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 8px 4px;
        border: 0;
        border-bottom: 1px solid #2d2d2d;
        background: transparent;
        color: #fff;
        font: inherit;
        text-align: left;
        cursor: pointer;
        transition: background 0.16s ease, opacity 0.16s ease;
    }

    .history-query__result:hover:not(:disabled),
    .history-query__result--selected {
        background: rgba(24, 144, 255, 0.1);
    }

    .history-query__result:disabled {
        cursor: not-allowed;
        opacity: 0.62;
    }

    .history-query__result-name {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .history-query__result-name strong,
    .history-query__result-name span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .history-query__result-name strong {
        color: #f0f0f0;
        font-size: 13px;
    }

    .history-query__result-name span {
        color: #8c8c8c;
        font-size: 11px;
    }

    .history-query__result-action {
        flex: 0 0 auto;
        color: #69c0ff;
        font-size: 12px;
        font-weight: 600;
    }

    .history-query__toggle:focus-visible,
    .history-query__retry-action:focus-visible,
    .history-query__remove-action:focus-visible,
    .history-query__result:focus-visible,
    .history-wind-list__toggle:focus-visible,
    .history-wind-list__point:focus-visible {
        outline: 2px solid #69c0ff;
        outline-offset: 2px;
    }

    @media (max-width: 390px) {
        .history-query__selected {
            align-items: flex-start;
            gap: 8px;
        }

        .history-query__selected-actions {
            gap: 7px;
        }

        .history-wind-list__point {
            grid-template-columns: 56px 44px minmax(0, 1fr);
            column-gap: 6px;
            padding: 8px;
        }
    }
</style>

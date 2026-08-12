Exit code: 0
Wall time: 0.2 seconds
Total output lines: 2288
Output:
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
                                                                    class="history-wind-list_…12716 tokens truncated…ayerGroup?.clearLayers();
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


export type BeaufortInfo = {
    text: string;
    color: string;
    textColor: string;
    qualifier?: string;
};

export type StrongestCandidatePoint = {
    speedMs?: unknown;
    pressure?: unknown;
};

export type StrongestCandidate = {
    historyPoints?: StrongestCandidatePoint[];
};

export type TyphoonDisplayCandidate = StrongestCandidate & {
    id?: unknown;
    status?: unknown;
    latestObservationTime?: unknown;
};

export type HistoricalTyphoonListItem = {
    id: string;
    no: string;
    nameEn: string;
    nameCn: string;
    sourceStatus: 'start' | 'stop' | 'unknown';
};

const UNKNOWN_WIND: BeaufortInfo = {
    text: '风速暂无数据',
    color: '#595959',
    textColor: '#FFFFFF',
};

export function parseJsonpPayload<T = unknown>(text: string, label: string): T {
    const start = text.indexOf('(');
    const end = text.lastIndexOf(')');
    if (start < 0 || end <= start + 1) {
        throw new Error(`${label}返回格式异常`);
    }

    try {
        return JSON.parse(text.slice(start + 1, end)) as T;
    } catch {
        throw new Error(`${label}返回内容不是有效 JSON`);
    }
}

export function toFiniteNumber(value: unknown): number | null {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null;
    }

    if (typeof value !== 'string' || value.trim() === '') {
        return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

export function toNonNegativeNumber(value: unknown): number | null {
    const parsed = toFiniteNumber(value);
    return parsed !== null && parsed >= 0 ? parsed : null;
}

export function isValidLatLng(latValue: unknown, lngValue: unknown): boolean {
    const lat = toFiniteNumber(latValue);
    const lng = toFiniteNumber(lngValue);
    return lat !== null && lng !== null && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

export function normalizeHistoricalTyphoonList(rawList: unknown): HistoricalTyphoonListItem[] {
    if (!Array.isArray(rawList)) {
        return [];
    }

    const byId = new Map<string, HistoricalTyphoonListItem>();

    for (const rawItem of rawList) {
        if (!Array.isArray(rawItem) || rawItem[0] === null || rawItem[0] === undefined) {
            continue;
        }

        const id = String(rawItem[0]).trim();
        if (!id) {
            continue;
        }

        const rawStatus = rawItem[7];
        const item: HistoricalTyphoonListItem = {
            id,
            no: String(rawItem[4] ?? '').trim(),
            nameEn: String(rawItem[1] ?? '').trim(),
            nameCn: String(rawItem[2] ?? '').trim(),
            sourceStatus:
                rawStatus === 'start' ? 'start' : rawStatus === 'stop' ? 'stop' : 'unknown',
        };

        const existing = byId.get(id);
        if (!existing || item.sourceStatus === 'start') {
            byId.set(id, item);
        }
    }

    return [...byId.values()].sort((left, right) => {
        const leftNo = Number(left.no);
        const rightNo = Number(right.no);
        if (Number.isFinite(leftNo) && Number.isFinite(rightNo) && leftNo !== rightNo) {
            return rightNo - leftNo;
        }

        return right.no.localeCompare(left.no, undefined, {
            numeric: true,
            sensitivity: 'base',
        });
    });
}

export function escapeHtml(value: unknown): string {
    return String(value ?? '').replace(/[&<>"']/g, character => {
        const entities: Record<string, string> = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
        };
        return entities[character];
    });
}

export function getBeaufort(rawSpeed: unknown): BeaufortInfo {
    const ms = toNonNegativeNumber(rawSpeed);
    if (ms === null) {
        return { ...UNKNOWN_WIND };
    }

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
        return { text: '6级热带低压', color: '#389E0D', textColor: '#FFFFFF' };
    }
    if (ms <= 17.1) {
        return { text: '7级热带低压', color: '#FADB14', textColor: '#000000' };
    }
    if (ms <= 20.7) {
        return { text: '8级热带风暴', color: '#FA8C16', textColor: '#FFFFFF' };
    }
    if (ms <= 24.4) {
        return { text: '9级热带风暴', color: '#ED571A', textColor: '#FFFFFF' };
    }
    if (ms <= 28.4) {
        return { text: '10级强热带风暴', color: '#CF1322', textColor: '#FFFFFF' };
    }
    if (ms <= 32.6) {
        return { text: '11级强热带风暴', color: '#A8071A', textColor: '#FFFFFF' };
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

    // GB/T 28591-2012 ends at Level 17 (>=56.1 m/s). This explicitly labelled
    // extension is a display convention for exceptionally high winds.
    return {
        text: '18级超强台风',
        qualifier: '扩展',
        color: '#120338',
        textColor: '#FFFFFF',
    };
}

function parseSourceTime(value: string): Date | null {
    if (!/^\d{12}(?:\d{2})?$/.test(value)) {
        return null;
    }

    const year = Number.parseInt(value.substring(0, 4), 10);
    const month = Number.parseInt(value.substring(4, 6), 10) - 1;
    const day = Number.parseInt(value.substring(6, 8), 10);
    const hour = Number.parseInt(value.substring(8, 10), 10);
    const minute = Number.parseInt(value.substring(10, 12), 10);
    const second = value.length === 14 ? Number.parseInt(value.substring(12, 14), 10) : 0;
    if (![year, month, day, hour, minute, second].every(Number.isFinite)) {
        return null;
    }

    const result = new Date(Date.UTC(year, month, day, hour, minute, second));
    if (
        result.getUTCFullYear() !== year ||
        result.getUTCMonth() !== month ||
        result.getUTCDate() !== day ||
        result.getUTCHours() !== hour ||
        result.getUTCMinutes() !== minute ||
        result.getUTCSeconds() !== second
    ) {
        return null;
    }

    return result;
}

function getBeijingOneYearCutoff(now: Date): Date | null {
    if (!Number.isFinite(now.getTime())) {
        return null;
    }

    const beijingNow = new Date(now.getTime() + 8 * 3600 * 1000);
    const targetYear = beijingNow.getUTCFullYear() - 1;
    const month = beijingNow.getUTCMonth();
    const maximumDay = new Date(Date.UTC(targetYear, month + 1, 0)).getUTCDate();
    const day = Math.min(beijingNow.getUTCDate(), maximumDay);
    const beijingCutoffAsUtc = Date.UTC(
        targetYear,
        month,
        day,
        beijingNow.getUTCHours(),
        beijingNow.getUTCMinutes(),
        0,
        0,
    );

    return new Date(beijingCutoffAsUtc - 8 * 3600 * 1000);
}

export function getFirstObservationTime(rawData: unknown): string {
    if (!Array.isArray(rawData)) {
        return '';
    }

    const points = rawData[8];
    if (!Array.isArray(points)) {
        return '';
    }

    let earliestValue = '';
    let earliestTime = Number.POSITIVE_INFINITY;
    for (const point of points) {
        if (!Array.isArray(point) || typeof point[1] !== 'string') {
            continue;
        }

        const parsed = parseSourceTime(point[1]);
        if (parsed && parsed.getTime() < earliestTime) {
            earliestValue = point[1];
            earliestTime = parsed.getTime();
        }
    }

    return earliestValue;
}

export function selectTyphoonsGeneratedWithinOneYear<
    T extends { generationTime: unknown },
>(items: T[], now: Date): T[] {
    const cutoff = getBeijingOneYearCutoff(now);
    if (!cutoff) {
        return [];
    }

    const nowTime = now.getTime();
    const cutoffTime = cutoff.getTime();
    return items
        .filter(item => {
            if (typeof item.generationTime !== 'string') {
                return false;
            }

            const generationTime = parseSourceTime(item.generationTime)?.getTime();
            return (
                generationTime !== undefined &&
                generationTime >= cutoffTime &&
                generationTime <= nowTime
            );
        })
        .sort((left, right) =>
            String(right.generationTime).localeCompare(String(left.generationTime)),
        );
}

function formatBeijingTime(date: Date): string {
    const beijingDate = new Date(date.getTime() + 8 * 3600 * 1000);
    const month = String(beijingDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(beijingDate.getUTCDate()).padStart(2, '0');
    const hour = String(beijingDate.getUTCHours()).padStart(2, '0');
    const minute = String(beijingDate.getUTCMinutes()).padStart(2, '0');
    return `${month}-${day} ${hour}:${minute}`;
}

export function formatCleanTime(value: string): string {
    const sourceDate = parseSourceTime(value);
    return sourceDate ? formatBeijingTime(sourceDate) : value;
}

export function formatForecastTime(baseValue: string, forecastHours: number): string {
    const sourceDate = parseSourceTime(baseValue);
    const safeForecastHours = toNonNegativeNumber(forecastHours);
    if (!sourceDate || safeForecastHours === null) {
        return baseValue;
    }

    return formatBeijingTime(new Date(sourceDate.getTime() + safeForecastHours * 3600 * 1000));
}

export function formatBeijingRefreshTime(date: Date): string {
    return formatBeijingTime(date);
}

export function getCmaListYears(date: Date): number[] {
    const beijingDate = new Date(date.getTime() + 8 * 3600 * 1000);
    const year = beijingDate.getUTCFullYear();
    return beijingDate.getUTCMonth() === 0 ? [year, year - 1] : [year];
}

export function splitDisplayTime(value: string): { date: string; time: string } {
    const [date = value, time = ''] = value.trim().split(/\s+/, 2);
    return { date, time };
}

export function getLatestObservationTime(rawData: unknown): string {
    if (!Array.isArray(rawData)) {
        return '';
    }

    const points = rawData[8];
    if (!Array.isArray(points) || points.length === 0) {
        return '';
    }

    for (let index = points.length - 1; index >= 0; index -= 1) {
        const point = points[index];
        if (
            Array.isArray(point) &&
            typeof point[1] === 'string' &&
            parseSourceTime(point[1]) &&
            isValidLatLng(point[5], point[4])
        ) {
            return point[1];
        }
    }

    return '';
}

export function selectRecentStopped<T extends TyphoonDisplayCandidate>(
    items: T[],
    limit: number,
): T[] {
    const safeLimit = Math.max(0, Math.floor(limit));

    return [...items]
        .sort((left, right) => {
            const timeCompare = String(right.latestObservationTime ?? '').localeCompare(
                String(left.latestObservationTime ?? ''),
            );
            if (timeCompare !== 0) {
                return timeCompare;
            }

            const leftId = Number(left.id);
            const rightId = Number(right.id);
            return Number.isFinite(leftId) && Number.isFinite(rightId) ? rightId - leftId : 0;
        })
        .slice(0, safeLimit);
}

export function selectDefaultTyphoon<T extends TyphoonDisplayCandidate>(items: T[]): T | null {
    const active = items.filter(item => item.status === '进行中');
    return active.length > 0
        ? findStrongestTyphoon(active)
        : (selectRecentStopped(items, 1)[0] ?? null);
}

export function shouldRenderForecast(status: unknown): boolean {
    return status === '进行中';
}

export function findStrongestTyphoon<T extends StrongestCandidate>(items: T[]): T | null {
    return items.reduce<T | null>((selected, item) => {
        const latest = item.historyPoints?.[0];
        if (!latest) {
            return selected;
        }
        if (!selected) {
            return item;
        }

        const selectedLatest = selected.historyPoints?.[0];
        if (!selectedLatest) {
            return item;
        }

        const windSpeed = toNonNegativeNumber(latest.speedMs);
        const selectedWindSpeed = toNonNegativeNumber(selectedLatest.speedMs);
        const hasWindSpeed = windSpeed !== null;
        const selectedHasWindSpeed = selectedWindSpeed !== null;

        if (hasWindSpeed !== selectedHasWindSpeed) {
            return hasWindSpeed ? item : selected;
        }
        if (windSpeed !== null && selectedWindSpeed !== null && windSpeed !== selectedWindSpeed) {
            return windSpeed > selectedWindSpeed ? item : selected;
        }

        const pressure = toNonNegativeNumber(latest.pressure);
        const selectedPressure = toNonNegativeNumber(selectedLatest.pressure);
        if (pressure !== null && (selectedPressure === null || pressure < selectedPressure)) {
            return item;
        }

        return selected;
    }, null);
}

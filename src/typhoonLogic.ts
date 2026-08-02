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

export function getBeaufort(ms: number): BeaufortInfo {
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

function parseSourceHour(value: string): Date | null {
    if (!value || value.length < 12) {
        return null;
    }

    const year = Number.parseInt(value.substring(0, 4), 10);
    const month = Number.parseInt(value.substring(4, 6), 10) - 1;
    const day = Number.parseInt(value.substring(6, 8), 10);
    const hour = Number.parseInt(value.substring(8, 10), 10);
    if (![year, month, day, hour].every(Number.isFinite)) {
        return null;
    }

    return new Date(Date.UTC(year, month, day, hour, 0, 0));
}

function formatBeijingHour(date: Date): string {
    const beijingDate = new Date(date.getTime() + 8 * 3600 * 1000);
    const month = String(beijingDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(beijingDate.getUTCDate()).padStart(2, '0');
    const hour = String(beijingDate.getUTCHours()).padStart(2, '0');
    return `${month}-${day} ${hour}:00`;
}

export function formatCleanTime(value: string): string {
    const sourceDate = parseSourceHour(value);
    return sourceDate ? formatBeijingHour(sourceDate) : value;
}

export function formatForecastTime(baseValue: string, forecastHours: number): string {
    const sourceDate = parseSourceHour(baseValue);
    if (!sourceDate) {
        return baseValue;
    }

    return formatBeijingHour(new Date(sourceDate.getTime() + forecastHours * 3600 * 1000));
}

export function splitDisplayTime(value: string): { date: string; time: string } {
    const [date = value, time = ''] = value.trim().split(/\s+/, 2);
    return { date, time };
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

        const windSpeed = Number(latest.speedMs);
        const selectedWindSpeed = Number(selectedLatest.speedMs);
        const hasWindSpeed = Number.isFinite(windSpeed);
        const selectedHasWindSpeed = Number.isFinite(selectedWindSpeed);

        if (hasWindSpeed !== selectedHasWindSpeed) {
            return hasWindSpeed ? item : selected;
        }
        if (hasWindSpeed && windSpeed !== selectedWindSpeed) {
            return windSpeed > selectedWindSpeed ? item : selected;
        }

        const pressure = Number(latest.pressure);
        const selectedPressure = Number(selectedLatest.pressure);
        if (
            Number.isFinite(pressure) &&
            (!Number.isFinite(selectedPressure) || pressure < selectedPressure)
        ) {
            return item;
        }

        return selected;
    }, null);
}

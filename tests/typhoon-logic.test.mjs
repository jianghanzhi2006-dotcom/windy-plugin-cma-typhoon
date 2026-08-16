import assert from 'node:assert/strict';
import test from 'node:test';

import {
    escapeHtml,
    findStrongestTyphoon,
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
    selectRecentStopped,
    selectTyphoonsGeneratedWithinOneYear,
    shouldRenderForecast,
    splitDisplayTime,
    toFiniteNumber,
    toNonNegativeNumber,
} from '../.tmp/tests/typhoonLogic.js';

test('parseJsonpPayload extracts the callback payload', () => {
    assert.deepEqual(parseJsonpPayload('callback({"items":[1,2]});', '列表'), {
        items: [1, 2],
    });
    assert.deepEqual(parseJsonpPayload('  callback ( [true] ) ; ', '列表'), [true]);
});

test('parseJsonpPayload reports malformed wrappers and JSON', () => {
    assert.throws(() => parseJsonpPayload('{"ok":true}', '列表'), /列表返回格式异常/);
    assert.throws(
        () => parseJsonpPayload('callback({broken})', '列表'),
        /列表返回内容不是有效 JSON/,
    );
});

test('getBeaufort preserves category boundaries and the labelled extension', () => {
    assert.equal(getBeaufort(13.8).text, '6级热带低压');
    assert.equal(getBeaufort(13.9).text, '7级热带低压');
    assert.equal(getBeaufort(17.1).text, '7级热带低压');
    assert.equal(getBeaufort(17.2).text, '8级热带风暴');
    assert.equal(getBeaufort(20.7).text, '8级热带风暴');
    assert.equal(getBeaufort(20.8).text, '9级热带风暴');
    assert.equal(getBeaufort(61.2).text, '17级超强台风');
    assert.deepEqual(
        { text: getBeaufort(61.3).text, qualifier: getBeaufort(61.3).qualifier },
        { text: '18级超强台风', qualifier: '扩展' },
    );
});

test('invalid wind values never fall through to the extended Level 18 band', () => {
    for (const value of [Number.NaN, undefined, null, 'n/a', '', -1]) {
        assert.deepEqual(getBeaufort(value), {
            text: '风速暂无数据',
            color: '#595959',
            textColor: '#FFFFFF',
        });
    }

    assert.equal(getBeaufort('17.2').text, '8级热带风暴');
    assert.equal(getBeaufort(0).text, '0级无风');
});

test('numeric and coordinate validation rejects empty, non-finite, and out-of-range data', () => {
    assert.equal(toFiniteNumber(' 12.5 '), 12.5);
    assert.equal(toFiniteNumber(null), null);
    assert.equal(toFiniteNumber(''), null);
    assert.equal(toFiniteNumber(Number.POSITIVE_INFINITY), null);
    assert.equal(toNonNegativeNumber(-0.1), null);
    assert.equal(toNonNegativeNumber('0'), 0);
    assert.equal(isValidLatLng(22.5, 114.1), true);
    assert.equal(isValidLatLng('22.5', '114.1'), true);
    assert.equal(isValidLatLng(91, 114.1), false);
    assert.equal(isValidLatLng(22.5, 181), false);
    assert.equal(isValidLatLng(null, 114.1), false);
});

test('getFirstObservationTime finds the earliest valid timestamp even when points are unordered', () => {
    const rawData = [];
    rawData[8] = [
        [null, '202608030000'],
        [null, 'invalid'],
        [null, '20250801120099'],
        [null, '202608011200'],
        [null, '202608020600'],
    ];

    assert.equal(getFirstObservationTime(rawData), '202608011200');
    assert.equal(getFirstObservationTime([]), '');
    assert.equal(getFirstObservationTime(null), '');
});

test('recent history uses a Beijing rolling calendar year and includes the cutoff minute', () => {
    const now = new Date('2026-08-11T12:00:37Z');
    const atCutoff = { id: 'cutoff', generationTime: '202508111200' };
    const newest = { id: 'newest', generationTime: '202608111200' };
    const beforeCutoff = { id: 'old', generationTime: '202508111159' };
    const future = { id: 'future', generationTime: '202608111201' };
    const invalid = { id: 'invalid', generationTime: 'not-a-time' };

    assert.deepEqual(
        selectTyphoonsGeneratedWithinOneYear(
            [atCutoff, beforeCutoff, newest, future, invalid],
            now,
        ),
        [newest, atCutoff],
    );
});

test('recent history clamps a Beijing leap-day cutoff to February 28', () => {
    const now = new Date('2024-02-29T12:00:00Z');
    const atCutoff = { id: 'cutoff', generationTime: '202302281200' };
    const beforeCutoff = { id: 'old', generationTime: '202302281159' };

    assert.deepEqual(
        selectTyphoonsGeneratedWithinOneYear([beforeCutoff, atCutoff], now),
        [atCutoff],
    );
});

test('historical list normalization rejects malformed rows, deduplicates, and sorts newest first', () => {
    const items = normalizeHistoricalTyphoonList([
        ['storm-1', 'ALPHA', '阿尔法', null, '2401', null, null, 'stop'],
        ['storm-2', 'YAGI', '摩羯', null, '2411', null, null, 'stop'],
        ['storm-1', 'ALPHA LIVE', '阿尔法', null, '2401', null, null, 'start'],
        [null, 'INVALID', '无效', null, '2499', null, null, 'stop'],
        'not-an-array',
    ]);

    assert.deepEqual(items, [
        {
            id: 'storm-2',
            no: '2411',
            nameEn: 'YAGI',
            nameCn: '摩羯',
            sourceStatus: 'stop',
        },
        {
            id: 'storm-1',
            no: '2401',
            nameEn: 'ALPHA LIVE',
            nameCn: '阿尔法',
            sourceStatus: 'start',
        },
    ]);
});

test('escapeHtml neutralizes remote text before it enters popup markup', () => {
    assert.equal(
        escapeHtml(`<img src=x onerror="alert('x')">&`),
        '&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;&amp;',
    );
    assert.equal(escapeHtml(null), '');
});

test('formatCleanTime converts UTC source hours to Beijing time across dates', () => {
    assert.equal(formatCleanTime('202508011100'), '08-01 19:00');
    assert.equal(formatCleanTime('202508011137'), '08-01 19:37');
    assert.equal(formatCleanTime('202507311700'), '08-01 01:00');
    assert.equal(formatCleanTime('202512311800'), '01-01 02:00');
    assert.equal(formatCleanTime('202502301100'), '202502301100');
    assert.equal(formatCleanTime('short'), 'short');
});

test('formatForecastTime adds forecast lead time before Beijing conversion', () => {
    assert.equal(formatForecastTime('202508011100', 0), '08-01 19:00');
    assert.equal(formatForecastTime('202508011100', 120), '08-06 19:00');
    assert.equal(formatForecastTime('202508011100', -1), '202508011100');
    assert.equal(formatForecastTime('short', 24), 'short');
});

test('Beijing refresh time and CMA list years handle the UTC year boundary', () => {
    assert.equal(formatBeijingRefreshTime(new Date('2026-08-08T21:34:00Z')), '08-09 05:34');
    assert.deepEqual(getCmaListYears(new Date('2026-12-31T15:59:00Z')), [2026]);
    assert.deepEqual(getCmaListYears(new Date('2026-12-31T16:01:00Z')), [2027, 2026]);
    assert.deepEqual(getCmaListYears(new Date('2027-01-31T15:59:00Z')), [2027, 2026]);
    assert.deepEqual(getCmaListYears(new Date('2027-01-31T16:01:00Z')), [2027]);
});

test('splitDisplayTime always separates mobile date and time columns', () => {
    assert.deepEqual(splitDisplayTime('08-01 11:00'), { date: '08-01', time: '11:00' });
    assert.deepEqual(splitDisplayTime('07-31 17:00'), { date: '07-31', time: '17:00' });
    assert.deepEqual(splitDisplayTime('unknown'), { date: 'unknown', time: '' });
});

test('getLatestObservationTime reads the last observed point safely', () => {
    const rawData = [];
    rawData[8] = [
        [null, '202608070000', null, null, 120, 20],
        [null, '202608080600', null, null, 121, 21],
    ];

    assert.equal(getLatestObservationTime(rawData), '202608080600');

    rawData[8].push([null, '202608090000', null, null, 999, 21]);
    rawData[8].push([null, 'invalid', null, null, 122, 22]);
    assert.equal(getLatestObservationTime(rawData), '202608080600');
    assert.equal(getLatestObservationTime([]), '');
    assert.equal(getLatestObservationTime(null), '');
});

test('selectRecentStopped sorts by latest observation time instead of input order', () => {
    const oldStorm = { id: 30, latestObservationTime: '202608050000' };
    const newestStorm = { id: 10, latestObservationTime: '202608080600' };
    const middleStorm = { id: 20, latestObservationTime: '202608070000' };

    assert.deepEqual(selectRecentStopped([oldStorm, newestStorm, middleStorm], 2), [
        newestStorm,
        middleStorm,
    ]);
    assert.deepEqual(selectRecentStopped([oldStorm], 0), []);
});

test('selectDefaultTyphoon prefers the strongest active storm', () => {
    const stopped = {
        id: 'stopped',
        status: '已停编',
        latestObservationTime: '202608080900',
        historyPoints: [{ speedMs: 70, pressure: 900 }],
    };
    const weakActive = {
        id: 'weak-active',
        status: '进行中',
        latestObservationTime: '202608080600',
        historyPoints: [{ speedMs: 20, pressure: 990 }],
    };
    const strongActive = {
        id: 'strong-active',
        status: '进行中',
        latestObservationTime: '202608080300',
        historyPoints: [{ speedMs: 35, pressure: 960 }],
    };

    assert.equal(selectDefaultTyphoon([stopped, weakActive, strongActive]), strongActive);
});

test('selectDefaultTyphoon uses the most recently observed stopped storm as fallback', () => {
    const older = {
        id: 'older',
        status: '已停编',
        latestObservationTime: '202608070000',
        historyPoints: [{ speedMs: 50, pressure: 950 }],
    };
    const newer = {
        id: 'newer',
        status: '已停编',
        latestObservationTime: '202608080000',
        historyPoints: [{ speedMs: 10, pressure: 1000 }],
    };

    assert.equal(selectDefaultTyphoon([older, newer]), newer);
    assert.equal(selectDefaultTyphoon([]), null);
});

test('shouldRenderForecast suppresses forecasts for stopped storms', () => {
    assert.equal(shouldRenderForecast('进行中'), true);
    assert.equal(shouldRenderForecast('已停编'), false);
    assert.equal(shouldRenderForecast(undefined), false);
});

test('findStrongestTyphoon selects the highest wind regardless of list order', () => {
    const weak = { id: 'weak', historyPoints: [{ speedMs: 15, pressure: 1002 }] };
    const strong = { id: 'strong', historyPoints: [{ speedMs: 60, pressure: 920 }] };
    assert.equal(findStrongestTyphoon([weak, strong]), strong);
    assert.equal(findStrongestTyphoon([strong, weak]), strong);
});

test('findStrongestTyphoon uses lower pressure only when wind speeds tie', () => {
    const highPressure = { id: 'a', historyPoints: [{ speedMs: 30, pressure: 980 }] };
    const lowPressure = { id: 'b', historyPoints: [{ speedMs: 30, pressure: 960 }] };
    assert.equal(findStrongestTyphoon([highPressure, lowPressure]), lowPressure);
});

test('findStrongestTyphoon handles missing data and keeps a stable tie', () => {
    const missing = { id: 'missing', historyPoints: [] };
    const invalid = { id: 'invalid', historyPoints: [{ speedMs: 'n/a', pressure: 900 }] };
    const nullWind = { id: 'null', historyPoints: [{ speedMs: null, pressure: 1000 }] };
    const calm = { id: 'calm', historyPoints: [{ speedMs: 0, pressure: 1005 }] };
    const first = { id: 'first', historyPoints: [{ speedMs: 20, pressure: 990 }] };
    const tied = { id: 'tied', historyPoints: [{ speedMs: 20, pressure: 990 }] };
    assert.equal(findStrongestTyphoon([]), null);
    assert.equal(findStrongestTyphoon([missing, invalid, first]), first);
    assert.equal(findStrongestTyphoon([nullWind, calm]), calm);
    assert.equal(findStrongestTyphoon([first, tied]), first);
});

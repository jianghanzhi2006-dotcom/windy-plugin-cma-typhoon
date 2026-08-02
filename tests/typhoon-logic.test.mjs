import assert from 'node:assert/strict';
import test from 'node:test';

import {
    findStrongestTyphoon,
    formatCleanTime,
    formatForecastTime,
    getBeaufort,
    parseJsonpPayload,
    splitDisplayTime,
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

test('formatCleanTime converts UTC source hours to Beijing time across dates', () => {
    assert.equal(formatCleanTime('202508011100'), '08-01 19:00');
    assert.equal(formatCleanTime('202507311700'), '08-01 01:00');
    assert.equal(formatCleanTime('202512311800'), '01-01 02:00');
    assert.equal(formatCleanTime('short'), 'short');
});

test('formatForecastTime adds forecast lead time before Beijing conversion', () => {
    assert.equal(formatForecastTime('202508011100', 0), '08-01 19:00');
    assert.equal(formatForecastTime('202508011100', 120), '08-06 19:00');
    assert.equal(formatForecastTime('short', 24), 'short');
});

test('splitDisplayTime always separates mobile date and time columns', () => {
    assert.deepEqual(splitDisplayTime('08-01 11:00'), { date: '08-01', time: '11:00' });
    assert.deepEqual(splitDisplayTime('07-31 17:00'), { date: '07-31', time: '17:00' });
    assert.deepEqual(splitDisplayTime('unknown'), { date: 'unknown', time: '' });
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
    const first = { id: 'first', historyPoints: [{ speedMs: 20, pressure: 990 }] };
    const tied = { id: 'tied', historyPoints: [{ speedMs: 20, pressure: 990 }] };
    assert.equal(findStrongestTyphoon([]), null);
    assert.equal(findStrongestTyphoon([missing, invalid, first]), first);
    assert.equal(findStrongestTyphoon([first, tied]), first);
});

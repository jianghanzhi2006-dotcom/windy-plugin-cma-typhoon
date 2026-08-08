const __pluginConfig =  {
  "name": "windy-plugin-cma-typhoon",
  "version": "1.0.3",
  "icon": "🌀",
  "title": "中央气象台 (CMA) 台风路径追踪",
  "description": "CMA real-time typhoon tracker using the GB/T 28591-2012 0–17 wind scale, with a clearly labeled extended Level 18 above 61.2 m/s and GB/T 19201-2006 tropical-cyclone categories.",
  "author": "jianghanzhi2006-dotcom",
  "repository": "https://github.com/jianghanzhi2006-dotcom/windy-plugin-cma-typhoon",
  "desktopUI": "rhpane",
  "mobileUI": "fullscreen",
  "private": false,
  "built": 1786232367443,
  "builtReadable": "2026-08-08T23:39:27.443Z",
  "screenshot": "screenshot.jpg"
};

// transformCode: import bcast from '@windy/broadcast';
const bcast = W.broadcast;

// transformCode: import { map } from '@windy/map';
const { map } = W.map;


/** @returns {void} */
function noop() {}

function run(fn) {
	return fn();
}

function blank_object() {
	return Object.create(null);
}

/**
 * @param {Function[]} fns
 * @returns {void}
 */
function run_all(fns) {
	fns.forEach(run);
}

/**
 * @param {any} thing
 * @returns {thing is Function}
 */
function is_function(thing) {
	return typeof thing === 'function';
}

/** @returns {boolean} */
function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}

/** @returns {boolean} */
function is_empty(obj) {
	return Object.keys(obj).length === 0;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @returns {void}
 */
function append(target, node) {
	target.appendChild(node);
}

/**
 * @param {Node} target
 * @param {string} style_sheet_id
 * @param {string} styles
 * @returns {void}
 */
function append_styles(target, style_sheet_id, styles) {
	const append_styles_to = get_root_for_style(target);
	if (!append_styles_to.getElementById(style_sheet_id)) {
		const style = element('style');
		style.id = style_sheet_id;
		style.textContent = styles;
		append_stylesheet(append_styles_to, style);
	}
}

/**
 * @param {Node} node
 * @returns {ShadowRoot | Document}
 */
function get_root_for_style(node) {
	if (!node) return document;
	const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
	if (root && /** @type {ShadowRoot} */ (root).host) {
		return /** @type {ShadowRoot} */ (root);
	}
	return node.ownerDocument;
}

/**
 * @param {ShadowRoot | Document} node
 * @param {HTMLStyleElement} style
 * @returns {CSSStyleSheet}
 */
function append_stylesheet(node, style) {
	append(/** @type {Document} */ (node).head || node, style);
	return style.sheet;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @param {Node} [anchor]
 * @returns {void}
 */
function insert(target, node, anchor) {
	target.insertBefore(node, anchor || null);
}

/**
 * @param {Node} node
 * @returns {void}
 */
function detach(node) {
	if (node.parentNode) {
		node.parentNode.removeChild(node);
	}
}

/**
 * @returns {void} */
function destroy_each(iterations, detaching) {
	for (let i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].d(detaching);
	}
}

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} name
 * @returns {HTMLElementTagNameMap[K]}
 */
function element(name) {
	return document.createElement(name);
}

/**
 * @param {string} data
 * @returns {Text}
 */
function text(data) {
	return document.createTextNode(data);
}

/**
 * @returns {Text} */
function space() {
	return text(' ');
}

/**
 * @param {EventTarget} node
 * @param {string} event
 * @param {EventListenerOrEventListenerObject} handler
 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
 * @returns {() => void}
 */
function listen(node, event, handler, options) {
	node.addEventListener(event, handler, options);
	return () => node.removeEventListener(event, handler, options);
}

/**
 * @param {Element} node
 * @param {string} attribute
 * @param {string} [value]
 * @returns {void}
 */
function attr(node, attribute, value) {
	if (value == null) node.removeAttribute(attribute);
	else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}

/**
 * @param {Element} element
 * @returns {ChildNode[]}
 */
function children(element) {
	return Array.from(element.childNodes);
}

/**
 * @param {Text} text
 * @param {unknown} data
 * @returns {void}
 */
function set_data(text, data) {
	data = '' + data;
	if (text.data === data) return;
	text.data = /** @type {string} */ (data);
}

/**
 * @returns {void} */
function set_style(node, key, value, important) {
	if (value == null) {
		node.style.removeProperty(key);
	} else {
		node.style.setProperty(key, value, '');
	}
}

/**
 * @typedef {Node & {
 * 	claim_order?: number;
 * 	hydrate_init?: true;
 * 	actual_end_child?: NodeEx;
 * 	childNodes: NodeListOf<NodeEx>;
 * }} NodeEx
 */

/** @typedef {ChildNode & NodeEx} ChildNodeEx */

/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

/**
 * @typedef {ChildNodeEx[] & {
 * 	claim_info?: {
 * 		last_index: number;
 * 		total_claimed: number;
 * 	};
 * }} ChildNodeArray
 */

let current_component;

/** @returns {void} */
function set_current_component(component) {
	current_component = component;
}

function get_current_component() {
	if (!current_component) throw new Error('Function called outside component initialization');
	return current_component;
}

/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
 *
 * `onMount` does not run inside a [server-side component](https://svelte.dev/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs/svelte#onmount
 * @template T
 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
 * @returns {void}
 */
function onMount(fn) {
	get_current_component().$$.on_mount.push(fn);
}

/**
 * Schedules a callback to run immediately before the component is unmounted.
 *
 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
 * only one that runs inside a server-side component.
 *
 * https://svelte.dev/docs/svelte#ondestroy
 * @param {() => any} fn
 * @returns {void}
 */
function onDestroy(fn) {
	get_current_component().$$.on_destroy.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];

let render_callbacks = [];

const flush_callbacks = [];

const resolved_promise = /* @__PURE__ */ Promise.resolve();

let update_scheduled = false;

/** @returns {void} */
function schedule_update() {
	if (!update_scheduled) {
		update_scheduled = true;
		resolved_promise.then(flush);
	}
}

/** @returns {void} */
function add_render_callback(fn) {
	render_callbacks.push(fn);
}

// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();

let flushidx = 0; // Do *not* move this inside the flush() function

/** @returns {void} */
function flush() {
	// Do not reenter flush while dirty components are updated, as this can
	// result in an infinite loop. Instead, let the inner flush handle it.
	// Reentrancy is ok afterwards for bindings etc.
	if (flushidx !== 0) {
		return;
	}
	const saved_component = current_component;
	do {
		// first, call beforeUpdate functions
		// and update components
		try {
			while (flushidx < dirty_components.length) {
				const component = dirty_components[flushidx];
				flushidx++;
				set_current_component(component);
				update(component.$$);
			}
		} catch (e) {
			// reset dirty state to not end up in a deadlocked state and then rethrow
			dirty_components.length = 0;
			flushidx = 0;
			throw e;
		}
		set_current_component(null);
		dirty_components.length = 0;
		flushidx = 0;
		while (binding_callbacks.length) binding_callbacks.pop()();
		// then, once components are updated, call
		// afterUpdate functions. This may cause
		// subsequent updates...
		for (let i = 0; i < render_callbacks.length; i += 1) {
			const callback = render_callbacks[i];
			if (!seen_callbacks.has(callback)) {
				// ...so guard against infinite loops
				seen_callbacks.add(callback);
				callback();
			}
		}
		render_callbacks.length = 0;
	} while (dirty_components.length);
	while (flush_callbacks.length) {
		flush_callbacks.pop()();
	}
	update_scheduled = false;
	seen_callbacks.clear();
	set_current_component(saved_component);
}

/** @returns {void} */
function update($$) {
	if ($$.fragment !== null) {
		$$.update();
		run_all($$.before_update);
		const dirty = $$.dirty;
		$$.dirty = [-1];
		$$.fragment && $$.fragment.p($$.ctx, dirty);
		$$.after_update.forEach(add_render_callback);
	}
}

/**
 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
 * @param {Function[]} fns
 * @returns {void}
 */
function flush_render_callbacks(fns) {
	const filtered = [];
	const targets = [];
	render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
	targets.forEach((c) => c());
	render_callbacks = filtered;
}

const outroing = new Set();

/**
 * @param {import('./private.js').Fragment} block
 * @param {0 | 1} [local]
 * @returns {void}
 */
function transition_in(block, local) {
	if (block && block.i) {
		outroing.delete(block);
		block.i(local);
	}
}

/** @typedef {1} INTRO */
/** @typedef {0} OUTRO */
/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

/**
 * @typedef {Object} Outro
 * @property {number} r
 * @property {Function[]} c
 * @property {Object} p
 */

/**
 * @typedef {Object} PendingProgram
 * @property {number} start
 * @property {INTRO|OUTRO} b
 * @property {Outro} [group]
 */

/**
 * @typedef {Object} Program
 * @property {number} a
 * @property {INTRO|OUTRO} b
 * @property {1|-1} d
 * @property {number} duration
 * @property {number} start
 * @property {number} end
 * @property {Outro} [group]
 */

// general each functions:

function ensure_array_like(array_like_or_iterator) {
	return array_like_or_iterator?.length !== undefined
		? array_like_or_iterator
		: Array.from(array_like_or_iterator);
}

/** @returns {void} */
function mount_component(component, target, anchor) {
	const { fragment, after_update } = component.$$;
	fragment && fragment.m(target, anchor);
	// onMount happens before the initial afterUpdate
	add_render_callback(() => {
		const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
		// if the component was destroyed immediately
		// it will update the `$$.on_destroy` reference to `null`.
		// the destructured on_destroy may still reference to the old array
		if (component.$$.on_destroy) {
			component.$$.on_destroy.push(...new_on_destroy);
		} else {
			// Edge case - component was destroyed immediately,
			// most likely as a result of a binding initialising
			run_all(new_on_destroy);
		}
		component.$$.on_mount = [];
	});
	after_update.forEach(add_render_callback);
}

/** @returns {void} */
function destroy_component(component, detaching) {
	const $$ = component.$$;
	if ($$.fragment !== null) {
		flush_render_callbacks($$.after_update);
		run_all($$.on_destroy);
		$$.fragment && $$.fragment.d(detaching);
		// TODO null out other refs, including component.$$ (but need to
		// preserve final state?)
		$$.on_destroy = $$.fragment = null;
		$$.ctx = [];
	}
}

/** @returns {void} */
function make_dirty(component, i) {
	if (component.$$.dirty[0] === -1) {
		dirty_components.push(component);
		schedule_update();
		component.$$.dirty.fill(0);
	}
	component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
}

// TODO: Document the other params
/**
 * @param {SvelteComponent} component
 * @param {import('./public.js').ComponentConstructorOptions} options
 *
 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
 * This will be the `add_css` function from the compiled component.
 *
 * @returns {void}
 */
function init(
	component,
	options,
	instance,
	create_fragment,
	not_equal,
	props,
	append_styles = null,
	dirty = [-1]
) {
	const parent_component = current_component;
	set_current_component(component);
	/** @type {import('./private.js').T$$} */
	const $$ = (component.$$ = {
		fragment: null,
		ctx: [],
		// state
		props,
		update: noop,
		not_equal,
		bound: blank_object(),
		// lifecycle
		on_mount: [],
		on_destroy: [],
		on_disconnect: [],
		before_update: [],
		after_update: [],
		context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
		// everything else
		callbacks: blank_object(),
		dirty,
		skip_bound: false,
		root: options.target || parent_component.$$.root
	});
	append_styles && append_styles($$.root);
	let ready = false;
	$$.ctx = instance
		? instance(component, options.props || {}, (i, ret, ...rest) => {
				const value = rest.length ? rest[0] : ret;
				if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
					if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
					if (ready) make_dirty(component, i);
				}
				return ret;
		  })
		: [];
	$$.update();
	ready = true;
	run_all($$.before_update);
	// `false` as a special case of no DOM component
	$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
	if (options.target) {
		if (options.hydrate) {
			// TODO: what is the correct type here?
			// @ts-expect-error
			const nodes = children(options.target);
			$$.fragment && $$.fragment.l(nodes);
			nodes.forEach(detach);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			$$.fragment && $$.fragment.c();
		}
		if (options.intro) transition_in(component.$$.fragment);
		mount_component(component, options.target, options.anchor);
		flush();
	}
	set_current_component(parent_component);
}

/**
 * Base class for Svelte components. Used when dev=false.
 *
 * @template {Record<string, any>} [Props=any]
 * @template {Record<string, any>} [Events=any]
 */
class SvelteComponent {
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$ = undefined;
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$set = undefined;

	/** @returns {void} */
	$destroy() {
		destroy_component(this, 1);
		this.$destroy = noop;
	}

	/**
	 * @template {Extract<keyof Events, string>} K
	 * @param {K} type
	 * @param {((e: Events[K]) => void) | null | undefined} callback
	 * @returns {() => void}
	 */
	$on(type, callback) {
		if (!is_function(callback)) {
			return noop;
		}
		const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
		callbacks.push(callback);
		return () => {
			const index = callbacks.indexOf(callback);
			if (index !== -1) callbacks.splice(index, 1);
		};
	}

	/**
	 * @param {Partial<Props>} props
	 * @returns {void}
	 */
	$set(props) {
		if (this.$$set && !is_empty(props)) {
			this.$$.skip_bound = true;
			this.$$set(props);
			this.$$.skip_bound = false;
		}
	}
}

/**
 * @typedef {Object} CustomElementPropDefinition
 * @property {string} [attribute]
 * @property {boolean} [reflect]
 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
 */

// generated during release, do not modify

const PUBLIC_VERSION = '4';

if (typeof window !== 'undefined')
	// @ts-ignore
	(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

const config = {
    title: '中央气象台 (CMA) 台风路径追踪'};

const UNKNOWN_WIND = {
    text: '风速暂无数据',
    color: '#595959',
    textColor: '#FFFFFF'
};
function parseJsonpPayload(text, label) {
    const start = text.indexOf('(');
    const end = text.lastIndexOf(')');
    if (start < 0 || end <= start + 1) {
        throw new Error(`${label}返回格式异常`);
    }
    try {
        return JSON.parse(text.slice(start + 1, end));
    } catch  {
        throw new Error(`${label}返回内容不是有效 JSON`);
    }
}
function toFiniteNumber(value) {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null;
    }
    if (typeof value !== 'string' || value.trim() === '') {
        return null;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}
function toNonNegativeNumber(value) {
    const parsed = toFiniteNumber(value);
    return parsed !== null && parsed >= 0 ? parsed : null;
}
function isValidLatLng(latValue, lngValue) {
    const lat = toFiniteNumber(latValue);
    const lng = toFiniteNumber(lngValue);
    return lat !== null && lng !== null && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}
function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character)=>{
        const entities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return entities[character];
    });
}
function getBeaufort(rawSpeed) {
    const ms = toNonNegativeNumber(rawSpeed);
    if (ms === null) {
        return {
            ...UNKNOWN_WIND
        };
    }
    if (ms < 0.3) {
        return {
            text: '0级无风',
            color: '#E8E8E8',
            textColor: '#000000'
        };
    }
    if (ms <= 1.5) {
        return {
            text: '1级软风',
            color: '#B5F5EC',
            textColor: '#000000'
        };
    }
    if (ms <= 3.3) {
        return {
            text: '2级轻风',
            color: '#87E8DE',
            textColor: '#000000'
        };
    }
    if (ms <= 5.4) {
        return {
            text: '3级微风',
            color: '#5CDBD3',
            textColor: '#000000'
        };
    }
    if (ms <= 7.9) {
        return {
            text: '4级和风',
            color: '#95DE64',
            textColor: '#000000'
        };
    }
    if (ms <= 10.7) {
        return {
            text: '5级清风',
            color: '#73D13D',
            textColor: '#000000'
        };
    }
    if (ms <= 13.8) {
        return {
            text: '6级热带低压',
            color: '#389E0D',
            textColor: '#FFFFFF'
        };
    }
    if (ms <= 17.1) {
        return {
            text: '7级热带低压',
            color: '#FADB14',
            textColor: '#000000'
        };
    }
    if (ms <= 20.7) {
        return {
            text: '8级热带风暴',
            color: '#FA8C16',
            textColor: '#FFFFFF'
        };
    }
    if (ms <= 24.4) {
        return {
            text: '9级热带风暴',
            color: '#ED571A',
            textColor: '#FFFFFF'
        };
    }
    if (ms <= 28.4) {
        return {
            text: '10级强热带风暴',
            color: '#CF1322',
            textColor: '#FFFFFF'
        };
    }
    if (ms <= 32.6) {
        return {
            text: '11级强热带风暴',
            color: '#A8071A',
            textColor: '#FFFFFF'
        };
    }
    if (ms <= 36.9) {
        return {
            text: '12级台风',
            color: '#C41D7F',
            textColor: '#FFFFFF'
        };
    }
    if (ms <= 41.4) {
        return {
            text: '13级台风',
            color: '#9E1068',
            textColor: '#FFFFFF'
        };
    }
    if (ms <= 46.1) {
        return {
            text: '14级强台风',
            color: '#722ED1',
            textColor: '#FFFFFF'
        };
    }
    if (ms <= 50.9) {
        return {
            text: '15级强台风',
            color: '#531DAB',
            textColor: '#FFFFFF'
        };
    }
    if (ms <= 56.0) {
        return {
            text: '16级超强台风',
            color: '#391085',
            textColor: '#FFFFFF'
        };
    }
    if (ms <= 61.2) {
        return {
            text: '17级超强台风',
            color: '#230759',
            textColor: '#FFFFFF'
        };
    }
    // GB/T 28591-2012 ends at Level 17 (>=56.1 m/s). This explicitly labelled
    // extension is a display convention for exceptionally high winds.
    return {
        text: '18级超强台风',
        qualifier: '扩展',
        color: '#120338',
        textColor: '#FFFFFF'
    };
}
function parseSourceTime(value) {
    if (!/^\d{12}(?:\d{2})?$/.test(value)) {
        return null;
    }
    const year = Number.parseInt(value.substring(0, 4), 10);
    const month = Number.parseInt(value.substring(4, 6), 10) - 1;
    const day = Number.parseInt(value.substring(6, 8), 10);
    const hour = Number.parseInt(value.substring(8, 10), 10);
    const minute = Number.parseInt(value.substring(10, 12), 10);
    if (![
        year,
        month,
        day,
        hour,
        minute
    ].every(Number.isFinite)) {
        return null;
    }
    const result = new Date(Date.UTC(year, month, day, hour, minute, 0));
    if (result.getUTCFullYear() !== year || result.getUTCMonth() !== month || result.getUTCDate() !== day || result.getUTCHours() !== hour || result.getUTCMinutes() !== minute) {
        return null;
    }
    return result;
}
function formatBeijingTime(date) {
    const beijingDate = new Date(date.getTime() + 8 * 3600 * 1000);
    const month = String(beijingDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(beijingDate.getUTCDate()).padStart(2, '0');
    const hour = String(beijingDate.getUTCHours()).padStart(2, '0');
    const minute = String(beijingDate.getUTCMinutes()).padStart(2, '0');
    return `${month}-${day} ${hour}:${minute}`;
}
function formatCleanTime(value) {
    const sourceDate = parseSourceTime(value);
    return sourceDate ? formatBeijingTime(sourceDate) : value;
}
function formatForecastTime(baseValue, forecastHours) {
    const sourceDate = parseSourceTime(baseValue);
    const safeForecastHours = toNonNegativeNumber(forecastHours);
    if (!sourceDate || safeForecastHours === null) {
        return baseValue;
    }
    return formatBeijingTime(new Date(sourceDate.getTime() + safeForecastHours * 3600 * 1000));
}
function formatBeijingRefreshTime(date) {
    return formatBeijingTime(date);
}
function getCmaListYears(date) {
    const beijingDate = new Date(date.getTime() + 8 * 3600 * 1000);
    const year = beijingDate.getUTCFullYear();
    return beijingDate.getUTCMonth() === 0 ? [
        year,
        year - 1
    ] : [
        year
    ];
}
function splitDisplayTime(value) {
    const [date = value, time = ''] = value.trim().split(/\s+/, 2);
    return {
        date,
        time
    };
}
function getLatestObservationTime(rawData) {
    if (!Array.isArray(rawData)) {
        return '';
    }
    const points = rawData[8];
    if (!Array.isArray(points) || points.length === 0) {
        return '';
    }
    for(let index = points.length - 1; index >= 0; index -= 1){
        const point = points[index];
        if (Array.isArray(point) && typeof point[1] === 'string' && parseSourceTime(point[1]) && isValidLatLng(point[5], point[4])) {
            return point[1];
        }
    }
    return '';
}
function selectRecentStopped(items, limit) {
    const safeLimit = Math.max(0, Math.floor(limit));
    return [
        ...items
    ].sort((left, right)=>{
        const timeCompare = String(right.latestObservationTime ?? '').localeCompare(String(left.latestObservationTime ?? ''));
        if (timeCompare !== 0) {
            return timeCompare;
        }
        const leftId = Number(left.id);
        const rightId = Number(right.id);
        return Number.isFinite(leftId) && Number.isFinite(rightId) ? rightId - leftId : 0;
    }).slice(0, safeLimit);
}
function selectDefaultTyphoon(items) {
    const active = items.filter((item)=>item.status === '进行中');
    return active.length > 0 ? findStrongestTyphoon(active) : selectRecentStopped(items, 1)[0] ?? null;
}
function shouldRenderForecast(status) {
    return status === '进行中';
}
function findStrongestTyphoon(items) {
    return items.reduce((selected, item)=>{
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

/* src\plugin.svelte generated by Svelte v4.2.20 */

function add_css(target) {
	append_styles(target, "svelte-1ke6024", ".plugin__content.svelte-1ke6024{color:#fff}");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[32] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[35] = list[i];
	child_ctx[37] = i;
	return child_ctx;
}

// (52:8) {#if typhoonListInfo.length > 0}
function create_if_block(ctx) {
	let div;
	let h4;
	let t1;
	let each_value = ensure_array_like(/*typhoonListInfo*/ ctx[1]);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div = element("div");
			h4 = element("h4");
			h4.textContent = "🌀 台风历史实况演变（最新在顶部）：";
			t1 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			set_style(h4, "margin", "0 0 10px 0");
			set_style(h4, "font-size", "14px");
			set_style(h4, "color", "#ffffff");
			set_style(h4, "font-weight", "bold");
			set_style(div, "margin-top", "15px");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, h4);
			append(div, t1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div, null);
				}
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*typhoonListInfo, focusPoint, expandedTyphoonId, toggleTyphoonPanel*/ 202) {
				each_value = ensure_array_like(/*typhoonListInfo*/ ctx[1]);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (95:24) {#if expandedTyphoonId === item.id}
function create_if_block_1(ctx) {
	let div2;
	let div0;
	let t1;
	let div1;
	let each_value_1 = ensure_array_like(/*item*/ ctx[32].historyPoints);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	return {
		c() {
			div2 = element("div");
			div0 = element("div");
			div0.textContent = "📜 全程风力演变轨迹（最新在顶部，点击直达）：";
			t1 = space();
			div1 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			set_style(div0, "font-size", "12px");
			set_style(div0, "color", "#8c8c8c");
			set_style(div0, "margin-bottom", "8px");
			set_style(div0, "font-weight", "bold");
			set_style(div1, "max-height", "520px");
			set_style(div1, "overflow-y", "auto");
			set_style(div1, "padding-right", "4px");
			set_style(div2, "margin-top", "8px");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div0);
			append(div2, t1);
			append(div2, div1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div1, null);
				}
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*focusPoint, typhoonListInfo*/ 130) {
				each_value_1 = ensure_array_like(/*item*/ ctx[32].historyPoints);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div1, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div2);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (167:72) {#if pt.bft.qualifier}
function create_if_block_2(ctx) {
	let span;
	let t_value = /*pt*/ ctx[35].bft.qualifier + "";
	let t;

	return {
		c() {
			span = element("span");
			t = text(t_value);
			set_style(span, "font-size", "10px");
			set_style(span, "margin-left", "4px");
			set_style(span, "padding", "0 3px");
			set_style(span, "border", "1px solid currentColor");
			set_style(span, "border-radius", "3px");
			set_style(span, "opacity", "0.9");
		},
		m(target, anchor) {
			insert(target, span, anchor);
			append(span, t);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*typhoonListInfo*/ 2 && t_value !== (t_value = /*pt*/ ctx[35].bft.qualifier + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (105:36) {#each item.historyPoints as pt, idx}
function create_each_block_1(ctx) {
	let div3;
	let div0;
	let span0;
	let t0_value = /*pt*/ ctx[35].displayDate + "";
	let t0;
	let t1;
	let span1;
	let t2_value = /*pt*/ ctx[35].displayTime + "";
	let t2;
	let t3;
	let div1;
	let span2;
	let t4_value = /*pt*/ ctx[35].pressure + "";
	let t4;
	let t5;
	let span3;
	let t7;
	let div2;
	let span4;
	let t8_value = /*pt*/ ctx[35].bft.text + "";
	let t8;
	let t9;
	let span5;
	let t10;
	let t11_value = /*pt*/ ctx[35].speedDisplay + "";
	let t11;
	let t12;
	let t13;
	let mounted;
	let dispose;
	let if_block = /*pt*/ ctx[35].bft.qualifier && create_if_block_2(ctx);

	function click_handler_2() {
		return /*click_handler_2*/ ctx[14](/*pt*/ ctx[35]);
	}

	function keydown_handler_1(...args) {
		return /*keydown_handler_1*/ ctx[15](/*pt*/ ctx[35], ...args);
	}

	return {
		c() {
			div3 = element("div");
			div0 = element("div");
			span0 = element("span");
			t0 = text(t0_value);
			t1 = space();
			span1 = element("span");
			t2 = text(t2_value);
			t3 = space();
			div1 = element("div");
			span2 = element("span");
			t4 = text(t4_value);
			t5 = space();
			span3 = element("span");
			span3.textContent = "hPa";
			t7 = space();
			div2 = element("div");
			span4 = element("span");
			t8 = text(t8_value);
			t9 = space();
			span5 = element("span");
			t10 = text("(");
			t11 = text(t11_value);
			t12 = text(")");
			if (if_block) if_block.c();
			t13 = space();
			set_style(span0, "color", /*idx*/ ctx[37] === 0 ? '#40a9ff' : '#ffffff');
			set_style(span0, "font-weight", /*idx*/ ctx[37] === 0 ? 'bold' : 'normal');
			set_style(span0, "white-space", "nowrap");
			set_style(span1, "color", /*idx*/ ctx[37] === 0 ? '#40a9ff' : '#ffffff');
			set_style(span1, "font-weight", /*idx*/ ctx[37] === 0 ? 'bold' : 'normal');
			set_style(span1, "white-space", "nowrap");
			set_style(div0, "min-width", "0");
			set_style(div0, "display", "flex");
			set_style(div0, "flex-direction", "column");
			set_style(div0, "align-items", "flex-start");
			set_style(div0, "line-height", "1.25");
			set_style(div0, "font-variant-numeric", "tabular-nums");
			set_style(span2, "white-space", "nowrap");
			set_style(span3, "white-space", "nowrap");
			set_style(div1, "min-width", "0");
			set_style(div1, "display", "flex");
			set_style(div1, "flex-direction", "column");
			set_style(div1, "align-items", "flex-start");
			set_style(div1, "color", "#aaa");
			set_style(div1, "font-size", "12px");
			set_style(div1, "line-height", "1.25");
			set_style(div1, "font-variant-numeric", "tabular-nums");
			set_style(span4, "font-size", "13px");
			set_style(span4, "line-height", "1.2");
			set_style(span4, "white-space", "nowrap");
			set_style(span5, "font-size", "12px");
			set_style(span5, "line-height", "1.2");
			set_style(span5, "opacity", "0.95");
			set_style(span5, "margin-top", "2px");
			set_style(span5, "white-space", "nowrap");
			set_style(div2, "box-sizing", "border-box");
			set_style(div2, "width", "100%");
			set_style(div2, "min-width", "0");
			set_style(div2, "background", /*pt*/ ctx[35].bft.color);
			set_style(div2, "color", /*pt*/ ctx[35].bft.textColor);
			set_style(div2, "padding", "4px 6px");
			set_style(div2, "border-radius", "6px");
			set_style(div2, "font-weight", "bold");

			set_style(div2, "text-shadow", /*pt*/ ctx[35].bft.textColor === '#ffffff'
			? '0 1px 2px rgba(0,0,0,0.8)'
			: 'none');

			set_style(div2, "text-align", "center");
			set_style(div2, "display", "flex");
			set_style(div2, "flex-direction", "column");
			set_style(div2, "align-items", "center");
			set_style(div2, "justify-content", "center");
			attr(div3, "role", "button");
			attr(div3, "tabindex", "0");
			set_style(div3, "background", /*idx*/ ctx[37] === 0 ? '#132738' : '#262626');
			set_style(div3, "border-radius", "6px");
			set_style(div3, "padding", "8px 12px");
			set_style(div3, "margin-bottom", "6px");
			set_style(div3, "font-size", "13px");
			set_style(div3, "display", "grid");
			set_style(div3, "grid-template-columns", "64px 48px minmax(108px, 126px)");
			set_style(div3, "column-gap", "8px");
			set_style(div3, "justify-content", "space-between");
			set_style(div3, "align-items", "center");
			set_style(div3, "cursor", "pointer");

			set_style(div3, "border", /*idx*/ ctx[37] === 0
			? '1.5px solid #1890ff'
			: '1px solid #383838');

			set_style(div3, "box-shadow", /*idx*/ ctx[37] === 0
			? '0 0 8px rgba(24,144,255,0.35)'
			: 'none');

			set_style(div3, "transition", "all 0.2s");
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div0);
			append(div0, span0);
			append(span0, t0);
			append(div0, t1);
			append(div0, span1);
			append(span1, t2);
			append(div3, t3);
			append(div3, div1);
			append(div1, span2);
			append(span2, t4);
			append(div1, t5);
			append(div1, span3);
			append(div3, t7);
			append(div3, div2);
			append(div2, span4);
			append(span4, t8);
			append(div2, t9);
			append(div2, span5);
			append(span5, t10);
			append(span5, t11);
			append(span5, t12);
			if (if_block) if_block.m(span5, null);
			append(div3, t13);

			if (!mounted) {
				dispose = [
					listen(div3, "click", click_handler_2),
					listen(div3, "keydown", keydown_handler_1)
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty[0] & /*typhoonListInfo*/ 2 && t0_value !== (t0_value = /*pt*/ ctx[35].displayDate + "")) set_data(t0, t0_value);
			if (dirty[0] & /*typhoonListInfo*/ 2 && t2_value !== (t2_value = /*pt*/ ctx[35].displayTime + "")) set_data(t2, t2_value);
			if (dirty[0] & /*typhoonListInfo*/ 2 && t4_value !== (t4_value = /*pt*/ ctx[35].pressure + "")) set_data(t4, t4_value);
			if (dirty[0] & /*typhoonListInfo*/ 2 && t8_value !== (t8_value = /*pt*/ ctx[35].bft.text + "")) set_data(t8, t8_value);
			if (dirty[0] & /*typhoonListInfo*/ 2 && t11_value !== (t11_value = /*pt*/ ctx[35].speedDisplay + "")) set_data(t11, t11_value);

			if (/*pt*/ ctx[35].bft.qualifier) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_2(ctx);
					if_block.c();
					if_block.m(span5, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty[0] & /*typhoonListInfo*/ 2) {
				set_style(div2, "background", /*pt*/ ctx[35].bft.color);
			}

			if (dirty[0] & /*typhoonListInfo*/ 2) {
				set_style(div2, "color", /*pt*/ ctx[35].bft.textColor);
			}

			if (dirty[0] & /*typhoonListInfo*/ 2) {
				set_style(div2, "text-shadow", /*pt*/ ctx[35].bft.textColor === '#ffffff'
				? '0 1px 2px rgba(0,0,0,0.8)'
				: 'none');
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div3);
			}

			if (if_block) if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};
}

// (57:16) {#each typhoonListInfo as item}
function create_each_block(ctx) {
	let div;
	let button;
	let strong;
	let t0;
	let t1_value = /*item*/ ctx[32].no + "";
	let t1;
	let t2;
	let t3_value = /*item*/ ctx[32].nameCn + "";
	let t3;
	let t4;
	let t5_value = /*item*/ ctx[32].nameEn + "";
	let t5;
	let t6;
	let t7;
	let span2;
	let span0;
	let t8;
	let t9_value = /*item*/ ctx[32].status + "";
	let t9;
	let t10;
	let span1;

	let t11_value = (/*expandedTyphoonId*/ ctx[3] === /*item*/ ctx[32].id
	? '▼'
	: '▶') + "";

	let t11;
	let button_aria_expanded_value;
	let t12;
	let t13;
	let mounted;
	let dispose;

	function click_handler_1() {
		return /*click_handler_1*/ ctx[13](/*item*/ ctx[32]);
	}

	let if_block = /*expandedTyphoonId*/ ctx[3] === /*item*/ ctx[32].id && create_if_block_1(ctx);

	return {
		c() {
			div = element("div");
			button = element("button");
			strong = element("strong");
			t0 = text("🌀 ");
			t1 = text(t1_value);
			t2 = space();
			t3 = text(t3_value);
			t4 = text(" (");
			t5 = text(t5_value);
			t6 = text(")");
			t7 = space();
			span2 = element("span");
			span0 = element("span");
			t8 = text("● ");
			t9 = text(t9_value);
			t10 = space();
			span1 = element("span");
			t11 = text(t11_value);
			t12 = space();
			if (if_block) if_block.c();
			t13 = space();
			set_style(strong, "color", "#69c0ff");
			set_style(strong, "font-size", "15px");

			set_style(span0, "background", /*item*/ ctx[32].status === '进行中'
			? '#275017'
			: '#434343');

			set_style(span0, "color", "#ffffff");
			set_style(span0, "padding", "2px 8px");
			set_style(span0, "border-radius", "10px");
			set_style(span0, "font-size", "12px");
			set_style(span0, "font-weight", "bold");
			attr(span1, "aria-hidden", "true");
			set_style(span1, "color", "#bfbfbf");
			set_style(span1, "font-size", "12px");
			set_style(span1, "line-height", "1");
			set_style(span1, "width", "12px");
			set_style(span1, "text-align", "center");
			set_style(span2, "display", "flex");
			set_style(span2, "align-items", "center");
			set_style(span2, "gap", "7px");
			set_style(span2, "flex-shrink", "0");
			attr(button, "type", "button");
			attr(button, "aria-expanded", button_aria_expanded_value = /*expandedTyphoonId*/ ctx[3] === /*item*/ ctx[32].id);
			set_style(button, "width", "100%");
			set_style(button, "display", "flex");
			set_style(button, "justify-content", "space-between");
			set_style(button, "align-items", "center");
			set_style(button, "gap", "8px");

			set_style(button, "padding", "0 0 " + (/*expandedTyphoonId*/ ctx[3] === /*item*/ ctx[32].id
			? '6px'
			: '0'));

			set_style(button, "margin", "0 0 " + (/*expandedTyphoonId*/ ctx[3] === /*item*/ ctx[32].id
			? '8px'
			: '0'));

			set_style(button, "border", "none");

			set_style(button, "border-bottom", /*expandedTyphoonId*/ ctx[3] === /*item*/ ctx[32].id
			? '1px solid #333'
			: 'none');

			set_style(button, "background", "transparent");
			set_style(button, "color", "inherit");
			set_style(button, "text-align", "left");
			set_style(button, "cursor", "pointer");
			set_style(button, "font", "inherit");
			set_style(div, "background", "#1e1e1e");
			set_style(div, "border-radius", "8px");
			set_style(div, "padding", "12px");
			set_style(div, "margin-bottom", "12px");
			set_style(div, "border", "1px solid #3a3a3a");
			set_style(div, "box-shadow", "0 2px 6px rgba(0,0,0,0.4)");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, button);
			append(button, strong);
			append(strong, t0);
			append(strong, t1);
			append(strong, t2);
			append(strong, t3);
			append(strong, t4);
			append(strong, t5);
			append(strong, t6);
			append(button, t7);
			append(button, span2);
			append(span2, span0);
			append(span0, t8);
			append(span0, t9);
			append(span2, t10);
			append(span2, span1);
			append(span1, t11);
			append(div, t12);
			if (if_block) if_block.m(div, null);
			append(div, t13);

			if (!mounted) {
				dispose = listen(button, "click", click_handler_1);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty[0] & /*typhoonListInfo*/ 2 && t1_value !== (t1_value = /*item*/ ctx[32].no + "")) set_data(t1, t1_value);
			if (dirty[0] & /*typhoonListInfo*/ 2 && t3_value !== (t3_value = /*item*/ ctx[32].nameCn + "")) set_data(t3, t3_value);
			if (dirty[0] & /*typhoonListInfo*/ 2 && t5_value !== (t5_value = /*item*/ ctx[32].nameEn + "")) set_data(t5, t5_value);
			if (dirty[0] & /*typhoonListInfo*/ 2 && t9_value !== (t9_value = /*item*/ ctx[32].status + "")) set_data(t9, t9_value);

			if (dirty[0] & /*typhoonListInfo*/ 2) {
				set_style(span0, "background", /*item*/ ctx[32].status === '进行中'
				? '#275017'
				: '#434343');
			}

			if (dirty[0] & /*expandedTyphoonId, typhoonListInfo*/ 10 && t11_value !== (t11_value = (/*expandedTyphoonId*/ ctx[3] === /*item*/ ctx[32].id
			? '▼'
			: '▶') + "")) set_data(t11, t11_value);

			if (dirty[0] & /*expandedTyphoonId, typhoonListInfo*/ 10 && button_aria_expanded_value !== (button_aria_expanded_value = /*expandedTyphoonId*/ ctx[3] === /*item*/ ctx[32].id)) {
				attr(button, "aria-expanded", button_aria_expanded_value);
			}

			if (dirty[0] & /*expandedTyphoonId, typhoonListInfo*/ 10) {
				set_style(button, "padding", "0 0 " + (/*expandedTyphoonId*/ ctx[3] === /*item*/ ctx[32].id
				? '6px'
				: '0'));
			}

			if (dirty[0] & /*expandedTyphoonId, typhoonListInfo*/ 10) {
				set_style(button, "margin", "0 0 " + (/*expandedTyphoonId*/ ctx[3] === /*item*/ ctx[32].id
				? '8px'
				: '0'));
			}

			if (dirty[0] & /*expandedTyphoonId, typhoonListInfo*/ 10) {
				set_style(button, "border-bottom", /*expandedTyphoonId*/ ctx[3] === /*item*/ ctx[32].id
				? '1px solid #333'
				: 'none');
			}

			if (/*expandedTyphoonId*/ ctx[3] === /*item*/ ctx[32].id) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1(ctx);
					if_block.c();
					if_block.m(div, t13);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			if (if_block) if_block.d();
			mounted = false;
			dispose();
		}
	};
}

function create_fragment(ctx) {
	let div0;
	let t1;
	let section;
	let div1;
	let t3;
	let div4;
	let div2;
	let t12;
	let div3;
	let t13;
	let t14;
	let button;

	let t15_value = (/*isLoading*/ ctx[2]
	? '⏳ 正在刷新中央气象台数据…'
	: '📡 刷新中央气象台实时数据') + "";

	let t15;
	let t16;
	let mounted;
	let dispose;
	let if_block = /*typhoonListInfo*/ ctx[1].length > 0 && create_if_block(ctx);

	return {
		c() {
			div0 = element("div");
			div0.textContent = `${/*title*/ ctx[4]}`;
			t1 = space();
			section = element("section");
			div1 = element("div");
			div1.textContent = `${/*title*/ ctx[4]}`;
			t3 = space();
			div4 = element("div");
			div2 = element("div");

			div2.innerHTML = `<strong style="color: #40a9ff; font-size: 14px;">🌀 中央气象台 (CMA) 实时与预报路径</strong> <p style="font-size: 12px; color: #d9d9d9; margin: 4px 0 0 0;">数据来源：CMA 官方接口 (typhoon.nmc.cn)<br/>
                风力级数：GB/T 28591-2012（0–17级）<br/>
                扩展显示：风速 &gt; 61.2 m/s 时标记为“18级（扩展）”<br/>
                气旋等级：GB/T 19201-2006（2分钟平均风）<br/>
                轨迹说明：🌈 分色实线 (实况) | 🟡 金色虚线 (120h预测)<br/>
                更新与停编：打开时及手动刷新；已停编仅显示历史实况</p>`;

			t12 = space();
			div3 = element("div");
			t13 = text(/*statusText*/ ctx[0]);
			t14 = space();
			button = element("button");
			t15 = text(t15_value);
			t16 = space();
			if (if_block) if_block.c();
			attr(div0, "class", "plugin__mobile-header");
			attr(div1, "class", "plugin__title plugin__title--chevron-back");
			attr(div1, "role", "button");
			attr(div1, "tabindex", "0");
			set_style(div2, "background", "rgba(24, 144, 255, 0.15)");
			set_style(div2, "border-left", "4px solid #1890ff");
			set_style(div2, "padding", "10px");
			set_style(div2, "margin-bottom", "12px");
			set_style(div2, "border-radius", "4px");
			set_style(div3, "margin-bottom", "12px");
			set_style(div3, "font-size", "13px");
			set_style(div3, "color", "#ffffff");
			set_style(div3, "background", "#1f1f1f");
			set_style(div3, "padding", "10px");
			set_style(div3, "border-radius", "6px");
			set_style(div3, "border", "1px solid #333");
			set_style(div3, "text-shadow", "0 1px 2px rgba(0,0,0,0.8)");
			button.disabled = /*isLoading*/ ctx[2];
			set_style(button, "width", "100%");
			set_style(button, "padding", "10px");
			set_style(button, "background", "#1890ff");
			set_style(button, "color", "#ffffff");
			set_style(button, "border", "none");
			set_style(button, "border-radius", "6px");
			set_style(button, "font-weight", "bold");
			set_style(button, "cursor", /*isLoading*/ ctx[2] ? 'wait' : 'pointer');
			set_style(button, "opacity", /*isLoading*/ ctx[2] ? 0.72 : 1);
			set_style(button, "text-shadow", "0 1px 2px rgba(0,0,0,0.5)");
			set_style(div4, "padding", "12px");
			set_style(div4, "font-family", "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif");
			set_style(div4, "color", "#ffffff");
			attr(section, "class", "plugin__content svelte-1ke6024");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t1, anchor);
			insert(target, section, anchor);
			append(section, div1);
			append(section, t3);
			append(section, div4);
			append(div4, div2);
			append(div4, t12);
			append(div4, div3);
			append(div3, t13);
			append(div4, t14);
			append(div4, button);
			append(button, t15);
			append(div4, t16);
			if (if_block) if_block.m(div4, null);

			if (!mounted) {
				dispose = [
					listen(div1, "click", /*returnToMenu*/ ctx[5]),
					listen(div1, "keydown", /*keydown_handler*/ ctx[11]),
					listen(button, "click", /*click_handler*/ ctx[12])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*statusText*/ 1) set_data(t13, /*statusText*/ ctx[0]);

			if (dirty[0] & /*isLoading*/ 4 && t15_value !== (t15_value = (/*isLoading*/ ctx[2]
			? '⏳ 正在刷新中央气象台数据…'
			: '📡 刷新中央气象台实时数据') + "")) set_data(t15, t15_value);

			if (dirty[0] & /*isLoading*/ 4) {
				button.disabled = /*isLoading*/ ctx[2];
			}

			if (dirty[0] & /*isLoading*/ 4) {
				set_style(button, "cursor", /*isLoading*/ ctx[2] ? 'wait' : 'pointer');
			}

			if (dirty[0] & /*isLoading*/ 4) {
				set_style(button, "opacity", /*isLoading*/ ctx[2] ? 0.72 : 1);
			}

			if (/*typhoonListInfo*/ ctx[1].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					if_block.m(div4, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t1);
				detach(section);
			}

			if (if_block) if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};
}

const DETAIL_CONCURRENCY = 6;
const RECENT_STOPPED_WITH_ACTIVE = 1;
const RECENT_STOPPED_WITHOUT_ACTIVE = 3;

function handleActivationKeydown(event, action) {
	if (event.key === 'Enter' || event.key === ' ') {
		event.preventDefault();
		action();
	}
}

function isAbortError(error) {
	return error instanceof DOMException
	? error.name === 'AbortError'
	: Boolean(error && typeof error === 'object' && 'name' in error && error.name === 'AbortError');
}

async function mapWithConcurrency(items, concurrency, mapper) {
	const results = new Array(items.length);
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

function mergeTyphoonLists(lists) {
	const merged = new Map();

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

function instance($$self, $$props, $$invalidate) {
	const { title } = config;
	const REQUEST_TIMEOUT_MS = 20 * 1000;
	const REFRESH_TIMEOUT_MS = 30 * 1000;
	const STOPPED_CACHE_MS = 30 * 60 * 1000;
	let statusText = '点击上方按钮发起中央气象台实时联网请求...';
	let typhoonListInfo = [];
	let layerGroup = null;
	let activeRequest = null;
	let requestSequence = 0;
	let isLoading = false;
	let expandedTyphoonId = null;
	const stoppedTyphoonCache = new Map();

	const handleMapClick = () => {
		map.closePopup();
	};

	function returnToMenu() {
		bcast.emit('rqstOpen', 'menu');
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
			map.removeLayer(layerGroup);
			layerGroup = null;
		}
	}

	function cancelActiveRequest() {
		activeRequest?.abort();
		activeRequest = null;
		requestSequence += 1;
		$$invalidate(2, isLoading = false);
	}

	async function fetchText(url, signal) {
		const requestController = new AbortController();
		let timedOut = false;
		const forwardAbort = () => requestController.abort();

		if (signal.aborted) {
			requestController.abort();
		} else {
			signal.addEventListener('abort', forwardAbort, { once: true });
		}

		const timeoutId = setTimeout(
			() => {
				timedOut = true;
				requestController.abort();
			},
			REQUEST_TIMEOUT_MS
		);

		try {
			const response = await fetch(url, { signal: requestController.signal });

			if (!response.ok) {
				throw new Error(`HTTP ${response.status} ${response.statusText}`.trim());
			}

			return await response.text();
		} catch(error) {
			if (timedOut) {
				throw new Error(`请求超时（${REQUEST_TIMEOUT_MS / 1000} 秒）`);
			}

			throw error;
		} finally {
			clearTimeout(timeoutId);
			signal.removeEventListener('abort', forwardAbort);
		}
	}

	const onopen = _params => {
		if (ensureLayerGroup()) {
			void fetchCMATyphoonLive('open');
		}
	};

	const onclose = () => {
		cancelActiveRequest();
		releaseMapResources();
		$$invalidate(1, typhoonListInfo = []);
		$$invalidate(3, expandedTyphoonId = null);
		$$invalidate(0, statusText = '插件已关闭；重新打开后可刷新中央气象台实时数据。');
	};

	function toggleTyphoonPanel(tfId) {
		$$invalidate(3, expandedTyphoonId = expandedTyphoonId === tfId ? null : tfId);
	}

	function restoreSelectionAfterRefresh(previousExpandedId, hadPreviousDisplay) {
		if (hadPreviousDisplay) {
			if (previousExpandedId === null) {
				$$invalidate(3, expandedTyphoonId = null);
				return;
			}

			const stillAvailable = typhoonListInfo.some(item => String(item.id) === String(previousExpandedId));

			if (stillAvailable) {
				$$invalidate(3, expandedTyphoonId = previousExpandedId);
				return;
			}

			$$invalidate(3, expandedTyphoonId = selectDefaultTyphoon(typhoonListInfo)?.id ?? null);
			return;
		}

		const selected = selectDefaultTyphoon(typhoonListInfo);

		if (!selected) {
			$$invalidate(3, expandedTyphoonId = null);
			return;
		}

		$$invalidate(3, expandedTyphoonId = selected.id);
		const latestPoint = selected.historyPoints?.[0];

		if (latestPoint) {
			map.flyTo([latestPoint.lat, latestPoint.lng], 5);
		}
	}

	function focusPoint(pt) {
		map.flyTo([pt.lat, pt.lng], 6);

		if (pt.markerInstance) {
			pt.markerInstance.openPopup();
		}
	}

	function renderTyphoonData(targetLayerGroup, tfId, tfNo, tfNameCn, tfNameEn, rawData, tfStatus = '进行中') {
		if (!window.L || !targetLayerGroup) {
			return null;
		}

		const points = Array.isArray(rawData?.[8]) ? rawData[8] : [];
		const realSegments = [];
		const realPointsList = [];
		const safeNo = escapeHtml(tfNo);
		const safeNameCn = escapeHtml(tfNameCn);
		const safeNameEn = escapeHtml(tfNameEn);

		for (const point of points) {
			if (!Array.isArray(point) || !isValidLatLng(point[5], point[4])) {
				continue;
			}

			const timeStr = typeof point[1] === 'string' && point[1].trim() !== ''
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
				interactive: true
			}).addTo(targetLayerGroup);

			const marker = window.L.circleMarker([lat, lng], {
				radius: 4,
				stroke: false,
				fill: true,
				fillColor: bft.color,
				fillOpacity: 1,
				interactive: true
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
				markerInstance: hitArea
			});
		}

		for (let i = 0; i < realSegments.length - 1; i++) {
			const segColor = realSegments[i].color;
			window.L.polyline([realSegments[i].latlng, realSegments[i + 1].latlng], { color: segColor, weight: 2.5 }).addTo(targetLayerGroup);
		}

		if (shouldRenderForecast(tfStatus) && points.length > 0) {
			const lastPointObj = points[points.length - 1];

			const forecastDict = Array.isArray(lastPointObj) && lastPointObj[11] && typeof lastPointObj[11] === 'object'
			? lastPointObj[11]
			: {};

			const forecastCandidate = forecastDict['BABJ'] || Object.values(forecastDict)[0] || [];

			const babjForecast = Array.isArray(forecastCandidate)
			? forecastCandidate
			: [];

			if (babjForecast.length > 0 && realSegments.length > 0) {
				const lastRealCoord = realSegments[realSegments.length - 1].latlng;
				const forecastLatlngs = [lastRealCoord];

				for (const forecastPoint of babjForecast) {
					if (!Array.isArray(forecastPoint) || !isValidLatLng(forecastPoint[3], forecastPoint[2])) {
						continue;
					}

					const fcHours = toNonNegativeNumber(forecastPoint[0]);

					const baseTimeStr = typeof forecastPoint[1] === 'string'
					? forecastPoint[1]
					: '';

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
					const safeSpeedDisplay = escapeHtml(speedMs === null ? '—' : `${speedMs} m/s`);
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
						interactive: true
					}).addTo(targetLayerGroup);

					const fcMarker = window.L.circleMarker([lat, lng], {
						radius: 4,
						color: '#faad14',
						weight: 1.5,
						fillColor: bft.color,
						fillOpacity: 1,
						interactive: true
					}).addTo(targetLayerGroup);

					fcHitArea.bindPopup(fcPopupHtml, popupOptions);
					fcMarker.bindPopup(fcPopupHtml, popupOptions);
				}

				if (forecastLatlngs.length > 1) {
					window.L.polyline(forecastLatlngs, {
						color: '#faad14',
						weight: 2.5,
						dashArray: '6,6'
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
				historyPoints: reversedReal
			};
		}

		return null;
	}

	async function loadTyphoonLists(years, controller, requestId) {
		const failedYears = [];
		let firstFailure = null;

		const lists = await Promise.all(years.map(async year => {
			const listUrl = `https://typhoon.nmc.cn/weatherservice/typhoon/jsons/list_${year}?callback=cmaLiveList`;

			try {
				const text = await fetchText(listUrl, controller.signal);

				if (controller.signal.aborted || requestId !== requestSequence) {
					return [];
				}

				const data = parseJsonpPayload(text, `${year} 年台风列表`);
				return Array.isArray(data?.typhoonList) ? data.typhoonList : [];
			} catch(error) {
				if (isAbortError(error)) {
					throw error;
				}

				firstFailure ??= error;
				failedYears.push(year);
				console.warn(`获取 ${year} 年台风列表失败`, error);
				return [];
			}
		}));

		if (failedYears.length === years.length) {
			throw firstFailure instanceof Error
			? firstFailure
			: new Error(`全部年度台风列表请求失败（${years.join('、')}）`);
		}

		return {
			items: mergeTyphoonLists(lists),
			failedYears
		};
	}

	async function loadTyphoonDetail(item, status, controller, requestId) {
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

		const viewData = parseJsonpPayload(viewText, `${no} 台风详情`);

		if (!viewData?.typhoon) {
			return null;
		}

		const value = {
			id,
			no,
			nameCn,
			nameEn,
			rawData: viewData.typhoon,
			status,
			latestObservationTime: getLatestObservationTime(viewData.typhoon)
		};

		if (status === '已停编') {
			stoppedTyphoonCache.set(id, { value, cachedAt: Date.now() });
		}

		return value;
	}

	async function fetchCMATyphoonLive(reason = 'manual') {
		if (!ensureLayerGroup()) {
			$$invalidate(0, statusText = '❌ 地图运行环境尚未就绪。');
			return;
		}

		const previousExpandedId = expandedTyphoonId;
		const hadPreviousDisplay = typhoonListInfo.length > 0;
		activeRequest?.abort();
		const controller = new AbortController();
		let refreshTimedOut = false;

		const refreshTimeoutId = setTimeout(
			() => {
				refreshTimedOut = true;
				controller.abort();
			},
			REFRESH_TIMEOUT_MS
		);

		activeRequest = controller;
		const requestId = ++requestSequence;
		$$invalidate(2, isLoading = true);

		$$invalidate(0, statusText = reason === 'manual'
		? '🌐 正在手动刷新中央气象台实时与预报数据；完成前保留当前地图和选择...'
		: '🌐 正在加载中央气象台实时与预报数据...');

		let failedCount = 0;
		let pendingLayerGroup = null;

		try {
			const listYears = getCmaListYears(new Date());
			const { items: typhoonItems, failedYears } = await loadTyphoonLists(listYears, controller, requestId);

			if (controller.signal.aborted || requestId !== requestSequence) {
				return;
			}

			if (typhoonItems.length === 0) {
				$$invalidate(0, statusText = hadPreviousDisplay
				? '⚠️ 中央气象台当前列表为空；已保留上次成功显示。'
				: '⚠️ 中央气象台当前没有可显示的台风数据。');

				return;
			}

			const activeItems = typhoonItems.filter(item => item[7] === 'start');
			const stoppedItems = typhoonItems.filter(item => item[7] === 'stop');
			const ignoredStatusCount = typhoonItems.length - activeItems.length - stoppedItems.length;

			const recentStoppedLimit = activeItems.length > 0
			? RECENT_STOPPED_WITH_ACTIVE
			: RECENT_STOPPED_WITHOUT_ACTIVE;

			$$invalidate(0, statusText = activeItems.length > 0
			? `✅ 台风列表获取成功，正在加载 ${activeItems.length} 个活跃台风，并核对 ${stoppedItems.length} 个停编记录的最后实况时间...`
			: `⚠️ 当前无活跃台风，正在核对 ${stoppedItems.length} 个停编记录并查找最近 ${recentStoppedLimit} 个...`);

			const loadSafely = async (item, itemStatus) => {
				try {
					const loaded = await loadTyphoonDetail(item, itemStatus, controller, requestId);

					if (!loaded) {
						failedCount += 1;
					}

					return loaded;
				} catch(error) {
					if (isAbortError(error)) {
						throw error;
					}

					failedCount += 1;
					console.warn(`获取台风 ${String(item[4] ?? '')} 详情失败`, error);
					return null;
				}
			};

			const [activeResults, stoppedResults] = await Promise.all([
				Promise.all(activeItems.map(item => loadSafely(item, '进行中'))),
				mapWithConcurrency(stoppedItems, DETAIL_CONCURRENCY, item => loadSafely(item, '已停编'))
			]);

			if (controller.signal.aborted || requestId !== requestSequence) {
				return;
			}

			const loadedActive = activeResults.filter(item => item !== null);
			const loadedStopped = stoppedResults.filter(item => item !== null);
			const recentStopped = selectRecentStopped(loadedStopped, recentStoppedLimit);
			const targetData = [...loadedActive, ...recentStopped];

			if (targetData.length === 0) {
				$$invalidate(0, statusText = hadPreviousDisplay
				? '❌ 台风列表已返回，但未能加载任何详情数据；已保留上次成功显示。'
				: '❌ 台风列表已返回，但未能加载任何详情数据。');

				return;
			}

			pendingLayerGroup = window.L.layerGroup();
			const nextTyphoonListInfo = [];

			for (const item of targetData) {
				const stormLayerGroup = window.L.layerGroup();

				try {
					const rendered = renderTyphoonData(stormLayerGroup, item.id, item.no, item.nameCn, item.nameEn, item.rawData, item.status);

					if (rendered) {
						stormLayerGroup.addTo(pendingLayerGroup);
						nextTyphoonListInfo.push(rendered);
					} else {
						stormLayerGroup.clearLayers();
						failedCount += 1;
					}
				} catch(error) {
					stormLayerGroup.clearLayers();
					failedCount += 1;
					console.warn(`绘制台风 ${item.no} 失败`, error);
				}
			}

			if (nextTyphoonListInfo.length === 0) {
				pendingLayerGroup.clearLayers();
				pendingLayerGroup = null;

				$$invalidate(0, statusText = hadPreviousDisplay
				? '❌ 台风详情中没有有效的可绘制实况点；已保留上次成功显示。'
				: '❌ 台风详情中没有有效的可绘制实况点。');

				return;
			}

			const previousLayerGroup = layerGroup;
			pendingLayerGroup.addTo(map);

			try {
				if (previousLayerGroup) {
					map.removeLayer(previousLayerGroup);
				}
			} catch(error) {
				map.removeLayer(pendingLayerGroup);
				pendingLayerGroup.clearLayers();
				pendingLayerGroup = null;
				throw error;
			}

			previousLayerGroup?.clearLayers();
			layerGroup = pendingLayerGroup;
			pendingLayerGroup = null;
			$$invalidate(1, typhoonListInfo = nextTyphoonListInfo);
			restoreSelectionAfterRefresh(previousExpandedId, hadPreviousDisplay);
			const renderedActiveCount = typhoonListInfo.filter(item => item.status === '进行中').length;
			const renderedStoppedCount = typhoonListInfo.filter(item => item.status === '已停编').length;
			const failureSuffix = failedCount > 0 ? `；${failedCount} 个详情未能加载` : '';

			const listFailureSuffix = failedYears.length > 0
			? `；${failedYears.join('、')} 年列表暂未加载成功`
			: '';

			const ignoredStatusSuffix = ignoredStatusCount > 0
			? `；忽略 ${ignoredStatusCount} 条未知状态记录`
			: '';

			const refreshSuffix = `；最后刷新（北京时间）${formatBeijingRefreshTime(new Date())}`;

			if (renderedActiveCount > 0) {
				const stoppedSuffix = renderedStoppedCount > 0
				? `，并保留最近 ${renderedStoppedCount} 个停编台风的历史实况`
				: '';

				$$invalidate(0, statusText = `✅ 已绘制 ${renderedActiveCount} 个活跃台风的实况轨迹与可用预报${stoppedSuffix}${failureSuffix}${listFailureSuffix}${ignoredStatusSuffix}${refreshSuffix}。`);
			} else if (renderedStoppedCount > 0) {
				const activeFailurePrefix = activeItems.length > 0 ? '活跃台风详情暂未加载成功；' : '当前无活跃台风；';
				$$invalidate(0, statusText = `⚠️ ${activeFailurePrefix}已显示最近 ${renderedStoppedCount} 个停编台风的历史实况（不显示预报）${failureSuffix}${listFailureSuffix}${ignoredStatusSuffix}${refreshSuffix}。`);
			} else {
				$$invalidate(0, statusText = hadPreviousDisplay
				? '❌ 台风详情不包含可绘制的实况点；已保留上次成功显示。'
				: '❌ 台风详情不包含可绘制的实况点。');
			}
		} catch(error) {
			if (pendingLayerGroup) {
				if (map.hasLayer(pendingLayerGroup)) {
					map.removeLayer(pendingLayerGroup);
				}

				pendingLayerGroup.clearLayers();
			}

			if (isAbortError(error) && !refreshTimedOut) {
				return;
			}

			console.error('中央气象台实时数据请求失败', error);

			const message = refreshTimedOut
			? `整体刷新超时（${REFRESH_TIMEOUT_MS / 1000} 秒）`
			: error instanceof Error ? error.message : String(error);

			const preserveSuffix = hadPreviousDisplay ? '；已保留上次成功显示' : '';

			if ((/请求超时|刷新超时/).test(message)) {
				$$invalidate(0, statusText = `❌ 中央气象台请求超时：${message}${preserveSuffix}。`);
			} else if ((/返回格式|有效 JSON/).test(message)) {
				$$invalidate(0, statusText = `❌ 数据解析失败：${message}${preserveSuffix}。`);
			} else if ((/^HTTP /).test(message)) {
				$$invalidate(0, statusText = `❌ 中央气象台服务器返回错误：${message}${preserveSuffix}。`);
			} else {
				$$invalidate(0, statusText = `❌ 网络请求失败：${message || '请检查网络连接、浏览器策略或数据源状态'}${preserveSuffix}。`);
			}
		} finally {
			clearTimeout(refreshTimeoutId);

			if (activeRequest === controller) {
				activeRequest = null;
			}

			if (requestId === requestSequence) {
				$$invalidate(2, isLoading = false);
			}
		}
	}

	onMount(() => {
		if (ensureLayerGroup()) {
			map.off('click', handleMapClick);
			map.on('click', handleMapClick);
		}
	});

	onDestroy(() => {
		onclose();
	});

	const keydown_handler = event => handleActivationKeydown(event, returnToMenu);
	const click_handler = () => void fetchCMATyphoonLive('manual');
	const click_handler_1 = item => toggleTyphoonPanel(item.id);
	const click_handler_2 = pt => focusPoint(pt);
	const keydown_handler_1 = (pt, event) => handleActivationKeydown(event, () => focusPoint(pt));

	return [
		statusText,
		typhoonListInfo,
		isLoading,
		expandedTyphoonId,
		title,
		returnToMenu,
		toggleTyphoonPanel,
		focusPoint,
		fetchCMATyphoonLive,
		onopen,
		onclose,
		keydown_handler,
		click_handler,
		click_handler_1,
		click_handler_2,
		keydown_handler_1
	];
}

class Plugin extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { onopen: 9, onclose: 10 }, add_css, [-1, -1]);
	}

	get onopen() {
		return this.$$.ctx[9];
	}

	get onclose() {
		return this.$$.ctx[10];
	}
}


// transformCode: Export statement was modified
export { __pluginConfig, Plugin as default };
//# sourceMappingURL=plugin.js.map

Exit code: 0
Wall time: 0.1 seconds
Total output lines: 4502
Output:
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
  "built": 1786495609652,
  "builtReadable": "2026-08-12T00:46:49.652Z",
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

/** @type {typeof globalThis} */
const globals =
	typeof window !== 'undefined'
		? window
		: typeof globalThis !== 'undefined'
		? globalThis
		: // @ts-ignore Node typings have this
		  global;

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
 * @returns {void} */
function toggle_class(element, name, toggle) {
	// The `!!` is required because an `undefined` flag means flipping the current state.
	element.classList.toggle(name, !!toggle);
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

// keyed each functions:

/** @returns {void} */
function destroy_block(block, lookup) {
	block.d(1);
	lookup.delete(block.key);
}

/** @returns {any[]} */
function update_keyed_each(
	old_blocks,
	dirty,
	get_key,
	dynamic,
	ctx,
	list,
	lookup,
	node,
	destroy,
	create_each_block,
	next,
	get_context
) {
	let o = old_blocks.length;
	let n = list.length;
	let i = o;
	const old_indexes = {};
	while (i--) old_indexes[old_blocks[i].key] = i;
	const new_blocks = [];
	const new_lookup = new Map();
	const deltas = new Map();
	const updates = [];
	i = n;
	while (i--) {
		const child_ctx = get_context(ctx, list, i);
		const key = get_key(child_ctx);
		let block = lookup.get(key);
		if (!block) {
			block = create_each_block(key, child_ctx);
			block.c();
		} else {
			// defer updates until all the DOM shuffling is done
			updates.push(() => block.p(child_ctx, dirty));
		}
		new_lookup.set(key, (new_blocks[i] = block));
		if (key in old_indexes) deltas.set(key, Math.abs(i - old_indexes[key]));
	}
	const will_move = new Set();
	const did_move = new Set();
	/** @returns {void} */
	function insert(block) {
		transition_in(block, 1);
		block.m(node, next);
		lookup.set(block.key, block);
		next = block.first;
		n--;
	}
	while (o && n) {
		const new_block = new_blocks[n - 1];
		const old_block = old_blocks[o - 1];
		const new_key = new_block.key;
		const old_key = old_block.key;
		if (new_block === old_block) {
			// do nothing
			next = new_block.first;
			o--;
			n--;
		} else if (!new_lookup.has(old_key)) {
			// remove old block
			destroy(old_block, lookup);
			o--;
		} else if (!lookup.has(new_key) || will_move.has(new_key)) {
			insert(new_block);
		} else if (did_move.has(old_key)) {
			o--;
		} else if (deltas.get(new_key) > deltas.get(old_key)) {
			did_move.add(new_key);
			insert(new_block);
		} else {
			will_move.add(old_key);
			o--;
		}
	}
	while (o--) {
		const old_block = old_blocks[o];
		if (!new_lookup.has(old_block.key)) destroy(old_block, lookup);
	}
	while (n) insert(new_blocks[n - 1]);
	run_all(updates);
	return new_blocks;
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
function to…24381 tokens truncated…风力等级</b>：<span style="background:${bft.color}; color:${bft.textColor}; padding:2px 6px; border-radius:3px; font-weight:bold;">${escapeHtml(bft.text)} <span translate="no">(${safeSpeedDisplay})</span></span><br/>
                    <b>📉 中心气压</b>：<span translate="no">${safePressure} hPa</span><br/>
                    <b>🧭 坐标</b>：${safeLat}°N, ${safeLng}°E
                </div>
            `;

			const popupOptions = {
				closeOnClick: true,
				autoClose: true,
				autoPan: renderMode !== 'history'
			};

			const hitArea = renderMode === 'live'
			? window.L.circleMarker([lat, lng], {
					radius: 18,
					stroke: false,
					fill: true,
					fillColor: '#ffffff',
					fillOpacity: 0.001,
					interactive: true
				}).addTo(targetLayerGroup)
			: null;

			const marker = window.L.circleMarker([lat, lng], {
				radius: 4,
				stroke: false,
				fill: true,
				fillColor: bft.color,
				fillOpacity: 1,
				interactive: true
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
				markerInstance: hitArea ?? marker
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
					const safeSpeedDisplay = escapeHtml(speedMs === null ? '—' : `${speedMs}m/s`);
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
				const text = await fetchText(listUrl, controller.signal, 'no-store');

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
		const viewUrl = `https://typhoon.nmc.cn/weatherservice/typhoon/jsons/view_${encodeURIComponent(id)}?callback=cmaLiveView`;
		const viewText = await fetchText(viewUrl, controller.signal, 'no-store');

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

		return value;
	}

	async function fetchCMATyphoonLive(reason = 'manual') {
		if (!ensureLayerGroup()) {
			$$invalidate(1, statusText = '❌ 地图运行环境尚未就绪。');
			return;
		}

		const previousExpandedId = expandedTyphoonId;
		const hadPreviousDisplay = typhoonListInfo.length > 0;
		const previousTyphoonById = new Map(typhoonListInfo.map(item => [String(item.id), item]));
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
		$$invalidate(3, isLoading = true);

		$$invalidate(1, statusText = reason === 'manual'
		? '🌐 正在手动刷新中央气象台实时与预报数据；完成前保留当前地图和选择...'
		: '🌐 正在加载中央气象台实时与预报数据...');

		let detailFailureCount = 0;
		let renderFailureCount = 0;
		let staleFallbackCount = 0;
		let pendingLayerGroup = null;

		try {
			const listYears = getCmaListYears(new Date());
			const { items: typhoonItems, failedYears } = await loadTyphoonLists(listYears, controller, requestId);

			if (controller.signal.aborted || requestId !== requestSequence) {
				return;
			}

			if (typhoonItems.length === 0) {
				$$invalidate(1, statusText = hadPreviousDisplay
				? '⚠️ 中央气象台当前列表为空；已保留上次成功显示。'
				: '⚠️ 中央气象台当前没有可显示的台风数据。');

				return;
			}

			const activeItems = typhoonItems.filter(item => item[7] === 'start');
			const stoppedItems = typhoonItems.filter(item => item[7] === 'stop');
			const ignoredStatusCount = typhoonItems.length - activeItems.length - stoppedItems.length;

			if (activeItems.length === 0) {
				if (failedYears.length > 0 && hadPreviousDisplay) {
					$$invalidate(1, statusText = `⚠️ 已加载的年度列表暂未发现活跃台风，但 ${failedYears.join('、')} 年列表请求失败；为避免误删，已保留上次成功显示。`);
					return;
				}

				pendingLayerGroup = window.L.layerGroup();
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

				clearTrackedLivePathLayers();
				previousLayerGroup?.clearLayers();
				layerGroup = pendingLayerGroup;
				pendingLayerGroup = null;
				$$invalidate(2, typhoonListInfo = []);
				$$invalidate(4, expandedTyphoonId = null);
				syncActiveHistoricalPaths([]);

				const listFailureSuffix = failedYears.length > 0
				? `；${failedYears.join('、')} 年列表暂未加载成功`
				: '';

				const ignoredStatusSuffix = ignoredStatusCount > 0
				? `；忽略 ${ignoredStatusCount} 条未知状态记录`
				: '';

				$$invalidate(1, statusText = `⚠️ 当前无活跃台风；已停编台风可在下方“近一年台风”中查看${listFailureSuffix}${ignoredStatusSuffix}；最后刷新（北京时间）${formatBeijingRefreshTime(new Date())}。`);
				refreshHistoryAfterManualLiveUpdate(reason);
				return;
			}

			$$invalidate(1, statusText = `✅ 台风列表获取成功，正在加载 ${activeItems.length} 个活跃台风；${stoppedItems.length} 个停编记录请在下方“近一年台风”中查看...`);

			const loadSafely = async (item, itemStatus) => {
				try {
					const loaded = await loadTyphoonDetail(item, itemStatus, controller, requestId);

					if (!loaded) {
						detailFailureCount += 1;
					}

					return loaded;
				} catch(error) {
					if (isAbortError(error)) {
						throw error;
					}

					detailFailureCount += 1;
					console.warn(`获取台风 ${String(item[4] ?? '')} 详情失败`, error);
					return null;
				}
			};

			const activeResults = await Promise.all(activeItems.map(item => loadSafely(item, '进行中')));

			if (controller.signal.aborted || requestId !== requestSequence) {
				return;
			}

			const targetData = [];

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
					usingPreviousData: true
				});
			}

			if (targetData.length === 0) {
				$$invalidate(1, statusText = hadPreviousDisplay
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
							pathVisible
						});
					} else {
						stormLayerGroup.clearLayers();
						renderFailureCount += 1;
					}
				} catch(error) {
					stormLayerGroup.clearLayers();
					renderFailureCount += 1;
					console.warn(`绘制台风 ${item.no} 失败`, error);
				}
			}

			if (nextTyphoonListInfo.length === 0) {
				pendingLayerGroup.clearLayers();
				pendingLayerGroup = null;

				$$invalidate(1, statusText = hadPreviousDisplay
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

			clearTrackedLivePathLayers();
			previousLayerGroup?.clearLayers();
			layerGroup = pendingLayerGroup;
			pendingLayerGroup = null;
			$$invalidate(2, typhoonListInfo = nextTyphoonListInfo);
			syncActiveHistoricalPaths(typhoonListInfo);
			restoreSelectionAfterRefresh(previousExpandedId, hadPreviousDisplay);
			refreshHistoryAfterManualLiveUpdate(reason);
			const renderedActiveCount = typhoonListInfo.filter(item => item.status === '进行中').length;
			const unavailableDetailCount = Math.max(0, detailFailureCount - staleFallbackCount);

			const staleFallbackSuffix = staleFallbackCount > 0
			? `；${staleFallbackCount} 个活跃台风暂用上次成功数据`
			: '';

			const failureParts = [];

			if (unavailableDetailCount > 0) {
				failureParts.push(`${unavailableDetailCount} 个详情未能加载且没有旧数据`);
			}

			if (renderFailureCount > 0) {
				failureParts.push(`${renderFailureCount} 个台风未能绘制`);
			}

			const failureSuffix = failureParts.length > 0
			? `；${failureParts.join('；')}`
			: '';

			const listFailureSuffix = failedYears.length > 0
			? `；${failedYears.join('、')} 年列表暂未加载成功`
			: '';

			const ignoredStatusSuffix = ignoredStatusCount > 0
			? `；忽略 ${ignoredStatusCount} 条未知状态记录`
			: '';

			const refreshSuffix = `；最后刷新（北京时间）${formatBeijingRefreshTime(new Date())}`;

			const stoppedSuffix = stoppedItems.length > 0
			? `；${stoppedItems.length} 个停编台风可在下方“近一年台风”中查看`
			: '';

			$$invalidate(1, statusText = `✅ 已绘制 ${renderedActiveCount} 个活跃台风的实况轨迹与可用预报${stoppedSuffix}${staleFallbackSuffix}${failureSuffix}${listFailureSuffix}${ignoredStatusSuffix}${refreshSuffix}。`);
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
				$$invalidate(1, statusText = `❌ 中央气象台请求超时：${message}${preserveSuffix}。`);
			} else if ((/返回格式|有效 JSON/).test(message)) {
				$$invalidate(1, statusText = `❌ 数据解析失败：${message}${preserveSuffix}。`);
			} else if ((/^HTTP /).test(message)) {
				$$invalidate(1, statusText = `❌ 中央气象台服务器返回错误：${message}${preserveSuffix}。`);
			} else {
				$$invalidate(1, statusText = `❌ 网络请求失败：${message || '请检查网络连接、浏览器策略或数据源状态'}${preserveSuffix}。`);
			}
		} finally {
			clearTimeout(refreshTimeoutId);

			if (activeRequest === controller) {
				activeRequest = null;
			}

			if (requestId === requestSequence) {
				$$invalidate(3, isLoading = false);
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
	const click_handler_2 = (item, pt) => focusLivePoint(item, pt);
	const keydown_handler_1 = (item, pt, event) => handleActivationKeydown(event, () => focusLivePoint(item, pt));
	const click_handler_3 = () => void toggleHistoryPanel();
	const click_handler_4 = () => void loadRecentHistoricalTyphoons();
	const change_handler = (selectedPath, event) => handleHistoricalPathToggle(selectedPath.item.id, event);
	const click_handler_5 = selectedPath => removeHistoricalPath(selectedPath.item.id);
	const click_handler_6 = selectedPath => toggleHistoricalWindList(selectedPath.item.id);
	const click_handler_7 = (selectedPath, pt) => focusHistoricalPoint(selectedPath.item.id, pt);
	const click_handler_8 = historyItem => void showHistoricalTyphoon(historyItem);

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*historicalPaths*/ 1) {
			$$invalidate(11, visibleStoppedPathCount = historicalPaths.filter(path => path.source === 'history' && path.visible).length);
		}
	};

	return [
		historicalPaths,
		statusText,
		typhoonListInfo,
		isLoading,
		expandedTyphoonId,
		historyPanelOpen,
		historyItems,
		historyStatusText,
		historyListLoading,
		historyLoadFailed,
		historyDetailLoadingId,
		visibleStoppedPathCount,
		title,
		returnToMenu,
		toggleTyphoonPanel,
		focusLivePoint,
		focusHistoricalPoint,
		toggleHistoryPanel,
		loadRecentHistoricalTyphoons,
		isHistoricalPathSelected,
		canShowHistoricalPath,
		handleHistoricalPathToggle,
		removeHistoricalPath,
		toggleHistoricalWindList,
		getHistoricalResultAction,
		showHistoricalTyphoon,
		fetchCMATyphoonLive,
		onopen,
		onclose,
		keydown_handler,
		click_handler,
		click_handler_1,
		click_handler_2,
		keydown_handler_1,
		click_handler_3,
		click_handler_4,
		change_handler,
		click_handler_5,
		click_handler_6,
		click_handler_7,
		click_handler_8
	];
}

class Plugin extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { onopen: 27, onclose: 28 }, add_css, [-1, -1, -1]);
	}

	get onopen() {
		return this.$$.ctx[27];
	}

	get onclose() {
		return this.$$.ctx[28];
	}
}


// transformCode: Export statement was modified
export { __pluginConfig, Plugin as default };
//# sourceMappingURL=plugin.js.map


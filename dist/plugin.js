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
  "built": 1786538886409,
  "builtReadable": "2026-08-12T12:48:06.409Z",
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
function normalizeHistoricalTyphoonList(rawList) {
    if (!Array.isArray(rawList)) {
        return [];
    }
    const byId = new Map();
    for (const rawItem of rawList){
        if (!Array.isArray(rawItem) || rawItem[0] === null || rawItem[0] === undefined) {
            continue;
        }
        const id = String(rawItem[0]).trim();
        if (!id) {
            continue;
        }
        const rawStatus = rawItem[7];
        const item = {
            id,
            no: String(rawItem[4] ?? '').trim(),
            nameEn: String(rawItem[1] ?? '').trim(),
            nameCn: String(rawItem[2] ?? '').trim(),
            sourceStatus: rawStatus === 'start' ? 'start' : rawStatus === 'stop' ? 'stop' : 'unknown'
        };
        const existing = byId.get(id);
        if (!existing || item.sourceStatus === 'start') {
            byId.set(id, item);
        }
    }
    return [
        ...byId.values()
    ].sort((left, right)=>{
        const leftNo = Number(left.no);
        const rightNo = Number(right.no);
        if (Number.isFinite(leftNo) && Number.isFinite(rightNo) && leftNo !== rightNo) {
            return rightNo - leftNo;
        }
        return right.no.localeCompare(left.no, undefined, {
            numeric: true,
            sensitivity: 'base'
        });
    });
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
    const second = value.length === 14 ? Number.parseInt(value.substring(12, 14), 10) : 0;
    if (![
        year,
        month,
        day,
        hour,
        minute,
        second
    ].every(Number.isFinite)) {
        return null;
    }
    const result = new Date(Date.UTC(year, month, day, hour, minute, second));
    if (result.getUTCFullYear() !== year || result.getUTCMonth() !== month || result.getUTCDate() !== day || result.getUTCHours() !== hour || result.getUTCMinutes() !== minute || result.getUTCSeconds() !== second) {
        return null;
    }
    return result;
}
function getBeijingOneYearCutoff(now) {
    if (!Number.isFinite(now.getTime())) {
        return null;
    }
    const beijingNow = new Date(now.getTime() + 8 * 3600 * 1000);
    const targetYear = beijingNow.getUTCFullYear() - 1;
    const month = beijingNow.getUTCMonth();
    const maximumDay = new Date(Date.UTC(targetYear, month + 1, 0)).getUTCDate();
    const day = Math.min(beijingNow.getUTCDate(), maximumDay);
    const beijingCutoffAsUtc = Date.UTC(targetYear, month, day, beijingNow.getUTCHours(), beijingNow.getUTCMinutes(), 0, 0);
    return new Date(beijingCutoffAsUtc - 8 * 3600 * 1000);
}
function getFirstObservationTime(rawData) {
    if (!Array.isArray(rawData)) {
        return '';
    }
    const points = rawData[8];
    if (!Array.isArray(points)) {
        return '';
    }
    let earliestValue = '';
    let earliestTime = Number.POSITIVE_INFINITY;
    for (const point of points){
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
function selectTyphoonsGeneratedWithinOneYear(items, now) {
    const cutoff = getBeijingOneYearCutoff(now);
    if (!cutoff) {
        return [];
    }
    const nowTime = now.getTime();
    const cutoffTime = cutoff.getTime();
    return items.filter((item)=>{
        if (typeof item.generationTime !== 'string') {
            return false;
        }
        const generationTime = parseSourceTime(item.generationTime)?.getTime();
        return generationTime !== undefined && generationTime >= cutoffTime && generationTime <= nowTime;
    }).sort((left, right)=>String(right.generationTime).localeCompare(String(left.generationTime)));
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

const { Map: Map_1 } = globals;

function add_css(target) {
	append_styles(target, "svelte-9z60az", ".plugin__content.svelte-9z60az.svelte-9z60az{color:#fff}.history-query.svelte-9z60az.svelte-9z60az{margin-top:14px;padding-top:12px;border-top:1px solid #333}.history-query__toggle.svelte-9z60az.svelte-9z60az{width:100%;min-height:42px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 2px;border:0;background:transparent;color:#d9d9d9;font:inherit;font-size:14px;font-weight:700;text-align:left;cursor:pointer}.history-query__chevron.svelte-9z60az.svelte-9z60az{width:14px;flex:0 0 auto;color:#8c8c8c;font-size:11px;text-align:center}.history-query__toggle-meta.svelte-9z60az.svelte-9z60az{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px}.history-query__path-state.svelte-9z60az.svelte-9z60az{color:#8c8c8c;font-size:11px;font-weight:500}.history-query__path-state--visible.svelte-9z60az.svelte-9z60az{color:#69c0ff}.history-query__body.svelte-9z60az.svelte-9z60az{padding:10px 0 2px;border-top:1px solid #2d2d2d}.history-query__hint.svelte-9z60az.svelte-9z60az{margin:0 0 10px;color:#a6a6a6;font-size:12px;line-height:1.5}.history-query__status-row.svelte-9z60az.svelte-9z60az{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.history-query__status.svelte-9z60az.svelte-9z60az{min-width:0;color:#bfbfbf;font-size:12px;line-height:1.5}.history-query__retry-action.svelte-9z60az.svelte-9z60az{flex:0 0 auto;min-height:28px;padding:0 8px;border:1px solid #1890ff;border-radius:4px;background:transparent;color:#69c0ff;font:inherit;font-size:12px;font-weight:700;cursor:pointer}.history-query__retry-action.svelte-9z60az.svelte-9z60az:hover{background:rgba(24, 144, 255, 0.1)}.history-query__selected-path.svelte-9z60az.svelte-9z60az{margin-top:10px}.history-query__selected.svelte-9z60az.svelte-9z60az{padding:9px 0;display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid #333;border-bottom:1px solid #333}.history-query__selected-name.svelte-9z60az.svelte-9z60az{min-width:0;display:flex;flex-direction:column;gap:2px;color:#8c8c8c;font-size:11px}.history-query__selected-name.svelte-9z60az strong.svelte-9z60az{overflow:hidden;color:#69c0ff;font-size:13px;text-overflow:ellipsis;white-space:nowrap}.history-query__selected-actions.svelte-9z60az.svelte-9z60az{flex:0 0 auto;display:inline-flex;align-items:center;gap:9px}.history-query__switch.svelte-9z60az.svelte-9z60az{flex:0 0 auto;display:inline-flex;align-items:center;gap:6px;color:#d9d9d9;font-size:12px;cursor:pointer}.history-query__switch.svelte-9z60az input.svelte-9z60az{width:17px;height:17px;margin:0;accent-color:#1890ff;cursor:pointer}.history-query__remove-action.svelte-9z60az.svelte-9z60az{min-height:28px;padding:0 8px;border:1px solid #595959;border-radius:4px;background:transparent;color:#bfbfbf;font:inherit;font-size:11px;font-weight:600;cursor:pointer;transition:border-color 0.16s ease, color 0.16s ease, background 0.16s ease}.history-query__remove-action.svelte-9z60az.svelte-9z60az:hover{border-color:#ff7875;background:rgba(255, 77, 79, 0.08);color:#ff7875}.history-wind-list.svelte-9z60az.svelte-9z60az{margin-top:8px;padding-bottom:10px;border-bottom:1px solid #333}.history-wind-list__toggle.svelte-9z60az.svelte-9z60az{box-sizing:border-box;width:100%;min-height:38px;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 2px;border:0;background:transparent;color:#d9d9d9;font:inherit;font-size:12px;font-weight:700;text-align:left;cursor:pointer}.history-wind-list__toggle-meta.svelte-9z60az.svelte-9z60az{flex:0 0 auto;display:inline-flex;align-items:center;gap:7px;color:#8c8c8c;font-size:11px;font-weight:500}.history-wind-list__hint.svelte-9z60az.svelte-9z60az{margin:0 2px 7px;color:#8c8c8c;font-size:11px;line-height:1.45}.history-wind-list__points.svelte-9z60az.svelte-9z60az{max-height:520px;overflow-y:auto;padding-right:4px}.history-wind-list__point.svelte-9z60az.svelte-9z60az{box-sizing:border-box;width:100%;min-height:58px;display:grid;grid-template-columns:64px 48px minmax(108px, 126px);align-items:center;justify-content:space-between;column-gap:8px;margin-bottom:6px;padding:8px 12px;border:1px solid #383838;border-radius:6px;background:#262626;color:#fff;font:inherit;font-size:13px;text-align:left;cursor:pointer;transition:background 0.16s ease, border-color 0.16s ease}.history-wind-list__point.svelte-9z60az.svelte-9z60az:hover{background:#2d2d2d;border-color:#4a4a4a}.history-wind-list__point--latest.svelte-9z60az.svelte-9z60az{border:1.5px solid #1890ff;background:#132738;box-shadow:0 0 8px rgba(24, 144, 255, 0.35)}.history-wind-list__time.svelte-9z60az.svelte-9z60az,.history-wind-list__pressure.svelte-9z60az.svelte-9z60az{min-width:0;display:flex;flex-direction:column;align-items:flex-start;line-height:1.25;font-variant-numeric:tabular-nums}.history-wind-list__time.svelte-9z60az span.svelte-9z60az,.history-wind-list__pressure.svelte-9z60az span.svelte-9z60az{white-space:nowrap}.history-wind-list__point--latest.svelte-9z60az .history-wind-list__time.svelte-9z60az{color:#40a9ff;font-weight:700}.history-wind-list__pressure.svelte-9z60az.svelte-9z60az{color:#aaa;font-size:12px}.history-wind-list__level.svelte-9z60az.svelte-9z60az{box-sizing:border-box;width:100%;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4px 6px;border-radius:6px;font-size:13px;font-weight:700;line-height:1.2;text-align:center}.history-wind-list__level.svelte-9z60az>span.svelte-9z60az{white-space:nowrap}.history-wind-list__speed.svelte-9z60az.svelte-9z60az{margin-top:2px;font-size:12px;opacity:0.95}.history-wind-list__qualifier.svelte-9z60az.svelte-9z60az{margin-left:4px;padding:0 3px;border:1px solid currentColor;border-radius:3px;font-size:10px;opacity:0.9}.history-query__result-meta.svelte-9z60az.svelte-9z60az{margin:7px 0 5px;color:#737373;font-size:11px}.history-query__results.svelte-9z60az.svelte-9z60az{max-height:280px;overflow-y:auto;border-top:1px solid #333}.history-query__result.svelte-9z60az.svelte-9z60az{box-sizing:border-box;width:100%;min-height:48px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 4px;border:0;border-bottom:1px solid #2d2d2d;background:transparent;color:#fff;font:inherit;text-align:left;cursor:pointer;transition:background 0.16s ease, opacity 0.16s ease}.history-query__result.svelte-9z60az.svelte-9z60az:hover:not(:disabled),.history-query__result--selected.svelte-9z60az.svelte-9z60az{background:rgba(24, 144, 255, 0.1)}.history-query__result.svelte-9z60az.svelte-9z60az:disabled{cursor:not-allowed;opacity:0.62}.history-query__result-name.svelte-9z60az.svelte-9z60az{min-width:0;display:flex;flex-direction:column;gap:2px}.history-query__result-name.svelte-9z60az strong.svelte-9z60az,.history-query__result-name.svelte-9z60az span.svelte-9z60az{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.history-query__result-name.svelte-9z60az strong.svelte-9z60az{color:#f0f0f0;font-size:13px}.history-query__result-name.svelte-9z60az span.svelte-9z60az{color:#8c8c8c;font-size:11px}.history-query__result-action.svelte-9z60az.svelte-9z60az{flex:0 0 auto;color:#69c0ff;font-size:12px;font-weight:600}.history-query__toggle.svelte-9z60az.svelte-9z60az:focus-visible,.history-query__retry-action.svelte-9z60az.svelte-9z60az:focus-visible,.history-query__remove-action.svelte-9z60az.svelte-9z60az:focus-visible,.history-query__result.svelte-9z60az.svelte-9z60az:focus-visible,.history-wind-list__toggle.svelte-9z60az.svelte-9z60az:focus-visible,.history-wind-list__point.svelte-9z60az.svelte-9z60az:focus-visible{outline:2px solid #69c0ff;outline-offset:2px}@media(max-width: 390px){.history-query__selected.svelte-9z60az.svelte-9z60az{align-items:flex-start;gap:8px}.history-query__selected-actions.svelte-9z60az.svelte-9z60az{gap:7px}.history-wind-list__point.svelte-9z60az.svelte-9z60az{grid-template-columns:56px 44px minmax(0, 1fr);column-gap:6px;padding:8px}}");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[69] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[72] = list[i];
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[75] = list[i];
	child_ctx[77] = i;
	return child_ctx;
}

function get_each_context_3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[78] = list[i];
	return child_ctx;
}

function get_each_context_4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[75] = list[i];
	child_ctx[77] = i;
	return child_ctx;
}

// (52:8) {#if typhoonListInfo.length > 0}
function create_if_block_8(ctx) {
	let div;
	let h4;
	let t1;
	let each_value_3 = ensure_array_like(/*typhoonListInfo*/ ctx[1]);
	let each_blocks = [];

	for (let i = 0; i < each_value_3.length; i += 1) {
		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
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
			if (dirty[0] & /*typhoonListInfo, focusLivePoint, expandedTyphoonId, toggleTyphoonPanel*/ 24586) {
				each_value_3 = ensure_array_like(/*typhoonListInfo*/ ctx[1]);
				let i;

				for (i = 0; i < each_value_3.length; i += 1) {
					const child_ctx = get_each_context_3(ctx, each_value_3, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_3(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_3.length;
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
function create_if_block_9(ctx) {
	let div2;
	let div0;
	let t1;
	let div1;
	let each_value_4 = ensure_array_like(/*item*/ ctx[78].historyPoints);
	let each_blocks = [];

	for (let i = 0; i < each_value_4.length; i += 1) {
		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
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
			if (dirty[0] & /*focusLivePoint, typhoonListInfo*/ 16386) {
				each_value_4 = ensure_array_like(/*item*/ ctx[78].historyPoints);
				let i;

				for (i = 0; i < each_value_4.length; i += 1) {
					const child_ctx = get_each_context_4(ctx, each_value_4, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_4(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div1, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_4.length;
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

// (170:72) {#if pt.bft.qualifier}
function create_if_block_10(ctx) {
	let span;
	let t_value = /*pt*/ ctx[75].bft.qualifier + "";
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
			if (dirty[0] & /*typhoonListInfo*/ 2 && t_value !== (t_value = /*pt*/ ctx[75].bft.qualifier + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (105:36) {#each item.historyPoints as pt, idx}
function create_each_block_4(ctx) {
	let div3;
	let div0;
	let span0;
	let t0_value = /*pt*/ ctx[75].displayDate + "";
	let t0;
	let t1;
	let span1;
	let t2_value = /*pt*/ ctx[75].displayTime + "";
	let t2;
	let t3;
	let div1;
	let span2;
	let t4_value = /*pt*/ ctx[75].pressure + "";
	let t4;
	let t5;
	let span3;
	let t7;
	let div2;
	let span4;
	let t8_value = /*pt*/ ctx[75].bft.text + "";
	let t8;
	let t9;
	let span5;
	let t10;
	let t11_value = /*pt*/ ctx[75].speedDisplay + "";
	let t11;
	let t12;
	let t13;
	let mounted;
	let dispose;
	let if_block = /*pt*/ ctx[75].bft.qualifier && create_if_block_10(ctx);

	function click_handler_2() {
		return /*click_handler_2*/ ctx[28](/*item*/ ctx[78], /*pt*/ ctx[75]);
	}

	function keydown_handler_1(...args) {
		return /*keydown_handler_1*/ ctx[29](/*item*/ ctx[78], /*pt*/ ctx[75], ...args);
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
			set_style(span0, "color", /*idx*/ ctx[77] === 0 ? '#40a9ff' : '#ffffff');
			set_style(span0, "font-weight", /*idx*/ ctx[77] === 0 ? 'bold' : 'normal');
			set_style(span0, "white-space", "nowrap");
			set_style(span1, "color", /*idx*/ ctx[77] === 0 ? '#40a9ff' : '#ffffff');
			set_style(span1, "font-weight", /*idx*/ ctx[77] === 0 ? 'bold' : 'normal');
			set_style(span1, "white-space", "nowrap");
			set_style(div0, "min-width", "0");
			set_style(div0, "display", "flex");
			set_style(div0, "flex-direction", "column");
			set_style(div0, "align-items", "flex-start");
			set_style(div0, "line-height", "1.25");
			set_style(div0, "font-variant-numeric", "tabular-nums");
			set_style(span2, "white-space", "nowrap");
			attr(span3, "translate", "no");
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
			attr(span5, "translate", "no");
			set_style(span5, "font-size", "12px");
			set_style(span5, "line-height", "1.2");
			set_style(span5, "opacity", "0.95");
			set_style(span5, "margin-top", "2px");
			set_style(span5, "white-space", "nowrap");
			set_style(div2, "box-sizing", "border-box");
			set_style(div2, "width", "100%");
			set_style(div2, "min-width", "0");
			set_style(div2, "background", /*pt*/ ctx[75].bft.color);
			set_style(div2, "color", /*pt*/ ctx[75].bft.textColor);
			set_style(div2, "padding", "4px 6px");
			set_style(div2, "border-radius", "6px");
			set_style(div2, "font-weight", "bold");

			set_style(div2, "text-shadow", /*pt*/ ctx[75].bft.textColor === '#ffffff'
			? '0 1px 2px rgba(0,0,0,0.8)'
			: 'none');

			set_style(div2, "text-align", "center");
			set_style(div2, "display", "flex");
			set_style(div2, "flex-direction", "column");
			set_style(div2, "align-items", "center");
			set_style(div2, "justify-content", "center");
			attr(div3, "role", "button");
			attr(div3, "tabindex", "0");
			set_style(div3, "background", /*idx*/ ctx[77] === 0 ? '#132738' : '#262626');
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

			set_style(div3, "border", /*idx*/ ctx[77] === 0
			? '1.5px solid #1890ff'
			: '1px solid #383838');

			set_style(div3, "box-shadow", /*idx*/ ctx[77] === 0
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
			if (dirty[0] & /*typhoonListInfo*/ 2 && t0_value !== (t0_value = /*pt*/ ctx[75].displayDate + "")) set_data(t0, t0_value);
			if (dirty[0] & /*typhoonListInfo*/ 2 && t2_value !== (t2_value = /*pt*/ ctx[75].displayTime + "")) set_data(t2, t2_value);
			if (dirty[0] & /*typhoonListInfo*/ 2 && t4_value !== (t4_value = /*pt*/ ctx[75].pressure + "")) set_data(t4, t4_value);
			if (dirty[0] & /*typhoonListInfo*/ 2 && t8_value !== (t8_value = /*pt*/ ctx[75].bft.text + "")) set_data(t8, t8_value);
			if (dirty[0] & /*typhoonListInfo*/ 2 && t11_value !== (t11_value = /*pt*/ ctx[75].speedDisplay + "")) set_data(t11, t11_value);

			if (/*pt*/ ctx[75].bft.qualifier) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_10(ctx);
					if_block.c();
					if_block.m(span5, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty[0] & /*typhoonListInfo*/ 2) {
				set_style(div2, "background", /*pt*/ ctx[75].bft.color);
			}

			if (dirty[0] & /*typhoonListInfo*/ 2) {
				set_style(div2, "color", /*pt*/ ctx[75].bft.textColor);
			}

			if (dirty[0] & /*typhoonListInfo*/ 2) {
				set_style(div2, "text-shadow", /*pt*/ ctx[75].bft.textColor === '#ffffff'
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
function create_each_block_3(ctx) {
	let div;
	let button;
	let strong;
	let t0;
	let t1_value = /*item*/ ctx[78].no + "";
	let t1;
	let t2;
	let t3_value = /*item*/ ctx[78].nameCn + "";
	let t3;
	let t4;
	let t5_value = /*item*/ ctx[78].nameEn + "";
	let t5;
	let t6;
	let t7;
	let span2;
	let span0;
	let t8;
	let t9_value = /*item*/ ctx[78].status + "";
	let t9;
	let t10;
	let span1;

	let t11_value = (/*expandedTyphoonId*/ ctx[3] === /*item*/ ctx[78].id
	? '▼'
	: '▶') + "";

	let t11;
	let button_aria_expanded_value;
	let t12;
	let t13;
	let mounted;
	let dispose;

	function click_handler_1() {
		return /*click_handler_1*/ ctx[27](/*item*/ ctx[78]);
	}

	let if_block = /*expandedTyphoonId*/ ctx[3] === /*item*/ ctx[78].id && create_if_block_9(ctx);

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

			set_style(span0, "background", /*item*/ ctx[78].status === '进行中'
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
			attr(button, "aria-expanded", button_aria_expanded_value = /*expandedTyphoonId*/ ctx[3] === /*item*/ ctx[78].id);
			set_style(button, "width", "100%");
			set_style(button, "display", "flex");
			set_style(button, "justify-content", "space-between");
			set_style(button, "align-items", "center");
			set_style(button, "gap", "8px");

			set_style(button, "padding", "0 0 " + (/*expandedTyphoonId*/ ctx[3] === /*item*/ ctx[78].id
			? '6px'
			: '0'));

			set_style(button, "margin", "0 0 " + (/*expandedTyphoonId*/ ctx[3] === /*item*/ ctx[78].id
			? '8px'
			: '0'));

			set_style(button, "border", "none");

			set_style(button, "border-bottom", /*expandedTyphoonId*/ ctx[3] === /*item*/ ctx[78].id
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
			if (dirty[0] & /*typhoonListInfo*/ 2 && t1_value !== (t1_value = /*item*/ ctx[78].no + "")) set_data(t1, t1_value);
			if (dirty[0] & /*typhoonListInfo*/ 2 && t3_value !== (t3_value = /*item*/ ctx[78].nameCn + "")) set_data(t3, t3_value);
			if (dirty[0] & /*typhoonListInfo*/ 2 && t5_value !== (t5_value = /*item*/ ctx[78].nameEn + "")) set_data(t5, t5_value);
			if (dirty[0] & /*typhoonListInfo*/ 2 && t9_value !== (t9_value = /*item*/ ctx[78].status + "")) set_data(t9, t9_value);

			if (dirty[0] & /*typhoonListInfo*/ 2) {
				set_style(span0, "background", /*item*/ ctx[78].status === '进行中'
				? '#275017'
				: '#434343');
			}

			if (dirty[0] & /*expandedTyphoonId, typhoonListInfo*/ 10 && t11_value !== (t11_value = (/*expandedTyphoonId*/ ctx[3] === /*item*/ ctx[78].id
			? '▼'
			: '▶') + "")) set_data(t11, t11_value);

			if (dirty[0] & /*expandedTyphoonId, typhoonListInfo*/ 10 && button_aria_expanded_value !== (button_aria_expanded_value = /*expandedTyphoonId*/ ctx[3] === /*item*/ ctx[78].id)) {
				attr(button, "aria-expanded", button_aria_expanded_value);
			}

			if (dirty[0] & /*expandedTyphoonId, typhoonListInfo*/ 10) {
				set_style(button, "padding", "0 0 " + (/*expandedTyphoonId*/ ctx[3] === /*item*/ ctx[78].id
				? '6px'
				: '0'));
			}

			if (dirty[0] & /*expandedTyphoonId, typhoonListInfo*/ 10) {
				set_style(button, "margin", "0 0 " + (/*expandedTyphoonId*/ ctx[3] === /*item*/ ctx[78].id
				? '8px'
				: '0'));
			}

			if (dirty[0] & /*expandedTyphoonId, typhoonListInfo*/ 10) {
				set_style(button, "border-bottom", /*expandedTyphoonId*/ ctx[3] === /*item*/ ctx[78].id
				? '1px solid #333'
				: 'none');
			}

			if (/*expandedTyphoonId*/ ctx[3] === /*item*/ ctx[78].id) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_9(ctx);
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

// (211:12) {#if historyPanelOpen}
function create_if_block(ctx) {
	let div2;
	let p;
	let t1;
	let div1;
	let div0;
	let t2;
	let t3;
	let t4;
	let each_blocks = [];
	let each_1_lookup = new Map_1();
	let t5;
	let if_block0 = /*historyLoadFailed*/ ctx[8] && !/*historyListLoading*/ ctx[7] && create_if_block_7(ctx);
	let each_value_1 = ensure_array_like(/*historicalPaths*/ ctx[10]);
	const get_key = ctx => /*selectedPath*/ ctx[72].item.id;

	for (let i = 0; i < each_value_1.length; i += 1) {
		let child_ctx = get_each_context_1(ctx, each_value_1, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
	}

	let if_block1 = /*historyItems*/ ctx[5].length > 0 && create_if_block_1(ctx);

	return {
		c() {
			div2 = element("div");
			p = element("p");
			p.textContent = "活跃台风可在此关闭或恢复路径且不占额度；最多同时显示 5 条停编历史路径，最多保留 6 条已选历史记录，超出时自动清理最早关闭的记录。";
			t1 = space();
			div1 = element("div");
			div0 = element("div");
			t2 = text(/*historyStatusText*/ ctx[6]);
			t3 = space();
			if (if_block0) if_block0.c();
			t4 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t5 = space();
			if (if_block1) if_block1.c();
			attr(p, "class", "history-query__hint svelte-9z60az");
			attr(div0, "class", "history-query__status svelte-9z60az");
			attr(div0, "aria-live", "polite");
			attr(div1, "class", "history-query__status-row svelte-9z60az");
			attr(div2, "class", "history-query__body svelte-9z60az");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, p);
			append(div2, t1);
			append(div2, div1);
			append(div1, div0);
			append(div0, t2);
			append(div1, t3);
			if (if_block0) if_block0.m(div1, null);
			append(div2, t4);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div2, null);
				}
			}

			append(div2, t5);
			if (if_block1) if_block1.m(div2, null);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*historyStatusText*/ 64) set_data(t2, /*historyStatusText*/ ctx[6]);

			if (/*historyLoadFailed*/ ctx[8] && !/*historyListLoading*/ ctx[7]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_7(ctx);
					if_block0.c();
					if_block0.m(div1, null);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (dirty[0] & /*historicalPaths, focusHistoricalPoint, toggleHistoricalWindList, removeHistoricalPath, handleHistoricalPathToggle*/ 1868800) {
				each_value_1 = ensure_array_like(/*historicalPaths*/ ctx[10]);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, div2, destroy_block, create_each_block_1, t5, get_each_context_1);
			}

			if (/*historyItems*/ ctx[5].length > 0) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_1(ctx);
					if_block1.c();
					if_block1.m(div2, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div2);
			}

			if (if_block0) if_block0.d();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			if (if_block1) if_block1.d();
		}
	};
}

// (221:24) {#if historyLoadFailed && !historyListLoading}
function create_if_block_7(ctx) {
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");
			button.textContent = "重试";
			attr(button, "type", "button");
			attr(button, "class", "history-query__retry-action svelte-9z60az");
		},
		m(target, anchor) {
			insert(target, button, anchor);

			if (!mounted) {
				dispose = listen(button, "click", /*click_handler_4*/ ctx[31]);
				mounted = true;
			}
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(button);
			}

			mounted = false;
			dispose();
		}
	};
}

// (260:36) {#if selectedPath.source === 'history'}
function create_if_block_6(ctx) {
	let button;
	let mounted;
	let dispose;

	function click_handler_5() {
		return /*click_handler_5*/ ctx[33](/*selectedPath*/ ctx[72]);
	}

	return {
		c() {
			button = element("button");
			button.textContent = "移除";
			attr(button, "type", "button");
			attr(button, "class", "history-query__remove-action svelte-9z60az");
		},
		m(target, anchor) {
			insert(target, button, anchor);

			if (!mounted) {
				dispose = listen(button, "click", click_handler_5);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
		},
		d(detaching) {
			if (detaching) {
				detach(button);
			}

			mounted = false;
			dispose();
		}
	};
}

// (273:28) {#if selectedPath.source === 'history'}
function create_if_block_3(ctx) {
	let div;
	let button;
	let span0;
	let t1;
	let span2;
	let t2_value = /*selectedPath*/ ctx[72].rendered.historyPoints.length + "";
	let t2;
	let t3;
	let span1;
	let t4_value = (/*selectedPath*/ ctx[72].windListOpen ? '▼' : '▶') + "";
	let t4;
	let button_aria_expanded_value;
	let t5;
	let mounted;
	let dispose;

	function click_handler_6() {
		return /*click_handler_6*/ ctx[34](/*selectedPath*/ ctx[72]);
	}

	let if_block = /*selectedPath*/ ctx[72].windListOpen && create_if_block_4(ctx);

	return {
		c() {
			div = element("div");
			button = element("button");
			span0 = element("span");
			span0.textContent = "📜 风力演变";
			t1 = space();
			span2 = element("span");
			t2 = text(t2_value);
			t3 = text(" 个实况点\n                                            ");
			span1 = element("span");
			t4 = text(t4_value);
			t5 = space();
			if (if_block) if_block.c();
			attr(span1, "aria-hidden", "true");
			attr(span2, "class", "history-wind-list__toggle-meta svelte-9z60az");
			attr(button, "type", "button");
			attr(button, "class", "history-wind-list__toggle svelte-9z60az");
			attr(button, "aria-expanded", button_aria_expanded_value = /*selectedPath*/ ctx[72].windListOpen);
			attr(div, "class", "history-wind-list svelte-9z60az");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, button);
			append(button, span0);
			append(button, t1);
			append(button, span2);
			append(span2, t2);
			append(span2, t3);
			append(span2, span1);
			append(span1, t4);
			append(div, t5);
			if (if_block) if_block.m(div, null);

			if (!mounted) {
				dispose = listen(button, "click", click_handler_6);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty[0] & /*historicalPaths*/ 1024 && t2_value !== (t2_value = /*selectedPath*/ ctx[72].rendered.historyPoints.length + "")) set_data(t2, t2_value);
			if (dirty[0] & /*historicalPaths*/ 1024 && t4_value !== (t4_value = (/*selectedPath*/ ctx[72].windListOpen ? '▼' : '▶') + "")) set_data(t4, t4_value);

			if (dirty[0] & /*historicalPaths*/ 1024 && button_aria_expanded_value !== (button_aria_expanded_value = /*selectedPath*/ ctx[72].windListOpen)) {
				attr(button, "aria-expanded", button_aria_expanded_value);
			}

			if (/*selectedPath*/ ctx[72].windListOpen) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_4(ctx);
					if_block.c();
					if_block.m(div, null);
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

// (291:36) {#if selectedPath.windListOpen}
function create_if_block_4(ctx) {
	let div0;
	let t1;
	let div1;
	let each_value_2 = ensure_array_like(/*selectedPath*/ ctx[72].rendered.historyPoints);
	let each_blocks = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

	return {
		c() {
			div0 = element("div");
			div0.textContent = "最新在顶部，点击任一记录只打开该点弹窗，不移动地图视野。";
			t1 = space();
			div1 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div0, "class", "history-wind-list__hint svelte-9z60az");
			attr(div1, "class", "history-wind-list__points svelte-9z60az");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t1, anchor);
			insert(target, div1, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div1, null);
				}
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*focusHistoricalPoint, historicalPaths*/ 33792) {
				each_value_2 = ensure_array_like(/*selectedPath*/ ctx[72].rendered.historyPoints);
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2(ctx, each_value_2, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div1, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_2.length;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t1);
				detach(div1);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (327:80) {#if pt.bft.qualifier}
function create_if_block_5(ctx) {
	let span;
	let t_value = /*pt*/ ctx[75].bft.qualifier + "";
	let t;

	return {
		c() {
			span = element("span");
			t = text(t_value);
			attr(span, "class", "history-wind-list__qualifier svelte-9z60az");
		},
		m(target, anchor) {
			insert(target, span, anchor);
			append(span, t);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*historicalPaths*/ 1024 && t_value !== (t_value = /*pt*/ ctx[75].bft.qualifier + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (296:44) {#each selectedPath.rendered.historyPoints as pt, idx}
function create_each_block_2(ctx) {
	let button;
	let span2;
	let span0;
	let t0_value = /*pt*/ ctx[75].displayDate + "";
	let t0;
	let t1;
	let span1;
	let t2_value = /*pt*/ ctx[75].displayTime + "";
	let t2;
	let t3;
	let span5;
	let span3;
	let t4_value = /*pt*/ ctx[75].pressure + "";
	let t4;
	let t5;
	let span4;
	let t7;
	let span8;
	let span6;
	let t8_value = /*pt*/ ctx[75].bft.text + "";
	let t8;
	let t9;
	let span7;
	let t10;
	let t11_value = /*pt*/ ctx[75].speedDisplay + "";
	let t11;
	let t12;
	let mounted;
	let dispose;
	let if_block = /*pt*/ ctx[75].bft.qualifier && create_if_block_5(ctx);

	function click_handler_7() {
		return /*click_handler_7*/ ctx[35](/*selectedPath*/ ctx[72], /*pt*/ ctx[75]);
	}

	return {
		c() {
			button = element("button");
			span2 = element("span");
			span0 = element("span");
			t0 = text(t0_value);
			t1 = space();
			span1 = element("span");
			t2 = text(t2_value);
			t3 = space();
			span5 = element("span");
			span3 = element("span");
			t4 = text(t4_value);
			t5 = space();
			span4 = element("span");
			span4.textContent = "hPa";
			t7 = space();
			span8 = element("span");
			span6 = element("span");
			t8 = text(t8_value);
			t9 = space();
			span7 = element("span");
			t10 = text("(");
			t11 = text(t11_value);
			t12 = text(")");
			if (if_block) if_block.c();
			attr(span0, "class", "svelte-9z60az");
			attr(span1, "class", "svelte-9z60az");
			attr(span2, "class", "history-wind-list__time svelte-9z60az");
			attr(span3, "class", "svelte-9z60az");
			attr(span4, "translate", "no");
			attr(span4, "class", "svelte-9z60az");
			attr(span5, "class", "history-wind-list__pressure svelte-9z60az");
			attr(span6, "class", "svelte-9z60az");
			attr(span7, "translate", "no");
			attr(span7, "class", "history-wind-list__speed svelte-9z60az");
			attr(span8, "class", "history-wind-list__level svelte-9z60az");
			set_style(span8, "background", /*pt*/ ctx[75].bft.color);
			set_style(span8, "color", /*pt*/ ctx[75].bft.textColor);

			set_style(span8, "text-shadow", /*pt*/ ctx[75].bft.textColor === '#ffffff'
			? '0 1px 2px rgba(0,0,0,0.8)'
			: 'none');

			attr(button, "type", "button");
			attr(button, "class", "history-wind-list__point svelte-9z60az");
			toggle_class(button, "history-wind-list__point--latest", /*idx*/ ctx[77] === 0);
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, span2);
			append(span2, span0);
			append(span0, t0);
			append(span2, t1);
			append(span2, span1);
			append(span1, t2);
			append(button, t3);
			append(button, span5);
			append(span5, span3);
			append(span3, t4);
			append(span5, t5);
			append(span5, span4);
			append(button, t7);
			append(button, span8);
			append(span8, span6);
			append(span6, t8);
			append(span8, t9);
			append(span8, span7);
			append(span7, t10);
			append(span7, t11);
			append(span7, t12);
			if (if_block) if_block.m(span7, null);

			if (!mounted) {
				dispose = listen(button, "click", click_handler_7);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty[0] & /*historicalPaths*/ 1024 && t0_value !== (t0_value = /*pt*/ ctx[75].displayDate + "")) set_data(t0, t0_value);
			if (dirty[0] & /*historicalPaths*/ 1024 && t2_value !== (t2_value = /*pt*/ ctx[75].displayTime + "")) set_data(t2, t2_value);
			if (dirty[0] & /*historicalPaths*/ 1024 && t4_value !== (t4_value = /*pt*/ ctx[75].pressure + "")) set_data(t4, t4_value);
			if (dirty[0] & /*historicalPaths*/ 1024 && t8_value !== (t8_value = /*pt*/ ctx[75].bft.text + "")) set_data(t8, t8_value);
			if (dirty[0] & /*historicalPaths*/ 1024 && t11_value !== (t11_value = /*pt*/ ctx[75].speedDisplay + "")) set_data(t11, t11_value);

			if (/*pt*/ ctx[75].bft.qualifier) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_5(ctx);
					if_block.c();
					if_block.m(span7, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty[0] & /*historicalPaths*/ 1024) {
				set_style(span8, "background", /*pt*/ ctx[75].bft.color);
			}

			if (dirty[0] & /*historicalPaths*/ 1024) {
				set_style(span8, "color", /*pt*/ ctx[75].bft.textColor);
			}

			if (dirty[0] & /*historicalPaths*/ 1024) {
				set_style(span8, "text-shadow", /*pt*/ ctx[75].bft.textColor === '#ffffff'
				? '0 1px 2px rgba(0,0,0,0.8)'
				: 'none');
			}
		},
		d(detaching) {
			if (detaching) {
				detach(button);
			}

			if (if_block) if_block.d();
			mounted = false;
			dispose();
		}
	};
}

// (232:20) {#each historicalPaths as selectedPath (selectedPath.item.id)}
function create_each_block_1(key_1, ctx) {
	let div3;
	let div2;
	let div0;
	let span0;

	let t0_value = (/*selectedPath*/ ctx[72].source === 'live'
	? '当前活跃路径'
	: '已选停编路径') + "";

	let t0;
	let t1;
	let strong;
	let t2_value = (/*selectedPath*/ ctx[72].item.no || /*selectedPath*/ ctx[72].item.id) + "";
	let t2;
	let t3;
	let t4_value = (/*selectedPath*/ ctx[72].item.nameCn || /*selectedPath*/ ctx[72].item.nameEn) + "";
	let t4;
	let t5;
	let div1;
	let label;
	let input;
	let input_checked_value;
	let t6;
	let span1;
	let t7_value = (/*selectedPath*/ ctx[72].visible ? '已显示' : '已关闭') + "";
	let t7;
	let t8;
	let t9;
	let mounted;
	let dispose;

	function change_handler(...args) {
		return /*change_handler*/ ctx[32](/*selectedPath*/ ctx[72], ...args);
	}

	let if_block0 = /*selectedPath*/ ctx[72].source === 'history' && create_if_block_6(ctx);
	let if_block1 = /*selectedPath*/ ctx[72].source === 'history' && create_if_block_3(ctx);

	return {
		key: key_1,
		first: null,
		c() {
			div3 = element("div");
			div2 = element("div");
			div0 = element("div");
			span0 = element("span");
			t0 = text(t0_value);
			t1 = space();
			strong = element("strong");
			t2 = text(t2_value);
			t3 = space();
			t4 = text(t4_value);
			t5 = space();
			div1 = element("div");
			label = element("label");
			input = element("input");
			t6 = space();
			span1 = element("span");
			t7 = text(t7_value);
			t8 = space();
			if (if_block0) if_block0.c();
			t9 = space();
			if (if_block1) if_block1.c();
			attr(strong, "class", "svelte-9z60az");
			attr(div0, "class", "history-query__selected-name svelte-9z60az");
			attr(input, "type", "checkbox");
			attr(input, "role", "switch");
			input.checked = input_checked_value = /*selectedPath*/ ctx[72].visible;
			attr(input, "class", "svelte-9z60az");
			attr(label, "class", "history-query__switch svelte-9z60az");
			attr(div1, "class", "history-query__selected-actions svelte-9z60az");
			attr(div2, "class", "history-query__selected svelte-9z60az");
			attr(div3, "class", "history-query__selected-path svelte-9z60az");
			this.first = div3;
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div2);
			append(div2, div0);
			append(div0, span0);
			append(span0, t0);
			append(div0, t1);
			append(div0, strong);
			append(strong, t2);
			append(strong, t3);
			append(strong, t4);
			append(div2, t5);
			append(div2, div1);
			append(div1, label);
			append(label, input);
			append(label, t6);
			append(label, span1);
			append(span1, t7);
			append(div1, t8);
			if (if_block0) if_block0.m(div1, null);
			append(div3, t9);
			if (if_block1) if_block1.m(div3, null);

			if (!mounted) {
				dispose = listen(input, "change", change_handler);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty[0] & /*historicalPaths*/ 1024 && t0_value !== (t0_value = (/*selectedPath*/ ctx[72].source === 'live'
			? '当前活跃路径'
			: '已选停编路径') + "")) set_data(t0, t0_value);

			if (dirty[0] & /*historicalPaths*/ 1024 && t2_value !== (t2_value = (/*selectedPath*/ ctx[72].item.no || /*selectedPath*/ ctx[72].item.id) + "")) set_data(t2, t2_value);
			if (dirty[0] & /*historicalPaths*/ 1024 && t4_value !== (t4_value = (/*selectedPath*/ ctx[72].item.nameCn || /*selectedPath*/ ctx[72].item.nameEn) + "")) set_data(t4, t4_value);

			if (dirty[0] & /*historicalPaths*/ 1024 && input_checked_value !== (input_checked_value = /*selectedPath*/ ctx[72].visible)) {
				input.checked = input_checked_value;
			}

			if (dirty[0] & /*historicalPaths*/ 1024 && t7_value !== (t7_value = (/*selectedPath*/ ctx[72].visible ? '已显示' : '已关闭') + "")) set_data(t7, t7_value);

			if (/*selectedPath*/ ctx[72].source === 'history') {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_6(ctx);
					if_block0.c();
					if_block0.m(div1, null);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*selectedPath*/ ctx[72].source === 'history') {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_3(ctx);
					if_block1.c();
					if_block1.m(div3, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div3);
			}

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			mounted = false;
			dispose();
		}
	};
}

// (342:20) {#if historyItems.length > 0}
function create_if_block_1(ctx) {
	let div0;
	let t0;
	let t1_value = /*historyItems*/ ctx[5].length + "";
	let t1;
	let t2;
	let t3_value = /*historicalPaths*/ ctx[10].filter(func_2).length + "";
	let t3;
	let t4;
	let t5;
	let t6;
	let div1;
	let each_blocks = [];
	let each_1_lookup = new Map_1();
	let each_value = ensure_array_like(/*historyItems*/ ctx[5]);
	const get_key = ctx => /*historyItem*/ ctx[69].id;

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
	}

	return {
		c() {
			div0 = element("div");
			t0 = text("已停编台风，按生成时间从新到旧，共 ");
			t1 = text(t1_value);
			t2 = text(" 个；当前显示\n                            ");
			t3 = text(t3_value);
			t4 = text("/");
			t5 = text(MAX_HISTORICAL_PATHS);
			t6 = space();
			div1 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div0, "class", "history-query__result-meta svelte-9z60az");
			attr(div1, "class", "history-query__results svelte-9z60az");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			append(div0, t0);
			append(div0, t1);
			append(div0, t2);
			append(div0, t3);
			append(div0, t4);
			append(div0, t5);
			insert(target, t6, anchor);
			insert(target, div1, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div1, null);
				}
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*historyItems*/ 32 && t1_value !== (t1_value = /*historyItems*/ ctx[5].length + "")) set_data(t1, t1_value);
			if (dirty[0] & /*historicalPaths*/ 1024 && t3_value !== (t3_value = /*historicalPaths*/ ctx[10].filter(func_2).length + "")) set_data(t3, t3_value);

			if (dirty[0] & /*historyListLoading, historyDetailLoadingId, historyItems, historicalPaths, showHistoricalTyphoon*/ 2098848) {
				each_value = ensure_array_like(/*historyItems*/ ctx[5]);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div1, destroy_block, create_each_block, null, get_each_context);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t6);
				detach(div1);
			}

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}
		}
	};
}

// (372:40) {#if historyItem.nameEn}
function create_if_block_2(ctx) {
	let span;
	let t_value = /*historyItem*/ ctx[69].nameEn + "";
	let t;

	return {
		c() {
			span = element("span");
			t = text(t_value);
			attr(span, "class", "svelte-9z60az");
		},
		m(target, anchor) {
			insert(target, span, anchor);
			append(span, t);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*historyItems*/ 32 && t_value !== (t_value = /*historyItem*/ ctx[69].nameEn + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (351:28) {#each historyItems as historyItem (historyItem.id)}
function create_each_block(key_1, ctx) {
	let button;
	let span0;
	let strong;
	let t0_value = (/*historyItem*/ ctx[69].no || /*historyItem*/ ctx[69].id) + "";
	let t0;
	let t1;
	let t2_value = (/*historyItem*/ ctx[69].nameCn || '未命名') + "";
	let t2;
	let t3;
	let t4;
	let span1;
	let t5_value = getHistoricalResultAction(/*historyItem*/ ctx[69], /*historicalPaths*/ ctx[10], /*historyDetailLoadingId*/ ctx[9]) + "";
	let t5;
	let t6;
	let button_disabled_value;
	let mounted;
	let dispose;
	let if_block = /*historyItem*/ ctx[69].nameEn && create_if_block_2(ctx);

	function click_handler_8() {
		return /*click_handler_8*/ ctx[36](/*historyItem*/ ctx[69]);
	}

	return {
		key: key_1,
		first: null,
		c() {
			button = element("button");
			span0 = element("span");
			strong = element("strong");
			t0 = text(t0_value);
			t1 = space();
			t2 = text(t2_value);
			t3 = space();
			if (if_block) if_block.c();
			t4 = space();
			span1 = element("span");
			t5 = text(t5_value);
			t6 = space();
			attr(strong, "class", "svelte-9z60az");
			attr(span0, "class", "history-query__result-name svelte-9z60az");
			attr(span1, "class", "history-query__result-action svelte-9z60az");
			attr(button, "type", "button");
			attr(button, "class", "history-query__result svelte-9z60az");
			button.disabled = button_disabled_value = /*historyListLoading*/ ctx[7] || /*historyDetailLoadingId*/ ctx[9] !== null || !canShowHistoricalPath(/*historyItem*/ ctx[69].id, /*historicalPaths*/ ctx[10]);
			toggle_class(button, "history-query__result--selected", isHistoricalPathSelected(/*historyItem*/ ctx[69].id, /*historicalPaths*/ ctx[10]));
			this.first = button;
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, span0);
			append(span0, strong);
			append(strong, t0);
			append(strong, t1);
			append(strong, t2);
			append(span0, t3);
			if (if_block) if_block.m(span0, null);
			append(button, t4);
			append(button, span1);
			append(span1, t5);
			append(button, t6);

			if (!mounted) {
				dispose = listen(button, "click", click_handler_8);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty[0] & /*historyItems*/ 32 && t0_value !== (t0_value = (/*historyItem*/ ctx[69].no || /*historyItem*/ ctx[69].id) + "")) set_data(t0, t0_value);
			if (dirty[0] & /*historyItems*/ 32 && t2_value !== (t2_value = (/*historyItem*/ ctx[69].nameCn || '未命名') + "")) set_data(t2, t2_value);

			if (/*historyItem*/ ctx[69].nameEn) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_2(ctx);
					if_block.c();
					if_block.m(span0, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty[0] & /*historyItems, historicalPaths, historyDetailLoadingId*/ 1568 && t5_value !== (t5_value = getHistoricalResultAction(/*historyItem*/ ctx[69], /*historicalPaths*/ ctx[10], /*historyDetailLoadingId*/ ctx[9]) + "")) set_data(t5, t5_value);

			if (dirty[0] & /*historyListLoading, historyDetailLoadingId, historyItems, historicalPaths*/ 1696 && button_disabled_value !== (button_disabled_value = /*historyListLoading*/ ctx[7] || /*historyDetailLoadingId*/ ctx[9] !== null || !canShowHistoricalPath(/*historyItem*/ ctx[69].id, /*historicalPaths*/ ctx[10]))) {
				button.disabled = button_disabled_value;
			}

			if (dirty[0] & /*historyItems, historicalPaths*/ 1056) {
				toggle_class(button, "history-query__result--selected", isHistoricalPathSelected(/*historyItem*/ ctx[69].id, /*historicalPaths*/ ctx[10]));
			}
		},
		d(detaching) {
			if (detaching) {
				detach(button);
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
	let div5;
	let div2;
	let t14;
	let div3;
	let t15;
	let t16;
	let button0;

	let t17_value = (/*isLoading*/ ctx[2]
	? '⏳ 正在刷新中央气象台数据…'
	: '📡 刷新中央气象台实时数据') + "";

	let t17;
	let t18;
	let t19;
	let div4;
	let button1;
	let span1;
	let t21;
	let span4;
	let span2;
	let t22;
	let t23_value = /*historicalPaths*/ ctx[10].filter(func).length + "";
	let t23;
	let t24;
	let t25;
	let t26;
	let span3;
	let t27_value = (/*historyPanelOpen*/ ctx[4] ? '▼' : '▶') + "";
	let t27;
	let t28;
	let mounted;
	let dispose;
	let if_block0 = /*typhoonListInfo*/ ctx[1].length > 0 && create_if_block_8(ctx);
	let if_block1 = /*historyPanelOpen*/ ctx[4] && create_if_block(ctx);

	return {
		c() {
			div0 = element("div");
			div0.textContent = `${/*title*/ ctx[11]}`;
			t1 = space();
			section = element("section");
			div1 = element("div");
			div1.textContent = `${/*title*/ ctx[11]}`;
			t3 = space();
			div5 = element("div");
			div2 = element("div");

			div2.innerHTML = `<strong style="color: #40a9ff; font-size: 14px;">🌀 中央气象台 (CMA) 实时与预报路径</strong> <p style="font-size: 12px; color: #d9d9d9; margin: 4px 0 0 0;">数据来源：CMA 官方接口 (typhoon.nmc.cn)<br/>
                风力级数：GB/T 28591-2012（0–17级）<br/>
                扩展显示：风速 &gt; <span translate="no">61.2 m/s</span> 时标记为“18级（扩展）”<br/>
                气旋等级：GB/T 19201-2006（2分钟平均风）<br/>
                轨迹说明：🌈 分色实线 (实况) | 🟡 金色虚线 (120h预测)<br/>
                更新与停编：打开时及手动刷新；已停编仅显示历史实况</p>`;

			t14 = space();
			div3 = element("div");
			t15 = text(/*statusText*/ ctx[0]);
			t16 = space();
			button0 = element("button");
			t17 = text(t17_value);
			t18 = space();
			if (if_block0) if_block0.c();
			t19 = space();
			div4 = element("div");
			button1 = element("button");
			span1 = element("span");
			span1.textContent = "📚 近一年台风";
			t21 = space();
			span4 = element("span");
			span2 = element("span");
			t22 = text("历史 ");
			t23 = text(t23_value);
			t24 = text("/");
			t25 = text(MAX_HISTORICAL_PATHS);
			t26 = space();
			span3 = element("span");
			t27 = text(t27_value);
			t28 = space();
			if (if_block1) if_block1.c();
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
			button0.disabled = /*isLoading*/ ctx[2];
			set_style(button0, "width", "100%");
			set_style(button0, "padding", "10px");
			set_style(button0, "background", "#1890ff");
			set_style(button0, "color", "#ffffff");
			set_style(button0, "border", "none");
			set_style(button0, "border-radius", "6px");
			set_style(button0, "font-weight", "bold");
			set_style(button0, "cursor", /*isLoading*/ ctx[2] ? 'wait' : 'pointer');
			set_style(button0, "opacity", /*isLoading*/ ctx[2] ? 0.72 : 1);
			set_style(button0, "text-shadow", "0 1px 2px rgba(0,0,0,0.5)");
			attr(span2, "class", "history-query__path-state svelte-9z60az");
			toggle_class(span2, "history-query__path-state--visible", /*historicalPaths*/ ctx[10].filter(func_1).length > 0);
			attr(span3, "class", "history-query__chevron svelte-9z60az");
			attr(span3, "aria-hidden", "true");
			attr(span4, "class", "history-query__toggle-meta svelte-9z60az");
			attr(button1, "type", "button");
			attr(button1, "class", "history-query__toggle svelte-9z60az");
			attr(button1, "aria-expanded", /*historyPanelOpen*/ ctx[4]);
			attr(div4, "class", "history-query svelte-9z60az");
			set_style(div5, "padding", "12px");
			set_style(div5, "font-family", "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif");
			set_style(div5, "color", "#ffffff");
			attr(section, "class", "plugin__content svelte-9z60az");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t1, anchor);
			insert(target, section, anchor);
			append(section, div1);
			append(section, t3);
			append(section, div5);
			append(div5, div2);
			append(div5, t14);
			append(div5, div3);
			append(div3, t15);
			append(div5, t16);
			append(div5, button0);
			append(button0, t17);
			append(div5, t18);
			if (if_block0) if_block0.m(div5, null);
			append(div5, t19);
			append(div5, div4);
			append(div4, button1);
			append(button1, span1);
			append(button1, t21);
			append(button1, span4);
			append(span4, span2);
			append(span2, t22);
			append(span2, t23);
			append(span2, t24);
			append(span2, t25);
			append(span4, t26);
			append(span4, span3);
			append(span3, t27);
			append(div4, t28);
			if (if_block1) if_block1.m(div4, null);

			if (!mounted) {
				dispose = [
					listen(div1, "click", /*returnToMenu*/ ctx[12]),
					listen(div1, "keydown", /*keydown_handler*/ ctx[25]),
					listen(button0, "click", /*click_handler*/ ctx[26]),
					listen(button1, "click", /*click_handler_3*/ ctx[30])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*statusText*/ 1) set_data(t15, /*statusText*/ ctx[0]);

			if (dirty[0] & /*isLoading*/ 4 && t17_value !== (t17_value = (/*isLoading*/ ctx[2]
			? '⏳ 正在刷新中央气象台数据…'
			: '📡 刷新中央气象台实时数据') + "")) set_data(t17, t17_value);

			if (dirty[0] & /*isLoading*/ 4) {
				button0.disabled = /*isLoading*/ ctx[2];
			}

			if (dirty[0] & /*isLoading*/ 4) {
				set_style(button0, "cursor", /*isLoading*/ ctx[2] ? 'wait' : 'pointer');
			}

			if (dirty[0] & /*isLoading*/ 4) {
				set_style(button0, "opacity", /*isLoading*/ ctx[2] ? 0.72 : 1);
			}

			if (/*typhoonListInfo*/ ctx[1].length > 0) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_8(ctx);
					if_block0.c();
					if_block0.m(div5, t19);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (dirty[0] & /*historicalPaths*/ 1024 && t23_value !== (t23_value = /*historicalPaths*/ ctx[10].filter(func).length + "")) set_data(t23, t23_value);

			if (dirty[0] & /*historicalPaths*/ 1024) {
				toggle_class(span2, "history-query__path-state--visible", /*historicalPaths*/ ctx[10].filter(func_1).length > 0);
			}

			if (dirty[0] & /*historyPanelOpen*/ 16 && t27_value !== (t27_value = (/*historyPanelOpen*/ ctx[4] ? '▼' : '▶') + "")) set_data(t27, t27_value);

			if (dirty[0] & /*historyPanelOpen*/ 16) {
				attr(button1, "aria-expanded", /*historyPanelOpen*/ ctx[4]);
			}

			if (/*historyPanelOpen*/ ctx[4]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block(ctx);
					if_block1.c();
					if_block1.m(div4, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
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

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			mounted = false;
			run_all(dispose);
		}
	};
}

const DETAIL_CONCURRENCY = 6;
const MAX_HISTORICAL_PATHS = 5;
const MAX_RETAINED_HISTORICAL_PATHS = 6;

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

function getRecentHistoricalListYears(date) {
	const beijingDate = new Date(date.getTime() + 8 * 3600 * 1000);
	const currentYear = beijingDate.getUTCFullYear();
	return [currentYear, currentYear - 1];
}

function isHistoricalPathSelected(pathId, paths) {
	return paths.some(path => path.item.id === pathId);
}

function canShowHistoricalPath(pathId, paths) {
	const historicalPath = paths.find(path => path.item.id === pathId);
	const visibleStoppedPathCount = paths.filter(path => path.source === 'history' && path.visible).length;
	return historicalPath?.visible === true || visibleStoppedPathCount < MAX_HISTORICAL_PATHS;
}

function getHistoricalResultAction(item, paths, loadingPathId) {
	if (loadingPathId === item.id) {
		return '加载中…';
	}

	const selectedPath = paths.find(path => path.item.id === item.id);

	if (selectedPath) {
		if (selectedPath.visible) {
			return '查看列表';
		}

		return canShowHistoricalPath(item.id, paths) ? '重新显示' : '已达上限';
	}

	return canShowHistoricalPath(item.id, paths) ? '显示路径' : '已达上限';
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

const func = path => path.source === 'history' && path.visible;
const func_1 = path => path.source === 'history' && path.visible;
const func_2 = path => path.source === 'history' && path.visible;

function instance($$self, $$props, $$invalidate) {
	const { title } = config;
	const REQUEST_TIMEOUT_MS = 20 * 1000;
	const REFRESH_TIMEOUT_MS = 30 * 1000;
	const HISTORY_DETAIL_TIMEOUT_MS = 60 * 1000;
	const HISTORY_DETAIL_CACHE_TTL_MS = 30 * 60 * 1000;
	let statusText = '点击上方按钮发起中央气象台实时联网请求...';
	let typhoonListInfo = [];
	let layerGroup = null;
	let activeRequest = null;
	let requestSequence = 0;
	let isLoading = false;
	let expandedTyphoonId = null;
	let historyPanelOpen = false;
	let historyItems = [];
	let historyStatusText = '首次展开后将自动加载近一年台风。';
	let historyListLoading = false;
	let historyListLoaded = false;
	let historyLoadFailed = false;
	let historyDetailLoadingId = null;
	let historyRequest = null;
	let historyRequestSequence = 0;
	let historicalPaths = [];
	const historicalDetailCache = new Map();

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

	function releaseHistoricalPathLayer(historicalPath) {
		if (map.hasLayer(historicalPath.layerGroup)) {
			map.removeLayer(historicalPath.layerGroup);
		}

		historicalPath.layerGroup.clearLayers();
	}

	function releaseHistoricalPathResources() {
		for (const historicalPath of historicalPaths) {
			releaseHistoricalPathLayer(historicalPath);
		}

		$$invalidate(10, historicalPaths = []);
	}

	function pruneRetainedHistoricalPaths(additionalCount = 0) {
		const stoppedPaths = historicalPaths.filter(path => path.source === 'history');
		const overflow = stoppedPaths.length + additionalCount - MAX_RETAINED_HISTORICAL_PATHS;

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

		$$invalidate(10, historicalPaths = historicalPaths.filter(path => !removedPaths.has(path)));
		return pathsToRemove.length;
	}

	function releaseMapResources() {
		map.off('click', handleMapClick);
		map.closePopup();

		if (layerGroup) {
			layerGroup.clearLayers();
			map.removeLayer(layerGroup);
			layerGroup = null;
		}

		releaseHistoricalPathResources();
	}

	function cancelActiveRequest() {
		activeRequest?.abort();
		activeRequest = null;
		requestSequence += 1;
		$$invalidate(2, isLoading = false);
	}

	function cancelHistoryRequest() {
		historyRequest?.abort();
		historyRequest = null;
		historyRequestSequence += 1;
		$$invalidate(7, historyListLoading = false);
		$$invalidate(9, historyDetailLoadingId = null);
	}

	function refreshHistoryAfterManualLiveUpdate(reason) {
		if (reason !== 'manual') {
			return;
		}

		if (historyRequest || historyListLoading) {
			cancelHistoryRequest();
		}

		historyListLoaded = false;
		$$invalidate(8, historyLoadFailed = false);

		if (historyPanelOpen) {
			void loadRecentHistoricalTyphoons();
		} else if (historyItems.length > 0) {
			$$invalidate(6, historyStatusText = '实时数据已刷新；下次展开时将重新核对近一年停编台风。');
		}
	}

	async function fetchText(url, signal, cache = 'default') {
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
			const response = await fetch(url, { signal: requestController.signal, cache });

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
		cancelHistoryRequest();
		releaseMapResources();
		$$invalidate(1, typhoonListInfo = []);
		$$invalidate(3, expandedTyphoonId = null);
		$$invalidate(4, historyPanelOpen = false);
		$$invalidate(5, historyItems = []);
		historyListLoaded = false;
		$$invalidate(8, historyLoadFailed = false);
		historicalDetailCache.clear();
		$$invalidate(6, historyStatusText = '首次展开后将自动加载近一年台风。');
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

	function setLivePathVisibility(item, visible) {
		if (!layerGroup || !item.pathLayerGroup) {
			return;
		}

		if (visible) {
			if (!layerGroup.hasLayer(item.pathLayerGroup)) {
				layerGroup.addLayer(item.pathLayerGroup);
			}
		} else if (layerGroup.hasLayer(item.pathLayerGroup)) {
			layerGroup.removeLayer(item.pathLayerGroup);
			map.closePopup();
		}

		item.pathVisible = visible;
		$$invalidate(1, typhoonListInfo = [...typhoonListInfo]);
	}

	function syncActiveHistoricalPaths(liveItems) {
		const previousActiveById = new Map(historicalPaths.filter(path => path.source === 'live').map(path => [path.item.id, path]));
		const liveIds = new Set(liveItems.map(item => String(item.id)));

		for (const duplicatePath of historicalPaths.filter(path => path.source === 'history' && liveIds.has(path.item.id))) {
			if (map.hasLayer(duplicatePath.layerGroup)) {
				map.removeLayer(duplicatePath.layerGroup);
			}

			duplicatePath.layerGroup.clearLayers();
		}

		const activePaths = liveItems.map(item => {
			const id = String(item.id);
			const previousPath = previousActiveById.get(id);

			return {
				item: {
					id,
					no: String(item.no ?? ''),
					nameEn: String(item.nameEn ?? ''),
					nameCn: String(item.nameCn ?? ''),
					sourceStatus: 'start'
				},
				layerGroup: item.pathLayerGroup,
				rendered: item,
				source: 'live',
				visible: item.pathVisible !== false,
				windListOpen: previousPath?.windListOpen ?? false
			};
		});

		const stoppedPaths = historicalPaths.filter(path => path.source === 'history' && !liveIds.has(path.item.id));
		$$invalidate(10, historicalPaths = [...activePaths, ...stoppedPaths]);
	}

	function clearTrackedLivePathLayers() {
		for (const historicalPath of historicalPaths) {
			if (historicalPath.source === 'live') {
				historicalPath.layerGroup.clearLayers();
			}
		}
	}

	function focusLivePoint(item, pt) {
		if (item.pathVisible === false) {
			setHistoricalPathVisibility(String(item.id), true);

			if (item.pathVisible === false) {
				return;
			}
		}

		focusPoint(pt);
	}

	function focusHistoricalPoint(pathId, pt) {
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
		$$invalidate(7, historyListLoading = false);
		$$invalidate(9, historyDetailLoadingId = null);
		const controller = new AbortController();
		historyRequest = controller;
		const requestId = ++historyRequestSequence;
		return { controller, requestId };
	}

	async function toggleHistoryPanel() {
		$$invalidate(4, historyPanelOpen = !historyPanelOpen);

		if (historyPanelOpen && !historyListLoaded && !historyListLoading) {
			await loadRecentHistoricalTyphoons();
		}
	}

	async function loadRecentHistoricalTyphoons() {
		const now = new Date();
		const years = getRecentHistoricalListYears(now);
		const { controller, requestId } = beginHistoryRequest();
		$$invalidate(7, historyListLoading = true);
		$$invalidate(8, historyLoadFailed = false);
		$$invalidate(6, historyStatusText = '正在获取近一年涉及的台风列表…');
		let detailTimedOut = false;
		let detailTimeoutId = null;

		try {
			const failedYears = [];
			let firstAnnualFailure = null;

			const annualLists = await Promise.all(years.map(async year => {
				const listUrl = `https://typhoon.nmc.cn/weatherservice/typhoon/jsons/list_${year}?callback=cmaHistoryList`;

				try {
					const text = await fetchText(listUrl, controller.signal, 'no-store');

					if (controller.signal.aborted || requestId !== historyRequestSequence) {
						return [];
					}

					const data = parseJsonpPayload(text, `${year} 年台风列表`);
					return Array.isArray(data?.typhoonList) ? data.typhoonList : [];
				} catch(error) {
					if (isAbortError(error)) {
						throw error;
					}

					firstAnnualFailure ??= error;
					failedYears.push(year);
					console.warn(`获取 ${year} 年历史台风列表失败`, error);
					return [];
				}
			}));

			if (controller.signal.aborted || requestId !== historyRequestSequence) {
				return;
			}

			if (failedYears.length === years.length) {
				throw firstAnnualFailure instanceof Error
				? firstAnnualFailure
				: new Error(`全部历史年度列表请求失败（${years.join('、')}）`);
			}

			const candidates = normalizeHistoricalTyphoonList(annualLists.flat()).filter(item => item.sourceStatus === 'stop');

			if (candidates.length === 0) {
				$$invalidate(5, historyItems = []);
				historyListLoaded = true;
				$$invalidate(8, historyLoadFailed = failedYears.length > 0);

				$$invalidate(6, historyStatusText = `⚠️ 已加载的年度列表没有可用停编记录${failedYears.length > 0
				? `；${failedYears.join('、')} 年列表暂未加载成功，可重试`
				: ''}。`);

				return;
			}

			let processedCount = 0;
			let failedCount = 0;
			let cacheHitCount = 0;
			$$invalidate(6, historyStatusText = `正在按生成时间核对 0/${candidates.length} 个台风…`);

			detailTimeoutId = setTimeout(
				() => {
					detailTimedOut = true;
					controller.abort();
				},
				HISTORY_DETAIL_TIMEOUT_MS
			);

			const detailedItems = await mapWithConcurrency(candidates, DETAIL_CONCURRENCY, async item => {
				const cached = historicalDetailCache.get(item.id);

				if (cached && now.getTime() - cached.cachedAt <= HISTORY_DETAIL_CACHE_TTL_MS) {
					cacheHitCount += 1;
					processedCount += 1;

					if (!controller.signal.aborted && requestId === historyRequestSequence) {
						$$invalidate(6, historyStatusText = `正在按生成时间核对 ${processedCount}/${candidates.length} 个台风…`);
					}

					return {
						...item,
						generationTime: cached.generationTime,
						rawData: cached.rawData
					};
				}

				if (cached) {
					historicalDetailCache.delete(item.id);
				}

				try {
					const viewUrl = `https://typhoon.nmc.cn/weatherservice/typhoon/jsons/view_${encodeURIComponent(item.id)}?callback=cmaHistoryView`;
					const viewText = await fetchText(viewUrl, controller.signal);

					if (controller.signal.aborted || requestId !== historyRequestSequence) {
						return null;
					}

					const viewData = parseJsonpPayload(viewText, `${item.no || item.id} 台风详情`);
					const rawData = viewData?.typhoon;
					const generationTime = getFirstObservationTime(rawData);

					if (!rawData || !generationTime) {
						failedCount += 1;
						return null;
					}

					historicalDetailCache.set(item.id, {
						generationTime,
						rawData,
						cachedAt: now.getTime()
					});

					return { ...item, generationTime, rawData };
				} catch(error) {
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
						$$invalidate(6, historyStatusText = `正在按生成时间核对 ${processedCount}/${candidates.length} 个台风…`);
					}
				}
			});

			if (detailTimeoutId !== null) {
				clearTimeout(detailTimeoutId);
				detailTimeoutId = null;
			}

			if (requestId !== historyRequestSequence || controller.signal.aborted && !detailTimedOut) {
				return;
			}

			const completedItems = detailedItems.filter(item => item !== null);
			const recentItems = selectTyphoonsGeneratedWithinOneYear(completedItems, now);
			const unresolvedCount = candidates.length - completedItems.length;
			const warnings = [];

			if (failedYears.length > 0) {
				warnings.push(`${failedYears.join('、')} 年列表暂未加载成功`);
			}

			if (detailTimedOut) {
				warnings.push(`详情核对达到 ${HISTORY_DETAIL_TIMEOUT_MS / 1000} 秒上限，${unresolvedCount} 个尚未完成`);
			} else if (failedCount > 0) {
				warnings.push(`${failedCount} 个详情未能核对`);
			}

			if (cacheHitCount > 0) {
				warnings.push(`复用 ${cacheHitCount} 个会话缓存详情`);
			}

			$$invalidate(5, historyItems = recentItems);
			historyListLoaded = true;
			$$invalidate(8, historyLoadFailed = failedYears.length > 0 || detailTimedOut || failedCount > 0);
			const warningSuffix = warnings.length > 0 ? `；${warnings.join('；')}` : '';

			$$invalidate(6, historyStatusText = recentItems.length > 0
			? `✅ 已找到按生成时间计算的近一年停编台风 ${recentItems.length} 个${warningSuffix}；可勾选显示路径。`
			: `⚠️ 没有找到生成于近一年的可用停编台风记录${warningSuffix}。`);
		} catch(error) {
			if (isAbortError(error)) {
				return;
			}

			console.warn('加载近一年台风失败', error);
			const message = error instanceof Error ? error.message : String(error);
			$$invalidate(8, historyLoadFailed = true);
			$$invalidate(6, historyStatusText = `❌ 近一年台风加载失败：${message}。`);
		} finally {
			if (detailTimeoutId !== null) {
				clearTimeout(detailTimeoutId);
			}

			if (historyRequest === controller) {
				historyRequest = null;
			}

			if (requestId === historyRequestSequence) {
				$$invalidate(7, historyListLoading = false);
			}
		}
	}

	function getVisibleStoppedPathCount() {
		return historicalPaths.filter(path => path.source === 'history' && path.visible).length;
	}

	function setHistoricalPathVisibility(pathId, visible) {
		const historicalPath = historicalPaths.find(path => path.item.id === pathId);

		if (!historicalPath) {
			return;
		}

		if (visible && !historicalPath.visible && historicalPath.source === 'history' && getVisibleStoppedPathCount() >= MAX_HISTORICAL_PATHS) {
			$$invalidate(6, historyStatusText = `最多同时显示 ${MAX_HISTORICAL_PATHS} 条停编历史路径；请先取消一条历史路径的对勾。`);
			$$invalidate(10, historicalPaths = [...historicalPaths]);
			return;
		}

		if (historicalPath.source === 'live') {
			const liveItem = typhoonListInfo.find(item => String(item.id) === String(historicalPath.item.id));

			if (!liveItem) {
				return;
			}

			setLivePathVisibility(liveItem, visible);
		} else {
			if (visible) {
				if (!map.hasLayer(historicalPath.layerGroup)) {
					historicalPath.layerGroup.addTo(map);
				}
			} else if (map.hasLayer(historicalPath.layerGroup)) {
				map.removeLayer(historicalPath.layerGroup);
				map.closePopup();
			}
		}

		historicalPath.visible = visible;
		$$invalidate(10, historicalPaths = [...historicalPaths]);
		const pathKind = historicalPath.source === 'live' ? '活跃路径' : '历史路径';

		$$invalidate(6, historyStatusText = visible
		? `✅ 已在地图显示 ${historicalPath.item.no || historicalPath.item.id} ${historicalPath.item.nameCn || historicalPath.item.nameEn} 的${pathKind}。`
		: `已关闭 ${historicalPath.item.no || historicalPath.item.id} ${historicalPath.item.nameCn || historicalPath.item.nameEn} 的${pathKind}；路径仍保留在显示列表中。`);
	}

	function handleHistoricalPathToggle(pathId, event) {
		setHistoricalPathVisibility(pathId, event.currentTarget.checked);
	}

	function removeHistoricalPath(pathId) {
		const historicalPath = historicalPaths.find(path => path.item.id === pathId && path.source === 'history');

		if (!historicalPath) {
			return;
		}

		if (map.hasLayer(historicalPath.layerGroup)) {
			map.closePopup();
		}

		releaseHistoricalPathLayer(historicalPath);
		$$invalidate(10, historicalPaths = historicalPaths.filter(path => path !== historicalPath));
		$$invalidate(6, historyStatusText = `已移除 ${historicalPath.item.no || historicalPath.item.id} ${historicalPath.item.nameCn || historicalPath.item.nameEn} 的历史路径；当前历史显示 ${getVisibleStoppedPathCount()}/${MAX_HISTORICAL_PATHS}。`);
	}

	function toggleHistoricalWindList(pathId) {
		const historicalPath = historicalPaths.find(path => path.item.id === pathId);

		if (!historicalPath) {
			return;
		}

		historicalPath.windListOpen = !historicalPath.windListOpen;
		$$invalidate(10, historicalPaths = [...historicalPaths]);
	}

	function showHistoricalTyphoon(item) {
		const selectedPath = historicalPaths.find(path => path.item.id === item.id);

		if (selectedPath) {
			$$invalidate(10, historicalPaths = historicalPaths.map(path => ({
				...path,
				windListOpen: path.item.id === item.id
			})));

			setHistoricalPathVisibility(item.id, true);
			return;
		}

		if (getVisibleStoppedPathCount() >= MAX_HISTORICAL_PATHS) {
			$$invalidate(6, historyStatusText = `最多同时显示 ${MAX_HISTORICAL_PATHS} 条停编历史路径；请先取消一条历史路径的对勾。`);
			return;
		}

		if (!ensureLayerGroup()) {
			$$invalidate(6, historyStatusText = '❌ 地图运行环境尚未就绪。');
			return;
		}

		$$invalidate(9, historyDetailLoadingId = item.id);
		$$invalidate(6, historyStatusText = `正在绘制 ${item.no || item.id} ${item.nameCn || item.nameEn} 的历史路径…`);
		let candidateLayerGroup = null;

		try {
			candidateLayerGroup = window.L.layerGroup();
			const rendered = renderTyphoonData(candidateLayerGroup, item.id, item.no, item.nameCn, item.nameEn, item.rawData, '已停编', 'history');

			if (!rendered) {
				throw new Error('详情中没有有效的可绘制实况点');
			}

			candidateLayerGroup.addTo(map);
			const prunedCount = pruneRetainedHistoricalPaths(1);

			$$invalidate(10, historicalPaths = [
				...historicalPaths.map(path => ({ ...path, windListOpen: false })),
				{
					item,
					layerGroup: candidateLayerGroup,
					rendered,
					source: 'history',
					visible: true,
					windListOpen: true
				}
			]);

			candidateLayerGroup = null;

			$$invalidate(6, historyStatusText = `✅ 已添加 ${item.no || item.id} ${item.nameCn || item.nameEn} 的历史实况路径；当前历史显示 ${getVisibleStoppedPathCount()}/${MAX_HISTORICAL_PATHS}${prunedCount > 0
			? `；为控制性能已自动清理 ${prunedCount} 条最早关闭的历史记录`
			: ''}。`);
		} catch(error) {
			if (candidateLayerGroup) {
				if (map.hasLayer(candidateLayerGroup)) {
					map.removeLayer(candidateLayerGroup);
				}

				candidateLayerGroup.clearLayers();
			}

			console.warn(`加载历史台风 ${item.no || item.id} 失败`, error);
			const message = error instanceof Error ? error.message : String(error);
			$$invalidate(6, historyStatusText = `❌ ${item.no || item.id} 历史路径加载失败：${message}；当前地图路径未改变。`);
		} finally {
			$$invalidate(9, historyDetailLoadingId = null);
		}
	}

	function renderTyphoonData(
		targetLayerGroup,
	tfId,
	tfNo,
	tfNameCn,
	tfNameEn,
	rawData,
	tfStatus = '进行中',
	renderMode = 'live'
	) {
		if (!window.L || !targetLayerGroup) {
			return null;
		}

		const points = Array.isArray(rawData?.[8]) ? rawData[8] : [];
		const realSegments = [];
		const realPointsList = [];
		const safeNo = escapeHtml(tfNo);
		const safeNameCn = escapeHtml(tfNameCn);
		const safeNameEn = escapeHtml(tfNameEn);
		const pointKind = renderMode === 'history' ? '历史实况点' : '实况点';

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
			$$invalidate(0, statusText = '❌ 地图运行环境尚未就绪。');
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
		$$invalidate(2, isLoading = true);

		$$invalidate(0, statusText = reason === 'manual'
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
				$$invalidate(0, statusText = hadPreviousDisplay
				? '⚠️ 中央气象台当前列表为空；已保留上次成功显示。'
				: '⚠️ 中央气象台当前没有可显示的台风数据。');

				return;
			}

			const activeItems = typhoonItems.filter(item => item[7] === 'start');
			const stoppedItems = typhoonItems.filter(item => item[7] === 'stop');
			const ignoredStatusCount = typhoonItems.length - activeItems.length - stoppedItems.length;

			if (activeItems.length === 0) {
				if (failedYears.length > 0 && hadPreviousDisplay) {
					$$invalidate(0, statusText = `⚠️ 已加载的年度列表暂未发现活跃台风，但 ${failedYears.join('、')} 年列表请求失败；为避免误删，已保留上次成功显示。`);
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
				$$invalidate(1, typhoonListInfo = []);
				$$invalidate(3, expandedTyphoonId = null);
				syncActiveHistoricalPaths([]);

				const listFailureSuffix = failedYears.length > 0
				? `；${failedYears.join('、')} 年列表暂未加载成功`
				: '';

				const ignoredStatusSuffix = ignoredStatusCount > 0
				? `；忽略 ${ignoredStatusCount} 条未知状态记录`
				: '';

				$$invalidate(0, statusText = `⚠️ 当前无活跃台风；已停编台风可在下方“近一年台风”中查看${listFailureSuffix}${ignoredStatusSuffix}；最后刷新（北京时间）${formatBeijingRefreshTime(new Date())}。`);
				refreshHistoryAfterManualLiveUpdate(reason);
				return;
			}

			$$invalidate(0, statusText = `✅ 台风列表获取成功，正在加载 ${activeItems.length} 个活跃台风；${stoppedItems.length} 个停编记录请在下方“近一年台风”中查看...`);

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

			clearTrackedLivePathLayers();
			previousLayerGroup?.clearLayers();
			layerGroup = pendingLayerGroup;
			pendingLayerGroup = null;
			$$invalidate(1, typhoonListInfo = nextTyphoonListInfo);
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

			$$invalidate(0, statusText = `✅ 已绘制 ${renderedActiveCount} 个活跃台风的实况轨迹与可用预报${stoppedSuffix}${staleFallbackSuffix}${failureSuffix}${listFailureSuffix}${ignoredStatusSuffix}${refreshSuffix}。`);
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
	const click_handler_2 = (item, pt) => focusLivePoint(item, pt);
	const keydown_handler_1 = (item, pt, event) => handleActivationKeydown(event, () => focusLivePoint(item, pt));
	const click_handler_3 = () => void toggleHistoryPanel();
	const click_handler_4 = () => void loadRecentHistoricalTyphoons();
	const change_handler = (selectedPath, event) => handleHistoricalPathToggle(selectedPath.item.id, event);
	const click_handler_5 = selectedPath => removeHistoricalPath(selectedPath.item.id);
	const click_handler_6 = selectedPath => toggleHistoricalWindList(selectedPath.item.id);
	const click_handler_7 = (selectedPath, pt) => focusHistoricalPoint(selectedPath.item.id, pt);
	const click_handler_8 = historyItem => void showHistoricalTyphoon(historyItem);

	return [
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
		historicalPaths,
		title,
		returnToMenu,
		toggleTyphoonPanel,
		focusLivePoint,
		focusHistoricalPoint,
		toggleHistoryPanel,
		loadRecentHistoricalTyphoons,
		handleHistoricalPathToggle,
		removeHistoricalPath,
		toggleHistoricalWindList,
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
		init(this, options, instance, create_fragment, safe_not_equal, { onopen: 23, onclose: 24 }, add_css, [-1, -1, -1]);
	}

	get onopen() {
		return this.$$.ctx[23];
	}

	get onclose() {
		return this.$$.ctx[24];
	}
}


// transformCode: Export statement was modified
export { __pluginConfig, Plugin as default };
//# sourceMappingURL=plugin.js.map

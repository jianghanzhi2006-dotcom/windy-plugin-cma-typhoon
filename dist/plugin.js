const __pluginConfig =  {
  "name": "windy-plugin-cma-typhoon",
  "version": "1.0.0",
  "icon": "🌀",
  "title": "中央气象台 (CMA) 台风 17 级风级追踪",
  "description": "China Meteorological Administration (CMA) real-time typhoon tracker with 17-level Beaufort wind scale and 120h forecast track.",
  "author": "jianghanzhi2006-dotcom",
  "repository": "https://github.com/jianghanzhi2006-dotcom/windy-plugin-cma-typhoon",
  "desktopUI": "rhpane",
  "mobileUI": "fullscreen",
  "built": 1785457617685,
  "builtReadable": "2026-07-31T00:26:57.685Z",
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
    title: '中央气象台 (CMA) 台风 17 级风级追踪'};

/* src\plugin.svelte generated by Svelte v4.2.20 */

function add_css(target) {
	append_styles(target, "svelte-1ke6024", ".plugin__content.svelte-1ke6024{color:#fff}");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[11] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[14] = list[i];
	child_ctx[16] = i;
	return child_ctx;
}

// (33:8) {#if typhoonListInfo.length > 0}
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
			if (dirty & /*typhoonListInfo, focusPoint*/ 10) {
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

// (48:32) {#each item.historyPoints as pt, idx}
function create_each_block_1(ctx) {
	let div3;
	let div0;
	let span0;
	let t0_value = /*pt*/ ctx[14].formatTime + "";
	let t0;
	let t1;
	let div2;
	let span1;
	let t2_value = /*pt*/ ctx[14].pressure + "";
	let t2;
	let t3;
	let t4;
	let div1;
	let span2;
	let t5_value = /*pt*/ ctx[14].bft.text + "";
	let t5;
	let t6;
	let span3;
	let t7;
	let t8_value = /*pt*/ ctx[14].speedMs + "";
	let t8;
	let t9;
	let t10;
	let mounted;
	let dispose;

	function click_handler_1() {
		return /*click_handler_1*/ ctx[8](/*pt*/ ctx[14]);
	}

	return {
		c() {
			div3 = element("div");
			div0 = element("div");
			span0 = element("span");
			t0 = text(t0_value);
			t1 = space();
			div2 = element("div");
			span1 = element("span");
			t2 = text(t2_value);
			t3 = text(" hPa");
			t4 = space();
			div1 = element("div");
			span2 = element("span");
			t5 = text(t5_value);
			t6 = space();
			span3 = element("span");
			t7 = text("(");
			t8 = text(t8_value);
			t9 = text("m/s)");
			t10 = space();
			set_style(span0, "color", /*idx*/ ctx[16] === 0 ? '#40a9ff' : '#ffffff');
			set_style(span0, "font-weight", /*idx*/ ctx[16] === 0 ? 'bold' : 'normal');
			set_style(div0, "display", "flex");
			set_style(div0, "align-items", "center");
			set_style(div0, "gap", "8px");
			set_style(span1, "color", "#aaa");
			set_style(span1, "font-size", "12px");
			set_style(span2, "font-size", "13px");
			set_style(span2, "line-height", "1.2");
			set_style(span3, "font-size", "12px");
			set_style(span3, "line-height", "1.2");
			set_style(span3, "opacity", "0.95");
			set_style(span3, "margin-top", "2px");
			set_style(div1, "background", /*pt*/ ctx[14].bft.color);
			set_style(div1, "color", /*pt*/ ctx[14].bft.textColor);
			set_style(div1, "padding", "4px 10px");
			set_style(div1, "border-radius", "6px");
			set_style(div1, "font-weight", "bold");

			set_style(div1, "text-shadow", /*pt*/ ctx[14].bft.textColor === '#ffffff'
			? '0 1px 2px rgba(0,0,0,0.8)'
			: 'none');

			set_style(div1, "min-width", "110px");
			set_style(div1, "text-align", "center");
			set_style(div1, "display", "flex");
			set_style(div1, "flex-direction", "column");
			set_style(div1, "align-items", "center");
			set_style(div1, "justify-content", "center");
			set_style(div2, "display", "flex");
			set_style(div2, "align-items", "center");
			set_style(div2, "gap", "10px");
			set_style(div3, "background", /*idx*/ ctx[16] === 0 ? '#132738' : '#262626');
			set_style(div3, "border-radius", "6px");
			set_style(div3, "padding", "8px 12px");
			set_style(div3, "margin-bottom", "6px");
			set_style(div3, "font-size", "13px");
			set_style(div3, "display", "flex");
			set_style(div3, "justify-content", "space-between");
			set_style(div3, "align-items", "center");
			set_style(div3, "cursor", "pointer");

			set_style(div3, "border", /*idx*/ ctx[16] === 0
			? '1.5px solid #1890ff'
			: '1px solid #383838');

			set_style(div3, "box-shadow", /*idx*/ ctx[16] === 0
			? '0 0 8px rgba(24,144,255,0.35)'
			: 'none');

			set_style(div3, "transition", "all 0.2s");
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div0);
			append(div0, span0);
			append(span0, t0);
			append(div3, t1);
			append(div3, div2);
			append(div2, span1);
			append(span1, t2);
			append(span1, t3);
			append(div2, t4);
			append(div2, div1);
			append(div1, span2);
			append(span2, t5);
			append(div1, t6);
			append(div1, span3);
			append(span3, t7);
			append(span3, t8);
			append(span3, t9);
			append(div3, t10);

			if (!mounted) {
				dispose = listen(div3, "click", click_handler_1);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*typhoonListInfo*/ 2 && t0_value !== (t0_value = /*pt*/ ctx[14].formatTime + "")) set_data(t0, t0_value);
			if (dirty & /*typhoonListInfo*/ 2 && t2_value !== (t2_value = /*pt*/ ctx[14].pressure + "")) set_data(t2, t2_value);
			if (dirty & /*typhoonListInfo*/ 2 && t5_value !== (t5_value = /*pt*/ ctx[14].bft.text + "")) set_data(t5, t5_value);
			if (dirty & /*typhoonListInfo*/ 2 && t8_value !== (t8_value = /*pt*/ ctx[14].speedMs + "")) set_data(t8, t8_value);

			if (dirty & /*typhoonListInfo*/ 2) {
				set_style(div1, "background", /*pt*/ ctx[14].bft.color);
			}

			if (dirty & /*typhoonListInfo*/ 2) {
				set_style(div1, "color", /*pt*/ ctx[14].bft.textColor);
			}

			if (dirty & /*typhoonListInfo*/ 2) {
				set_style(div1, "text-shadow", /*pt*/ ctx[14].bft.textColor === '#ffffff'
				? '0 1px 2px rgba(0,0,0,0.8)'
				: 'none');
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div3);
			}

			mounted = false;
			dispose();
		}
	};
}

// (36:16) {#each typhoonListInfo as item}
function create_each_block(ctx) {
	let div4;
	let div0;
	let strong;
	let t0;
	let t1_value = /*item*/ ctx[11].no + "";
	let t1;
	let t2;
	let t3_value = /*item*/ ctx[11].nameCn + "";
	let t3;
	let t4;
	let t5_value = /*item*/ ctx[11].nameEn + "";
	let t5;
	let t6;
	let t7;
	let span;
	let t8;
	let t9_value = /*item*/ ctx[11].status + "";
	let t9;
	let t10;
	let div3;
	let div1;
	let t12;
	let div2;
	let t13;
	let each_value_1 = ensure_array_like(/*item*/ ctx[11].historyPoints);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	return {
		c() {
			div4 = element("div");
			div0 = element("div");
			strong = element("strong");
			t0 = text("🌀 ");
			t1 = text(t1_value);
			t2 = space();
			t3 = text(t3_value);
			t4 = text(" (");
			t5 = text(t5_value);
			t6 = text(")");
			t7 = space();
			span = element("span");
			t8 = text("● ");
			t9 = text(t9_value);
			t10 = space();
			div3 = element("div");
			div1 = element("div");
			div1.textContent = "📜 全程风力演变轨迹（最新在顶部，点击直达）：";
			t12 = space();
			div2 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t13 = space();
			set_style(strong, "color", "#69c0ff");
			set_style(strong, "font-size", "15px");

			set_style(span, "background", /*item*/ ctx[11].status === '进行中'
			? '#275017'
			: '#434343');

			set_style(span, "color", "#ffffff");
			set_style(span, "padding", "2px 8px");
			set_style(span, "border-radius", "10px");
			set_style(span, "font-size", "12px");
			set_style(span, "font-weight", "bold");
			set_style(div0, "display", "flex");
			set_style(div0, "justify-content", "space-between");
			set_style(div0, "align-items", "center");
			set_style(div0, "margin-bottom", "8px");
			set_style(div0, "border-bottom", "1px solid #333");
			set_style(div0, "padding-bottom", "6px");
			set_style(div1, "font-size", "12px");
			set_style(div1, "color", "#8c8c8c");
			set_style(div1, "margin-bottom", "8px");
			set_style(div1, "font-weight", "bold");
			set_style(div2, "max-height", "520px");
			set_style(div2, "overflow-y", "auto");
			set_style(div2, "padding-right", "4px");
			set_style(div3, "margin-top", "8px");
			set_style(div4, "background", "#1e1e1e");
			set_style(div4, "border-radius", "8px");
			set_style(div4, "padding", "12px");
			set_style(div4, "margin-bottom", "12px");
			set_style(div4, "border", "1px solid #3a3a3a");
			set_style(div4, "box-shadow", "0 2px 6px rgba(0,0,0,0.4)");
		},
		m(target, anchor) {
			insert(target, div4, anchor);
			append(div4, div0);
			append(div0, strong);
			append(strong, t0);
			append(strong, t1);
			append(strong, t2);
			append(strong, t3);
			append(strong, t4);
			append(strong, t5);
			append(strong, t6);
			append(div0, t7);
			append(div0, span);
			append(span, t8);
			append(span, t9);
			append(div4, t10);
			append(div4, div3);
			append(div3, div1);
			append(div3, t12);
			append(div3, div2);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div2, null);
				}
			}

			append(div4, t13);
		},
		p(ctx, dirty) {
			if (dirty & /*typhoonListInfo*/ 2 && t1_value !== (t1_value = /*item*/ ctx[11].no + "")) set_data(t1, t1_value);
			if (dirty & /*typhoonListInfo*/ 2 && t3_value !== (t3_value = /*item*/ ctx[11].nameCn + "")) set_data(t3, t3_value);
			if (dirty & /*typhoonListInfo*/ 2 && t5_value !== (t5_value = /*item*/ ctx[11].nameEn + "")) set_data(t5, t5_value);
			if (dirty & /*typhoonListInfo*/ 2 && t9_value !== (t9_value = /*item*/ ctx[11].status + "")) set_data(t9, t9_value);

			if (dirty & /*typhoonListInfo*/ 2) {
				set_style(span, "background", /*item*/ ctx[11].status === '进行中'
				? '#275017'
				: '#434343');
			}

			if (dirty & /*focusPoint, typhoonListInfo*/ 10) {
				each_value_1 = ensure_array_like(/*item*/ ctx[11].historyPoints);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div2, null);
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
				detach(div4);
			}

			destroy_each(each_blocks, detaching);
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
	let t9;
	let div3;
	let t10;
	let t11;
	let button;
	let t13;
	let mounted;
	let dispose;
	let if_block = /*typhoonListInfo*/ ctx[1].length > 0 && create_if_block(ctx);

	return {
		c() {
			div0 = element("div");
			div0.textContent = `${/*title*/ ctx[2]}`;
			t1 = space();
			section = element("section");
			div1 = element("div");
			div1.textContent = `${/*title*/ ctx[2]}`;
			t3 = space();
			div4 = element("div");
			div2 = element("div");

			div2.innerHTML = `<strong style="color: #40a9ff; font-size: 14px;">🌀 中央气象台 (CMA) 实时与预报路径</strong> <p style="font-size: 12px; color: #d9d9d9; margin: 4px 0 0 0;">数据来源：CMA 官方接口 (typhoon.nmc.cn)<br/>
                风力标准：蒲氏 17 级 (2分钟平均风速)<br/>
                轨迹说明：🔴 红色实线 (实况) | 🟡 金色虚线 (120h预测)</p>`;

			t9 = space();
			div3 = element("div");
			t10 = text(/*statusText*/ ctx[0]);
			t11 = space();
			button = element("button");
			button.textContent = "📡 刷新中央气象台实时数据";
			t13 = space();
			if (if_block) if_block.c();
			attr(div0, "class", "plugin__mobile-header");
			attr(div1, "class", "plugin__title plugin__title--chevron-back");
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
			set_style(button, "width", "100%");
			set_style(button, "padding", "10px");
			set_style(button, "background", "#1890ff");
			set_style(button, "color", "#ffffff");
			set_style(button, "border", "none");
			set_style(button, "border-radius", "6px");
			set_style(button, "font-weight", "bold");
			set_style(button, "cursor", "pointer");
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
			append(div4, t9);
			append(div4, div3);
			append(div3, t10);
			append(div4, t11);
			append(div4, button);
			append(div4, t13);
			if (if_block) if_block.m(div4, null);

			if (!mounted) {
				dispose = [
					listen(div1, "click", /*click_handler*/ ctx[7]),
					listen(button, "click", /*fetchCMATyphoonLive*/ ctx[4])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*statusText*/ 1) set_data(t10, /*statusText*/ ctx[0]);

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

function getBeaufort(ms) {
	if (ms < 0.3) return {
		text: "0级无风",
		color: "#E8E8E8",
		textColor: "#000000"
	};

	if (ms <= 1.5) return {
		text: "1级软风",
		color: "#B5F5EC",
		textColor: "#000000"
	};

	if (ms <= 3.3) return {
		text: "2级轻风",
		color: "#87E8DE",
		textColor: "#000000"
	};

	if (ms <= 5.4) return {
		text: "3级微风",
		color: "#5CDBD3",
		textColor: "#000000"
	};

	if (ms <= 7.9) return {
		text: "4级和风",
		color: "#95DE64",
		textColor: "#000000"
	};

	if (ms <= 10.7) return {
		text: "5级清风",
		color: "#73D13D",
		textColor: "#000000"
	};

	if (ms <= 13.8) return {
		text: "6级强风",
		color: "#389E0D",
		textColor: "#FFFFFF"
	};

	if (ms <= 17.1) return {
		text: "7级劲风",
		color: "#FADB14",
		textColor: "#000000"
	};

	if (ms <= 20.7) return {
		text: "8级热带低压",
		color: "#FA8C16",
		textColor: "#FFFFFF"
	};

	if (ms <= 24.4) return {
		text: "9级热带风暴",
		color: "#ED571A",
		textColor: "#FFFFFF"
	};

	if (ms <= 28.4) return {
		text: "10级强热带风暴",
		color: "#CF1322",
		textColor: "#FFFFFF"
	};

	if (ms <= 32.6) return {
		text: "11级暴风",
		color: "#A8071A",
		textColor: "#FFFFFF"
	};

	if (ms <= 36.9) return {
		text: "12级台风",
		color: "#C41D7F",
		textColor: "#FFFFFF"
	};

	if (ms <= 41.4) return {
		text: "13级台风",
		color: "#9E1068",
		textColor: "#FFFFFF"
	};

	if (ms <= 46.1) return {
		text: "14级强台风",
		color: "#722ED1",
		textColor: "#FFFFFF"
	};

	if (ms <= 50.9) return {
		text: "15级强台风",
		color: "#531DAB",
		textColor: "#FFFFFF"
	};

	if (ms <= 56.0) return {
		text: "16级超强台风",
		color: "#391085",
		textColor: "#FFFFFF"
	};

	if (ms <= 61.2) return {
		text: "17级超强台风",
		color: "#230759",
		textColor: "#FFFFFF"
	};

	return {
		text: "18级超强台风",
		color: "#120338",
		textColor: "#FFFFFF"
	};
}

function formatCleanTime(str) {
	if (!str || str.length < 12) return str;

	try {
		const y = parseInt(str.substring(0, 4), 10);
		const m = parseInt(str.substring(4, 6), 10) - 1;
		const d = parseInt(str.substring(6, 8), 10);
		const h = parseInt(str.substring(8, 10), 10);
		const utcDate = new Date(Date.UTC(y, m, d, h, 0, 0));
		const bjTimeMs = utcDate.getTime() + 8 * 3600 * 1000;
		const bjDate = new Date(bjTimeMs);
		const bjM = String(bjDate.getUTCMonth() + 1).padStart(2, '0');
		const bjD = String(bjDate.getUTCDate()).padStart(2, '0');
		const bjH = String(bjDate.getUTCHours()).padStart(2, '0');
		return `${bjM}-${bjD} ${bjH}:00`;
	} catch(e) {
		return str;
	}
}

function formatForecastTime(baseStr, fcHours) {
	if (!baseStr || baseStr.length < 12) return baseStr;

	try {
		const y = parseInt(baseStr.substring(0, 4), 10);
		const m = parseInt(baseStr.substring(4, 6), 10) - 1;
		const d = parseInt(baseStr.substring(6, 8), 10);
		const h = parseInt(baseStr.substring(8, 10), 10);
		const utcDate = new Date(Date.UTC(y, m, d, h, 0, 0));
		const targetMs = utcDate.getTime() + fcHours * 3600 * 1000 + 8 * 3600 * 1000;
		const targetDate = new Date(targetMs);
		const bjM = String(targetDate.getUTCMonth() + 1).padStart(2, '0');
		const bjD = String(targetDate.getUTCDate()).padStart(2, '0');
		const bjH = String(targetDate.getUTCHours()).padStart(2, '0');
		return `${bjM}-${bjD} ${bjH}:00`;
	} catch(e) {
		return baseStr;
	}
}

function instance($$self, $$props, $$invalidate) {
	const { title } = config;
	let statusText = '点击上方按钮发起中央气象台实时联网请求...';
	let typhoonListInfo = [];
	let layerGroup = null;

	const onopen = _params => {
		fetchCMATyphoonLive();
	};

	const onclose = () => {
		if (layerGroup) {
			layerGroup.clearLayers();
		}
	};

	function focusPoint(pt) {
		map.flyTo([pt.lat, pt.lng], 6);

		if (pt.markerInstance) {
			pt.markerInstance.openPopup();
		}
	}

	function renderTyphoonData(tfId, tfNo, tfNameCn, tfNameEn, rawData, tfStatus = '进行中') {
		if (!window.L || !layerGroup) return;
		const points = rawData[8] || [];
		const realLatlngs = [];
		const realPointsList = [];
		map.off('click');

		map.on('click', () => {
			map.closePopup();
		});

		points.forEach(p => {
			const timeStr = p[1];
			const lng = p[4];
			const lat = p[5];
			const pressure = p[6];
			const speedMs = p[7];
			const bft = getBeaufort(speedMs);
			const formattedT = formatCleanTime(timeStr);
			realLatlngs.push([lat, lng]);

			const popupHtml = `
                <div style="font-size:13px; line-height:1.6; color:#000; font-family:sans-serif; padding:2px;">
                    <strong style="font-size:15px; color:#1890ff;">🌀 ${tfNo} ${tfNameCn} (${tfNameEn}) [实况点]</strong><br/>
                    <b>📍 时间</b>：${formattedT}<br/>
                    <b>🌬️ 风力等级</b>：<span style="background:${bft.color}; color:${bft.textColor}; padding:2px 6px; border-radius:3px; font-weight:bold;">${bft.text} (${speedMs} m/s)</span><br/>
                    <b>📉 中心气压</b>：${pressure} hPa<br/>
                    <b>🧭 坐标</b>：${lat}°N, ${lng}°E
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
			}).addTo(layerGroup);

			const marker = window.L.circleMarker([lat, lng], {
				radius: 4,
				color: '#ffffff',
				weight: 1.5,
				fillColor: bft.color,
				fillOpacity: 1,
				interactive: true
			}).addTo(layerGroup);

			hitArea.bindPopup(popupHtml, popupOptions);
			marker.bindPopup(popupHtml, popupOptions);

			realPointsList.push({
				lat,
				lng,
				timeStr,
				formatTime: formattedT,
				pressure,
				speedMs,
				bft,
				isForecast: false,
				markerInstance: hitArea
			});
		});

		if (realLatlngs.length > 0) {
			window.L.polyline(realLatlngs, { color: '#ff4d4f', weight: 2.5 }).addTo(layerGroup);
		}

		if (points.length > 0) {
			const lastPointObj = points[points.length - 1];
			const forecastDict = lastPointObj[11] || {};
			const babjForecast = forecastDict['BABJ'] || Object.values(forecastDict)[0] || [];

			if (babjForecast.length > 0 && realLatlngs.length > 0) {
				const lastRealCoord = realLatlngs[realLatlngs.length - 1];
				const forecastLatlngs = [lastRealCoord];

				babjForecast.forEach(fc => {
					const fcHours = fc[0];
					const baseTimeStr = fc[1];
					const lng = fc[2];
					const lat = fc[3];
					const pressure = fc[4];
					const speedMs = fc[5];
					const bft = getBeaufort(speedMs);
					const targetFormattedTime = formatForecastTime(baseTimeStr, fcHours);
					forecastLatlngs.push([lat, lng]);

					const fcPopupHtml = `
                        <div style="font-size:13px; line-height:1.6; color:#000; font-family:sans-serif; padding:2px;">
                            <strong style="font-size:15px; color:#faad14;">🔮 ${tfNo} ${tfNameCn} [中央气象台 +${fcHours}h 未来预测]</strong><br/>
                            <b>📍 预测目标时间</b>：${targetFormattedTime}<br/>
                            <b>🌬️ 预测风力</b>：<span style="background:${bft.color}; color:${bft.textColor}; padding:2px 6px; border-radius:3px; font-weight:bold;">${bft.text} (${speedMs} m/s)</span><br/>
                            <b>📉 预测中心气压</b>：${pressure} hPa<br/>
                            <b>🧭 坐标</b>：${lat}°N, ${lng}°E
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
					}).addTo(layerGroup);

					const fcMarker = window.L.circleMarker([lat, lng], {
						radius: 4,
						color: '#faad14',
						weight: 1.5,
						fillColor: bft.color,
						fillOpacity: 1,
						interactive: true
					}).addTo(layerGroup);

					fcHitArea.bindPopup(fcPopupHtml, popupOptions);
					fcMarker.bindPopup(fcPopupHtml, popupOptions);
				});

				window.L.polyline(forecastLatlngs, {
					color: '#faad14',
					weight: 2.5,
					dashArray: '6,6'
				}).addTo(layerGroup);
			}
		}

		if (realPointsList.length > 0) {
			const reversedReal = [...realPointsList].reverse();

			$$invalidate(1, typhoonListInfo = [
				...typhoonListInfo.filter(t => t.id !== tfId),
				{
					id: tfId,
					no: tfNo,
					nameCn: tfNameCn,
					nameEn: tfNameEn,
					status: tfStatus,
					historyPoints: reversedReal
				}
			]);

			const latestPt = realLatlngs[realLatlngs.length - 1];
			map.flyTo([latestPt[0], latestPt[1]], 5);
		}
	}

	async function fetchCMATyphoonLive() {
		if (!window.L) return;

		if (!layerGroup) {
			layerGroup = window.L.layerGroup().addTo(map);
		}

		layerGroup.clearLayers();
		$$invalidate(0, statusText = '🌐 正在向中央气象台服务器 (typhoon.nmc.cn) 发起真实 HTTP 实时与预报请求...');
		$$invalidate(1, typhoonListInfo = []);

		try {
			const currentYear = new Date().getFullYear();
			const listUrl = `https://typhoon.nmc.cn/weatherservice/typhoon/jsons/list_${currentYear}?callback=cmaLiveList`;
			const res = await fetch(listUrl);
			const text = await res.text();
			const match = text.match(/\((.*)\)/);

			if (!match || !match[1]) {
				$$invalidate(0, statusText = '❌ 实时请求返回格式异常。');
				return;
			}

			const data = JSON.parse(match[1]);

			if (!data || !data.typhoonList || data.typhoonList.length === 0) {
				$$invalidate(0, statusText = '⚠️ 中央气象台实时返回：当前无活跃台风。');
				return;
			}

			const active = data.typhoonList.filter(t => t[7] === 'start');

			const targetList = active.length > 0
			? active
			: data.typhoonList.slice(0, 3);

			$$invalidate(0, statusText = `✅ 实时获取成功！正在绘制中央气象台 ${targetList.length} 个台风的实况与预报线...`);

			for (const item of targetList) {
				const tfId = item[0];
				const tfNameEn = item[1];
				const tfNameCn = item[2];
				const tfNo = item[4];
				const tfStatus = item[7] === 'start' ? '进行中' : '已停编';
				const viewUrl = `https://typhoon.nmc.cn/weatherservice/typhoon/jsons/view_${tfId}?callback=cmaLiveView`;
				const viewRes = await fetch(viewUrl);
				const viewText = await viewRes.text();
				const viewMatch = viewText.match(/\((.*)\)/);

				if (viewMatch && viewMatch[1]) {
					const viewData = JSON.parse(viewMatch[1]);

					if (viewData && viewData.typhoon) {
						renderTyphoonData(tfId, tfNo, tfNameCn, tfNameEn, viewData.typhoon, tfStatus);
					}
				}
			}

			$$invalidate(0, statusText = `✅ 实时拉取成功！地图已画出红色实况线与金色预报虚线！`);
		} catch(err) {
			console.error("中央气象台实时联网请求失败", err);
			$$invalidate(0, statusText = `❌ 浏览器跨域拦截 (CORS/CSP)：无法直接直连 typhoon.nmc.cn。错误原因：${err.message || '网络拦截'}`);
		}
	}

	onMount(() => {
		if (window.L && !layerGroup) {
			layerGroup = window.L.layerGroup().addTo(map);
		}
	});

	onDestroy(() => {
		onclose();
	});

	const click_handler = () => bcast.emit('rqstOpen', 'menu');
	const click_handler_1 = pt => focusPoint(pt);

	return [
		statusText,
		typhoonListInfo,
		title,
		focusPoint,
		fetchCMATyphoonLive,
		onopen,
		onclose,
		click_handler,
		click_handler_1
	];
}

class Plugin extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { onopen: 5, onclose: 6 }, add_css);
	}

	get onopen() {
		return this.$$.ctx[5];
	}

	get onclose() {
		return this.$$.ctx[6];
	}
}


// transformCode: Export statement was modified
export { __pluginConfig, Plugin as default };
//# sourceMappingURL=plugin.js.map

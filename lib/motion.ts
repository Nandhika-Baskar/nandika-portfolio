"use client";

import { useEffect, useRef, type RefObject } from "react";

/* ============================================================================
   One motion engine for the whole page.

   A single requestAnimationFrame loop reads the pointer and the scroll
   position, smooths them, and hands the result to subscribers. The loop runs
   only while something is still settling (the pointer moved, the page
   scrolled) and stops on its own when everything is at rest. Continuous
   ambient motion (drift, rotation, twinkle) is plain CSS animation and costs
   no script at all.

   Element positions are measured once (and again on resize), so subscribers
   never read layout inside the frame: no layout thrash.
   ========================================================================== */

export type MotionState = {
  /** Smoothed scroll position, px */
  scroll: number;
  /** Raw scroll position, px */
  rawScroll: number;
  /** Viewport size, px */
  vw: number;
  vh: number;
  /** Smoothed pointer, -1..1 from the viewport centre */
  px: number;
  py: number;
  /** Scroll velocity, px per frame, smoothed */
  velocity: number;
  /** Last scroll direction: 1 down, -1 up */
  dir: 1 | -1;
  /** Raw pointer position in px, and whether a mouse is over the page */
  mx: number;
  my: number;
  mouse: boolean;
  /** Smoothed pointer in px, for things that should feel physical */
  sx: number;
  sy: number;
  reduced: boolean;
};

type Subscriber = (s: MotionState) => void;

const state: MotionState = {
  scroll: 0,
  rawScroll: 0,
  vw: 1,
  vh: 1,
  px: 0,
  py: 0,
  velocity: 0,
  dir: 1,
  mx: -9999,
  my: -9999,
  mouse: false,
  sx: -9999,
  sy: -9999,
  reduced: false,
};
const target = { px: 0, py: 0 };
const subscribers = new Set<Subscriber>();
const measurers = new Set<() => void>();
let raf = 0;
let running = false;
let started = false;
let reduced = false;
let awake = false;

/** Called from a subscriber that is still easing: keeps the loop alive one more frame. */
export function stayAwake() {
  awake = true;
}

function frame() {
  const prev = state.scroll;
  state.rawScroll = window.scrollY;
  state.scroll += (state.rawScroll - state.scroll) * 0.14;
  state.px += (target.px - state.px) * 0.06;
  state.py += (target.py - state.py) * 0.06;
  state.velocity += (state.scroll - prev - state.velocity) * 0.2;
  state.sx += (state.mx - state.sx) * 0.12;
  state.sy += (state.my - state.sy) * 0.12;
  setDir();

  awake = false;
  subscribers.forEach((fn) => fn(state));

  const settled =
    !awake &&
    Math.abs(state.rawScroll - state.scroll) < 0.4 &&
    Math.abs(target.px - state.px) < 0.001 &&
    Math.abs(target.py - state.py) < 0.001 &&
    Math.abs(state.velocity) < 0.05 &&
    Math.abs(state.mx - state.sx) + Math.abs(state.my - state.sy) < 0.3;
  if (settled) {
    state.scroll = state.rawScroll;
    state.velocity = 0;
    subscribers.forEach((fn) => fn(state));
    running = false;
    return;
  }
  raf = requestAnimationFrame(frame);
}

let lastRaw = 0;
function setDir() {
  const raw = window.scrollY;
  if (Math.abs(raw - lastRaw) > 2) {
    const d = raw > lastRaw ? 1 : -1;
    if (d !== state.dir) {
      state.dir = d;
      document.documentElement.dataset.scrollDir = d === 1 ? "down" : "up";
    }
    lastRaw = raw;
  }
}

/** Reduced motion: no smoothing and no loop, one update per scroll event. */
let pending = false;
function stepReduced() {
  if (pending) return;
  pending = true;
  requestAnimationFrame(() => {
    pending = false;
    state.scroll = state.rawScroll = window.scrollY;
    state.velocity = 0;
    setDir();
    subscribers.forEach((fn) => fn(state));
  });
}

function wake() {
  if (reduced) return stepReduced();
  if (running) return;
  running = true;
  raf = requestAnimationFrame(frame);
}

function measureAll() {
  state.vw = window.innerWidth;
  state.vh = window.innerHeight;
  measurers.forEach((m) => m());
  if (reduced) subscribers.forEach((fn) => fn(state));
  else wake();
}

function start() {
  if (started) return;
  started = true;
  reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  state.reduced = reduced;
  state.scroll = state.rawScroll = lastRaw = window.scrollY;
  document.documentElement.dataset.scrollDir = "down";
  state.vw = window.innerWidth;
  state.vh = window.innerHeight;

  window.addEventListener("scroll", wake, { passive: true });
  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "mouse") return;
      target.px = (e.clientX / state.vw) * 2 - 1;
      target.py = (e.clientY / state.vh) * 2 - 1;
      if (!state.mouse) {
        state.sx = e.clientX;
        state.sy = e.clientY;
      }
      state.mx = e.clientX;
      state.my = e.clientY;
      state.mouse = true;
      wake();
    },
    { passive: true },
  );
  // On touch, a tap lends the sky a cursor for a moment
  let touchTimer = 0;
  window.addEventListener(
    "pointerdown",
    (e) => {
      if (e.pointerType === "mouse") return;
      state.mx = state.sx = e.clientX;
      state.my = state.sy = e.clientY;
      state.mouse = true;
      wake();
      window.clearTimeout(touchTimer);
      touchTimer = window.setTimeout(() => {
        state.mouse = false;
        state.mx = state.my = state.sx = state.sy = -9999;
        wake();
      }, 1400);
    },
    { passive: true },
  );
  document.documentElement.addEventListener("pointerleave", () => {
    target.px = 0;
    target.py = 0;
    state.mx = state.my = state.sx = state.sy = -9999;
    state.mouse = false;
    wake();
  });
  window.addEventListener("resize", measureAll);
  // Content above can change height (fonts, an opened case study): re-measure.
  if ("ResizeObserver" in window) {
    let t = 0;
    new ResizeObserver(() => {
      window.clearTimeout(t);
      t = window.setTimeout(measureAll, 80);
    }).observe(document.body);
  }
  window
    .matchMedia("(prefers-reduced-motion: reduce)")
    .addEventListener("change", (e) => {
      reduced = e.matches;
      state.reduced = reduced;
      if (reduced) {
        cancelAnimationFrame(raf);
        running = false;
      }
      measureAll();
    });
}

/** Subscribe to every frame. The callback should only write (styles, attributes), never read layout. */
export function useMotion(fn: Subscriber, measure?: () => void) {
  const fnRef = useRef(fn);
  const measureRef = useRef(measure);
  fnRef.current = fn;
  measureRef.current = measure;
  useEffect(() => {
    start();
    const sub: Subscriber = (s) => fnRef.current(s);
    const meas = () => measureRef.current?.();
    subscribers.add(sub);
    measurers.add(meas);
    meas();
    sub(state);
    // A second measure after first paint catches late layout (fonts, images).
    const id = window.setTimeout(measureAll, 400);
    return () => {
      subscribers.delete(sub);
      measurers.delete(meas);
      window.clearTimeout(id);
    };
  }, []);
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/**
 * Measures a scene and writes its progress through the viewport to the
 * elements inside it marked [data-scroll] (and the scene itself, if marked):
 *   --p    0 when the scene's top meets the viewport bottom, 1 when its bottom leaves the top
 *   --e    0 → 1 as the scene enters (top moving from viewport bottom to top)
 *   --pin  0 → 1 across the distance a tall, sticky scene stays pinned
 *   --px / --py  the smoothed pointer, -1..1 (with { pointer: true })
 *
 * The properties are registered as non-inheriting (@property in globals.css)
 * and written only on the few elements that move, so a frame restyles those
 * elements and nothing beneath them.
 */
export function useScrollVars<T extends HTMLElement>(ref: RefObject<T | null>, opts: { pointer?: boolean } = {}) {
  const box = useRef({ top: 0, height: 1 });
  const targets = useRef<HTMLElement[]>([]);
  useMotion(
    (s) => {
      if (!ref.current || targets.current.length === 0) return;
      const { top, height } = box.current;
      const rel = top - s.scroll; // scene top relative to viewport top
      if (rel > s.vh * 1.2 || rel + height < -s.vh * 0.2) return; // off screen: skip
      const p = clamp((s.vh - rel) / (s.vh + height)).toFixed(4);
      const e = clamp((s.vh - rel) / s.vh).toFixed(4);
      const pin = (height > s.vh ? clamp(-rel / (height - s.vh)) : 0).toFixed(4);
      const px = s.px.toFixed(4);
      const py = s.py.toFixed(4);
      for (const el of targets.current) {
        el.style.setProperty("--p", p);
        el.style.setProperty("--e", e);
        el.style.setProperty("--pin", pin);
        if (opts.pointer) {
          el.style.setProperty("--px", px);
          el.style.setProperty("--py", py);
        }
      }
    },
    () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      box.current = { top: r.top + window.scrollY, height: r.height };
      const inner = Array.from(el.querySelectorAll<HTMLElement>("[data-scroll]"));
      targets.current = el.hasAttribute("data-scroll") ? [el, ...inner] : inner;
    },
  );
}

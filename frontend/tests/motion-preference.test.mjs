import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import {
  getReducedMotionSnapshot,
  getReducedMotionServerSnapshot,
  subscribeToReducedMotion,
  useReducedMotion,
} from "../src/lib/motion-preference.ts";

afterEach(() => { delete globalThis.window; });

test("renderização no servidor usa movimento reduzido sem acesso ao browser", () => {
  assert.equal(getReducedMotionServerSnapshot(), true);
  assert.equal(getReducedMotionSnapshot(), true);
  function Probe() { return createElement("span", null, String(useReducedMotion())); }
  assert.equal(renderToString(createElement(Probe)), "<span>true</span>");
});

test("snapshot acompanha alterações da preferência do utilizador", () => {
  const media = { matches: false };
  globalThis.window = { matchMedia: (query) => {
    assert.equal(query, "(prefers-reduced-motion: reduce)");
    return media;
  } };
  assert.equal(getReducedMotionSnapshot(), false);
  media.matches = true;
  assert.equal(getReducedMotionSnapshot(), true);
});

test("subscrição comunica alterações e remove o listener ao desmontar", () => {
  const listeners = new Set();
  globalThis.window = { matchMedia: () => ({
    addEventListener: (event, callback) => { assert.equal(event, "change"); listeners.add(callback); },
    removeEventListener: (event, callback) => { assert.equal(event, "change"); listeners.delete(callback); },
  }) };
  let calls = 0;
  const unsubscribe = subscribeToReducedMotion(() => calls++);
  listeners.forEach((listener) => listener());
  assert.equal(calls, 1);
  unsubscribe();
  assert.equal(listeners.size, 0);
});

test("SSR mantém o mesmo HTML mesmo que a preferência cliente seja diferente", () => {
  globalThis.window = { matchMedia: () => ({ matches: false }) };
  function Probe() { return createElement("span", null, String(useReducedMotion())); }
  assert.equal(renderToString(createElement(Probe)), "<span>true</span>");
});

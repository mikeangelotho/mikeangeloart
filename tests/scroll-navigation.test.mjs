import test from "node:test";
import assert from "node:assert/strict";
import { anchorDestination, decodeAnchor } from "../src/utils/scroll-navigation.ts";

test("anchor IDs decode spaces and unicode without requiring CSS selector escaping", () => {
  assert.equal(decodeAnchor("#custom%20mesh"), "custom mesh");
  assert.equal(decodeAnchor("#%E2%86%91"), "↑");
  assert.equal(decodeAnchor("#"), "");
  assert.equal(decodeAnchor("#literal%broken"), "literal%broken");
});

test("same-origin fragments retain route and query while external and ordinary links stay native", () => {
  const current = "https://mikeangelo.art/personal?view=all";
  const samePage = anchorDestination("#cruio", current);
  assert.equal(samePage.href, `${current}#cruio`);
  const crossRoute = anchorDestination("/personal#indigo", "https://mikeangelo.art/");
  assert.equal(crossRoute.pathname, "/personal");
  assert.equal(crossRoute.hash, "#indigo");
  assert.equal(anchorDestination("#", current).href, `${current}#`);
  assert.equal(anchorDestination("https://example.com/#cruio", current), undefined);
  assert.equal(anchorDestination("/projects?tags=Motion+Design", current), undefined);
  assert.equal(anchorDestination("mailto:hello@example.com#note", current), undefined);
  assert.equal(anchorDestination("https://[broken/#id", current), undefined);
});

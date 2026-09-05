import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const locales = ["pt", "en", "fr"];
const dicts = Object.fromEntries(
  locales.map((loc) => [
    loc,
    JSON.parse(readFileSync(new URL(`../messages/${loc}.json`, import.meta.url), "utf8")),
  ])
);

test("dicionários têm os mesmos namespaces", () => {
  const base = Object.keys(dicts.pt).sort();
  for (const loc of ["en", "fr"]) {
    assert.deepEqual(Object.keys(dicts[loc]).sort(), base, loc);
  }
});

test("cada namespace tem as mesmas chaves nos 3 idiomas", () => {
  for (const ns of Object.keys(dicts.pt)) {
    const base = Object.keys(dicts.pt[ns]).sort();
    assert.ok(base.length > 0, ns);
    for (const loc of ["en", "fr"]) {
      assert.deepEqual(Object.keys(dicts[loc][ns]).sort(), base, `${ns}/${loc}`);
    }
  }
});

test("sem strings vazias nem chaves duplicadas de prefixo", () => {
  for (const loc of locales) {
    for (const [ns, entries] of Object.entries(dicts[loc])) {
      for (const [key, value] of Object.entries(entries)) {
        assert.equal(typeof value, "string", `${loc}/${ns}/${key}`);
        assert.ok(value.length > 0, `${loc}/${ns}/${key}`);
      }
    }
  }
});

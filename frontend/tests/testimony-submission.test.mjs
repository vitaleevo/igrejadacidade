import assert from "node:assert/strict";
import test from "node:test";
import { prepareTestimony, submitTestimony, validateTestimonyMedia, MAX_MEDIA_BYTES } from "../src/lib/testimony-submission.ts";

function form() {
  const data = new FormData();
  for (const [key, value] of Object.entries({ full_name: "  Test Visitor  ", story: "This is a detailed test testimony for validation.", phone: " ", email: "", category: "Healing", allow_contact: "false", publication_consent: "internal" })) data.set(key, value);
  return data;
}

test("normaliza campos e preserva No e uso interno", () => {
  const payload = prepareTestimony(form());
  assert.equal(payload.get("full_name"), "Test Visitor");
  assert.equal(payload.get("allow_contact"), "false");
  assert.equal(payload.get("publication_consent"), "internal");
  assert.equal(payload.has("email"), false);
  assert.equal(payload.has("phone"), false);
  assert.equal(payload.has("media"), false);
});

test("preserva consentimento de publicação e contacto explícitos", () => {
  const data = form(); data.set("publication_consent", "publish"); data.set("allow_contact", "true");
  const result = prepareTestimony(data);
  assert.equal(result.get("publication_consent"), "publish");
  assert.equal(result.get("allow_contact"), "true");
});

for (const field of ["full_name", "story", "publication_consent", "allow_contact"]) {
  test(`rejeita ${field} em falta`, () => {
    const data = form(); data.delete(field);
    assert.throws(() => prepareTestimony(data));
  });
}

test("alinha tamanho, extensão e tipo de anexos com o servidor", () => {
  assert.equal(validateTestimonyMedia({ name: "photo.JPG", type: "image/jpeg", size: 128 }), null);
  assert.equal(validateTestimonyMedia({ name: "video.mov", type: "video/quicktime", size: 128 }), null);
  for (const file of [
    { name: "a.jpg", type: "image/jpeg", size: MAX_MEDIA_BYTES + 1 },
    { name: "a.jpg", type: "image/jpeg", size: 0 },
    { name: "a.svg", type: "image/svg+xml", size: 128 },
    { name: "a.jpg", type: "video/mp4", size: 128 },
    { name: "a.webm", type: "video/webm", size: 128 },
  ]) assert.equal(typeof validateTestimonyMedia(file), "string");
  const data = form(); data.set("media", new File(["sample"], "photo.jpg", { type: "image/jpeg" }));
  assert.equal(prepareTestimony(data).get("media").name, "photo.jpg");
});

test("pré-visualização nunca envia dados", async () => {
  let calls = 0;
  await assert.rejects(submitTestimony(form(), { preview: true, fetcher: async () => { calls++; return new Response(); } }), /approval preview/);
  assert.equal(calls, 0);
});

test("envio real usa multipart e só confirma criação com recibo", async () => {
  await submitTestimony(form(), { preview: false, fetcher: async (url, options) => {
    assert.equal(url, "/api/testimonies"); assert.equal(options.method, "POST");
    assert.ok(options.body instanceof FormData);
    assert.equal(options.body.get("allow_contact"), "false");
    return Response.json({ id: 12, status: "pending" }, { status: 201 });
  } });
});

for (const status of [400, 413, 422, 429, 500]) {
  test(`não confirma erro HTTP ${status}`, async () => {
    await assert.rejects(submitTestimony(form(), { preview: false, fetcher: async () => Response.json({ detail: [{ input: "sensitive" }] }, { status }) }), (error) => !error.message.includes("sensitive") && !error.message.includes("[object Object]"));
  });
}

test("não confirma resposta sem recibo nem falha de rede", async () => {
  for (const response of [new Response("not JSON", { status: 201 }), Response.json({ id: 12 }, { status: 200 }), Response.json({ id: "bad" }, { status: 201 })]) {
    await assert.rejects(submitTestimony(form(), { preview: false, fetcher: async () => response }), /could not confirm receipt/);
  }
  await assert.rejects(submitTestimony(form(), { preview: false, fetcher: async () => { throw new TypeError("network"); } }));
});

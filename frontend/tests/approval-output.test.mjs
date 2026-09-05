import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import test from "node:test";

const readPage = (route) => readFileSync(new URL(`../out/pt/${route ? `${route}/` : ""}index.html`, import.meta.url), "utf8");
const internalRoutes = ["sou-novo", "sobre", "sobre/equipa", "sobre/conectar", "assistir", "grupos", "ministerios", "ministerios/criancas", "eventos", "doar", "contacto", "testimonies", "privacidade", "termos", "oracao", "batismo", "casamento"];

test("todos os heroes internos mantêm imagens AI sem a legenda removida", () => {
  for (const route of internalRoutes) {
    const html = readPage(route);
    assert.doesNotMatch(html, /Imagem ilustrativa · IA/, route);
    assert.match(html, /\/images\/(worship-hero|community-families-ai|message-speaker-ai)\.webp/, route);
  }
});

test("Home está disponível nas três navegações da página principal", () => {
  const html = readPage("");
  assert.doesNotMatch(html, /Imagem ilustrativa · IA/);
  assert.ok((html.match(/>Home<\/[^>]+>/g) || []).length >= 3);
});

test("pré-visualização não recolhe testemunhos e pede não indexação", () => {
  const html = readPage("testimonies");
  assert.match(html, /Pré-visualização de aprovação — os envios estão desativados/);
  assert.match(html, /<form\b/);
  assert.match(html, /<button[^>]*type="submit"[^>]*disabled/);
  for (const field of ["full_name", "phone", "email", "story", "happened_at", "category", "media", "allow_contact", "publication_consent", "age_confirm"]) {
    assert.ok(html.includes(`name="${field}"`), field);
  }
  assert.match(html, /Prefiro que o meu testemunho seja usado apenas para fins internos/);
  assert.match(html, /Autorizo a igreja a publicar o meu testemunho nos seus canais oficiais/);
  assert.equal((html.match(/name="publication_consent"/g) || []).length, 2);
  assert.equal((html.match(/name="allow_contact"/g) || []).length, 2);
  assert.match(html, /noindex, nofollow/);
  assert.equal(existsSync(new URL("../out/api", import.meta.url)), false);
});

test("confirmação de demonstração é identificada e inclui o texto solicitado", () => {
  const html = readPage("testimonies/obrigado");
  assert.match(html, /Pré-visualização de confirmação — nenhum testemunho foi enviado/);
  assert.match(html, /Obrigado por partilhares o teu testemunho/);
  assert.match(html, /A nossa equipa vai revê-la/);
});

test("landing page de testemunhos liga o hero e o guia às secções do formulário", () => {
  const html = readPage("testimonies");
  assert.ok(html.includes('aria-labelledby="testimony-title"'));
  for (const anchor of ["testimony-form", "about-you", "your-story", "your-permission"]) {
    assert.ok(html.includes(`href="#${anchor}"`), anchor);
    assert.ok(html.includes(`id="${anchor}"`), anchor);
  }
  assert.ok(html.includes("Deus fez algo especial na tua vida?"));
  assert.ok(html.includes("Tu escolhes o que é partilhado"));
});

test("imagens dos heroes estão incluídas no pacote estático", () => {
  for (const name of ["worship-hero", "community-families-ai", "message-speaker-ai", "mobile-worship-ai"]) {
    assert.ok(existsSync(new URL(`../out/images/${name}.webp`, import.meta.url)), name);
  }
});

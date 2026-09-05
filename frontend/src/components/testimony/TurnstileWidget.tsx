"use client";

import { useEffect, useId, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      remove?: (widgetId: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * Cloudflare Turnstile anti-robô. Só renderiza quando a sitekey pública
 * está configurada; sem ela o formulário funciona sem verificação
 * (desenvolvimento / antes da ativação em produção).
 */
export function TurnstileWidget() {
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  useEffect(() => {
    if (!SITE_KEY || !boxRef.current) return;
    let widgetId: string | undefined;
    let cancelled = false;

    const render = () => {
      if (cancelled || !boxRef.current || !window.turnstile || widgetId) return;
      widgetId = window.turnstile.render(boxRef.current, {
        sitekey: SITE_KEY,
        theme: "light",
        callback: (token: string) => {
          if (inputRef.current) inputRef.current.value = token;
        },
        "expired-callback": () => {
          if (inputRef.current) inputRef.current.value = "";
        },
        "error-callback": () => {
          if (inputRef.current) inputRef.current.value = "";
        },
      });
    };

    if (window.turnstile) {
      render();
    } else {
      const script = document.querySelector('script[data-turnstile]') as HTMLScriptElement | null;
      const onLoad = () => render();
      if (script) {
        script.addEventListener("load", onLoad);
        // Caso o script já tenha carregado entre a query e o listener:
        render();
      } else {
        const el = document.createElement("script");
        el.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        el.async = true;
        el.defer = true;
        el.dataset.turnstile = "1";
        el.addEventListener("load", onLoad);
        document.head.appendChild(el);
      }
    }
    return () => {
      cancelled = true;
    };
  }, []);

  if (!SITE_KEY) return null;

  return (
    <div className="mt-2">
      <div ref={boxRef} id={`turnstile-${id}`} />
      <input ref={inputRef} type="hidden" name="cf-turnstile-response" defaultValue="" />
    </div>
  );
}

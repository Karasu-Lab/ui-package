'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

/**
 * Minimal surface of the Cloudflare Turnstile browser API
 * (https://challenges.cloudflare.com/turnstile/v0/api.js) that this
 * component uses. The script is loaded with `render=explicit`, so
 * widgets only appear where this component mounts.
 */
interface TurnstileApi {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let scriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  scriptPromise ??= new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error('Turnstile API loaded without window.turnstile'));
    };
    script.onerror = () => reject(new Error('Failed to load the Turnstile API'));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export interface TurnstileHandle {
  /**
   * Discards the current token and runs a fresh challenge. Tokens are
   * single-use: callers must reset after every submission attempt that
   * sent a token, before allowing a retry.
   */
  reset(): void;
}

export interface TurnstileProps {
  /** The widget's site key (public; safe to ship to the browser). */
  siteKey: string;
  /** Action name bound to the tokens this widget mints; the backend requires it to match the protected surface. */
  action?: string;
  /** Called with the fresh token when a challenge succeeds, and with null when it expires, errors, or is reset. */
  onTokenChange: (token: string | null) => void;
  className?: string;
}

/**
 * A Cloudflare Turnstile widget. Renders explicitly, retains its widget
 * id for reset/remove, and reports token changes through
 * `onTokenChange`; pair it with the imperative `reset()` from the ref
 * after each submission attempt.
 */
export const Turnstile = forwardRef<TurnstileHandle, TurnstileProps>(function Turnstile(
  { siteKey, action, onTokenChange, className },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const tokenCallbackRef = useRef(onTokenChange);
  tokenCallbackRef.current = onTokenChange;

  useEffect(() => {
    let cancelled = false;
    void loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !containerRef.current) return;
        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action,
          callback: (token: string) => tokenCallbackRef.current(token),
          'expired-callback': () => tokenCallbackRef.current(null),
          'error-callback': () => tokenCallbackRef.current(null),
        });
      })
      .catch(() => tokenCallbackRef.current(null));
    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    };
  }, [siteKey, action]);

  useImperativeHandle(ref, () => ({
    reset() {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
        tokenCallbackRef.current(null);
      }
    },
  }));

  return <div ref={containerRef} className={className} />;
});

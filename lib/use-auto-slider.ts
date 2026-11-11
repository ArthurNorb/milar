"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type TouchEvent,
  type TransitionEvent,
} from "react";

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

const noopSubscribe = () => () => {};

/**
 * Faixa horizontal com loop infinito: avança 1 item a cada `intervalMs`.
 * No desktop (md+) mostra `desktopVisible` itens; no mobile, 1.
 * Os primeiros `visible` itens são clonados no fim da faixa; ao chegar no
 * clone, a posição volta a 0 sem transição.
 *
 * `hydrated` é false no HTML do servidor e na hidratação (o servidor não sabe
 * a largura da tela). Enquanto for false, o componente deve usar classes
 * responsivas (ex.: `basis-full md:basis-1/3`) em vez das larguras inline.
 */
export function useAutoSlider(
  count: number,
  desktopVisible: number,
  intervalMs: number,
  desktopMinWidth = 768,
) {
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const isDesktop = useMediaQuery(`(min-width: ${desktopMinWidth}px)`);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const visible = isDesktop ? desktopVisible : 1;

  const active = count > visible;
  const total = active ? count + visible : count;

  const [idx, setIdx] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [prevVisible, setPrevVisible] = useState(visible);

  if (prevVisible !== visible) {
    setPrevVisible(visible);
    setIdx(0);
  }

  useEffect(() => {
    if (!active || paused || reducedMotion) return;
    const id = setTimeout(() => {
      setAnimate(true);
      setIdx((i) => (i >= count ? i : i + 1));
    }, intervalMs);
    return () => clearTimeout(id);
  }, [idx, active, paused, reducedMotion, count, intervalMs]);

  useEffect(() => {
    if (animate) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setAnimate(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [animate]);

  const jumping = useRef(false);

  const onTransitionEnd = useCallback(
    (e: TransitionEvent<HTMLElement>) => {
      if (e.target !== e.currentTarget) return;
      if (idx >= count) {
        setAnimate(false);
        setIdx(0);
      }
    },
    [idx, count],
  );

  const next = useCallback(() => {
    if (jumping.current) return;
    setAnimate(true);
    setIdx((i) => (i >= count ? i : i + 1));
  }, [count]);

  const prev = useCallback(() => {
    if (jumping.current) return;
    if (idx > 0) {
      setAnimate(true);
      setIdx(idx - 1);
      return;
    }
    // No início: salta (sem transição) para o clone do fim e anda 1 para trás.
    jumping.current = true;
    setAnimate(false);
    setIdx(count);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setAnimate(true);
        setIdx(count - 1);
        jumping.current = false;
      }),
    );
  }, [idx, count]);

  const goTo = useCallback((i: number) => {
    setAnimate(true);
    setIdx(i);
  }, []);

  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const swipeHandlers = {
    onTouchStart: (e: TouchEvent<HTMLElement>) => {
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY };
      setPaused(true);
    },
    onTouchEnd: (e: TouchEvent<HTMLElement>) => {
      setPaused(false);
      const start = touchStart.current;
      touchStart.current = null;
      if (!start || !active) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) next();
      else prev();
    },
    onTouchCancel: () => {
      touchStart.current = null;
      setPaused(false);
    },
  };

  return {
    hydrated,
    swipeHandlers,
    active,
    visible,
    total,
    idx: active ? idx : 0,
    animate,
    onTransitionEnd,
    goTo,
    next,
    prev,
    pause: () => setPaused(true),
    resume: () => setPaused(false),
  };
}

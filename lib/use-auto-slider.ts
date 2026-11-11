"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
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

/**
 * Faixa horizontal com loop infinito: avança 1 item a cada `intervalMs`.
 * No desktop (md+) mostra `desktopVisible` itens; no mobile, 1.
 * Os primeiros `visible` itens são clonados no fim da faixa; ao chegar no
 * clone, a posição volta a 0 sem transição.
 */
export function useAutoSlider(
  count: number,
  desktopVisible: number,
  intervalMs: number,
  desktopMinWidth = 768,
) {
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

  return {
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

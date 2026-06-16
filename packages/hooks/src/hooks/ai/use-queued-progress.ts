"use client";

import { useEffect, useRef, useState } from "react";

import type { AIProgressEvent } from "@repo/types";

const MIN_DISPLAY_MS = 300;

export function useQueuedProgress(
  latestEvent: AIProgressEvent | null,
  tick: number,
  active: boolean,
): AIProgressEvent | null {
  const [displayed, setDisplayed] = useState<AIProgressEvent | null>(null);
  const queueRef = useRef<AIProgressEvent[]>([]);
  const showingRef = useRef(false);
  const shownAtRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTickRef = useRef(0);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const scheduleNext = () => {
    clearTimer();

    if (queueRef.current.length === 0) {
      showingRef.current = false;
      if (!active) {
        setDisplayed(null);
      }
      return;
    }

    const next = queueRef.current.shift()!;
    showingRef.current = true;
    shownAtRef.current = Date.now();
    setDisplayed(next);

    timerRef.current = setTimeout(() => {
      scheduleNext();
    }, MIN_DISPLAY_MS);
  };

  useEffect(() => {
    if (tick === 0 || tick === lastTickRef.current || !latestEvent) {
      return;
    }

    lastTickRef.current = tick;
    queueRef.current.push(latestEvent);

    if (!showingRef.current) {
      scheduleNext();
      return;
    }

    const elapsed = Date.now() - shownAtRef.current;
    const remaining = Math.max(MIN_DISPLAY_MS - elapsed, 0);

    clearTimer();
    timerRef.current = setTimeout(() => {
      scheduleNext();
    }, remaining);
  }, [tick, latestEvent]);

  useEffect(() => {
    if (active) {
      return;
    }

    clearTimer();
    queueRef.current = [];
    showingRef.current = false;
    lastTickRef.current = 0;
    setDisplayed(null);
  }, [active]);

  useEffect(() => () => clearTimer(), []);

  return active ? displayed : null;
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const SUCCESS_TIMEOUT = 4000;

/**
 * Success/error status for the admin panels. Success messages clear themselves
 * after a few seconds; errors stay until the next attempt, since a message you
 * didn't finish reading is worse than one that lingers.
 */
export function useStatus() {
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const timerRef = useRef(null);

  // Cancel a pending clear if the component unmounts mid-countdown.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const clear = useCallback(() => {
    clearTimeout(timerRef.current);
    setStatus("");
  }, []);

  const showSuccess = useCallback((text) => {
    clearTimeout(timerRef.current);
    setIsError(false);
    setStatus(text);
    timerRef.current = setTimeout(() => setStatus(""), SUCCESS_TIMEOUT);
  }, []);

  const showError = useCallback((text) => {
    clearTimeout(timerRef.current);
    setIsError(true);
    setStatus(text);
  }, []);

  return { status, isError, showSuccess, showError, clear };
}

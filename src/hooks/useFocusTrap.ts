'use client';

import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface UseFocusTrapOptions {
  /** Whether the trap is currently active. */
  active: boolean;
  /** Callback when the user presses Escape. */
  onClose?: () => void;
  /** Whether to lock document body scrolling while active (defaults to true). */
  lockScroll?: boolean;
}

export function useFocusTrap<T extends HTMLElement = HTMLElement>({
  active,
  onClose,
  lockScroll = true,
}: UseFocusTrapOptions) {
  const containerRef = useRef<T | null>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  // Focus restoration and initial focus
  useEffect(() => {
    if (!active) return;

    if (typeof document !== 'undefined') {
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;
    }

    const container = containerRef.current;
    if (!container) return;

    // Focus either an element with data-autofocus or the first focusable element
    const initialElement =
      container.querySelector<HTMLElement>('[data-autofocus]') ||
      container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ||
      container;

    // Small delay to ensure render complete
    const timeoutId = window.setTimeout(() => {
      initialElement?.focus();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      // Restore focus on close / unmount
      if (previouslyFocusedElementRef.current && typeof previouslyFocusedElementRef.current.focus === 'function') {
        previouslyFocusedElementRef.current.focus();
      }
    };
  }, [active]);

  // Body scroll lock with clean state preservation
  useEffect(() => {
    if (!active || !lockScroll) return;
    if (typeof document === 'undefined') return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [active, lockScroll]);

  // Keyboard navigation: Tab / Shift+Tab trapping and Escape
  useEffect(() => {
    if (!active) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && onClose) {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const container = containerRef.current;
      if (!container) return;

      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => el.offsetParent !== null);

      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusables[0];
      const lastElement = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement || !container.contains(document.activeElement)) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement || !container.contains(document.activeElement)) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [active, onClose]);

  return containerRef;
}

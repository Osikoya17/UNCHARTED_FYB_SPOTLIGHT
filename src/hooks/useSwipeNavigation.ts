import { useRef, type TouchEvent as ReactTouchEvent } from "react";

/**
 * =============================================================================
 *  SWIPE NAVIGATION  —  step between students with a horizontal drag.
 * =============================================================================
 *  On touch screens the prev/next arrows are hidden (phones) or a long reach
 *  (tablets), so a left/right swipe across the card moves to the neighbouring
 *  student instead. The gesture is read on `touchend` from the start and end
 *  points — we never call preventDefault, so vertical page scrolling is left
 *  completely alone; a swipe only registers when the drag is clearly horizontal
 *  (dx beats dy) and long enough to be deliberate rather than a stray tap.
 *
 *  Swipe LEFT (flick the card away to the left)  → next student.
 *  Swipe RIGHT                                    → previous student.
 *  This matches the direction a photo gallery / carousel moves.
 * -----------------------------------------------------------------------------
 */

export interface UseSwipeNavigationOptions {
  /** Go to the next student. Omit to disable the left-swipe. */
  onNext?: () => void;
  /** Go to the previous student. Omit to disable the right-swipe. */
  onPrev?: () => void;
  /** Minimum horizontal travel (px) before a drag counts as a swipe. */
  threshold?: number;
}

export interface SwipeHandlers {
  onTouchStart: (event: ReactTouchEvent) => void;
  onTouchEnd: (event: ReactTouchEvent) => void;
}

export function useSwipeNavigation({
  onNext,
  onPrev,
  threshold = 45,
}: UseSwipeNavigationOptions): SwipeHandlers {
  // Where the current finger drag began; null between gestures.
  const start = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (event: ReactTouchEvent) => {
    // Only track single-finger drags — a second finger means pinch/zoom, not a
    // navigation swipe, so we bail out of tracking entirely.
    if (event.touches.length !== 1) {
      start.current = null;
      return;
    }
    const touch = event.touches[0];
    start.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event: ReactTouchEvent) => {
    const origin = start.current;
    start.current = null;
    if (!origin) return;

    const touch = event.changedTouches[0];
    if (!touch) return;

    const dx = touch.clientX - origin.x;
    const dy = touch.clientY - origin.y;

    // A deliberate, mostly-horizontal drag — otherwise it's a tap (too short) or
    // a vertical scroll (dy dominates), both of which we let pass through.
    if (Math.abs(dx) < threshold) return;
    if (Math.abs(dx) <= Math.abs(dy)) return;

    if (dx < 0) onNext?.();
    else onPrev?.();
  };

  return { onTouchStart, onTouchEnd };
}

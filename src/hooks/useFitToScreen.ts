import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

/**
 * =============================================================================
 *  FIT-TO-SCREEN  —  shrink a card just enough to fit the viewport height.
 * =============================================================================
 *  The amount of content is the variable here (one student writes a paragraph,
 *  the next writes a sentence), and CSS can't measure that — so we measure the
 *  rendered height in JS and, when it would overflow the screen, apply a single
 *  uniform `transform: scale()` so the whole card fits without the page
 *  scrolling. It's "continuous": every content swap, font load, and window
 *  resize re-runs the measurement.
 *
 *  Attach the two refs like this:
 *
 *      <div ref={outerRef}>        // reserves the SCALED height (no gap/scroll)
 *        <div ref={innerRef}>      // gets the transform; measured at true size
 *          …card…
 *        </div>
 *      </div>
 *
 *  Put the transform on an *inner* wrapper — not on the node you export — so the
 *  download (which clones that node into a detached stage) never inherits it.
 * -----------------------------------------------------------------------------
 */

export interface UseFitToScreenOptions {
  /**
   * Only fit at or above this viewport width (px). Below it the card keeps the
   * normal top-to-bottom scroll — squeezing a tall, narrow phone layout into a
   * short viewport would just make the text unreadable. Default 768 (md), i.e.
   * medium and large screens.
   */
  enableMinWidth?: number;
  /**
   * Never shrink past this scale. If a profile is so long it would need to go
   * smaller, we stop here and let the page scroll the remainder instead of
   * rendering it unreadably small. Default 0.6.
   */
  minScale?: number;
  /** Breathing room to leave below the card, in px. Default 32. */
  bottomGap?: number;
}

export interface UseFitToScreenResult {
  outerRef: RefObject<HTMLDivElement | null>;
  innerRef: RefObject<HTMLDivElement | null>;
  /** The scale currently applied (1 when the card fits or fitting is off). */
  scale: number;
}

export function useFitToScreen({
  enableMinWidth = 768,
  minScale = 0.6,
  bottomGap = 32,
}: UseFitToScreenOptions = {}): UseFitToScreenResult {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const frame = useRef<number | null>(null);
  const [scale, setScale] = useState(1);

  const measure = useCallback(() => {
    const inner = innerRef.current;
    const outer = outerRef.current;
    if (!inner || !outer) return;

    // Below the threshold, hand the layout back to normal flow + scrolling.
    if (window.innerWidth < enableMinWidth) {
      setScale((prev) => (prev === 1 ? prev : 1));
      return;
    }

    // offsetHeight is the *layout* height, which a CSS transform never affects —
    // so we read the true, unscaled height without first undoing the current
    // scale, and there's no feedback loop from our own writes.
    const natural = inner.offsetHeight;
    if (natural === 0) return;

    // Document-relative top (add scrollY) so the answer doesn't drift while the
    // page is scrolled: we always fit as if the card sat at the very top.
    const docTop = outer.getBoundingClientRect().top + window.scrollY;
    const available = window.innerHeight - docTop - bottomGap;

    const raw = available / natural;
    // Shrink to fit — but never enlarge, and never below the floor. Past the
    // floor the overflow becomes an ordinary page scroll.
    const next = raw >= 1 ? 1 : Math.max(raw, minScale);

    // Ignore sub-pixel churn so a scrollbar blinking in/out can't oscillate.
    setScale((prev) => (Math.abs(prev - next) < 0.005 ? prev : next));
  }, [enableMinWidth, minScale, bottomGap]);

  const schedule = useCallback(() => {
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      measure();
    });
  }, [measure]);

  // Push the scale to the DOM. Setting the outer's height to the *scaled* height
  // stops the page from reserving the full, unscaled box — which is what would
  // otherwise leave a gap (or an extra scroll) below the card.
  useLayoutEffect(() => {
    const inner = innerRef.current;
    const outer = outerRef.current;
    if (!inner || !outer) return;

    if (scale >= 1) {
      inner.style.transform = "";
      inner.style.transformOrigin = "";
      outer.style.height = "";
    } else {
      inner.style.transformOrigin = "top center";
      inner.style.transform = `scale(${scale})`;
      outer.style.height = `${Math.round(inner.offsetHeight * scale)}px`;
    }
  }, [scale]);

  useLayoutEffect(() => {
    // Measure once, synchronously, before the browser paints — so the card
    // never flashes at full size before snapping to its fitted scale.
    measure();

    // Content height changes (a different student, a longer answer, wrapping)
    // are caught here; viewport changes by the resize listener.
    const observer = new ResizeObserver(schedule);
    if (innerRef.current) observer.observe(innerRef.current);

    window.addEventListener("resize", schedule);

    // Web fonts arrive after first paint and shift text height when they do.
    let cancelled = false;
    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        if (!cancelled) schedule();
      });
    }

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [measure, schedule]);

  return { outerRef, innerRef, scale };
}

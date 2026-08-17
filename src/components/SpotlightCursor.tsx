"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_DIAMETER = 16; // px — resting size away from any text
const ZOOM = 1.6;
// Matches the 0.3lh clip radius in globals.css (times this same
// ZOOM) — see that rule for why the circle is deliberately kept close
// to one line's height instead of the full multi-line span it used to
// cover.
const CLIP_RADIUS_LH = 0.3;
// Flat +3px on top of the lh-based radius, kept in sync with the
// matching `+ 3px` in globals.css's clip-path — both the always-
// visible dot below and the magnified-text clip above have to grow by
// the same amount or their edges drift apart (the "pink cutting out"
// bug the clip-path comment describes, from an earlier size mismatch
// between these two).
const EXTRA_RADIUS_PX = 3;

// Any of these tags, once they're a leaf (no element children of
// their own) with real text in them, gets the effect — not just a
// handful of components pre-wrapped in <SpotlightText>. Walking up
// from the actual event target with .closest()-like logic already
// lands on the right leaf for ordinary nested markup (e.g. an <a>
// wrapping a <span> resolves to that inner <span>, not the whole
// link).
const TEXT_TAGS = new Set([
  "P", "SPAN", "A", "LI", "BUTTON", "LABEL",
  "H1", "H2", "H3", "H4", "H5", "H6",
  "TD", "TH", "DT", "DD", "BLOCKQUOTE", "STRONG", "EM",
]);

function findTextElement(target: EventTarget | null): HTMLElement | null {
  let el = target as HTMLElement | null;
  while (el && el !== document.body) {
    if (TEXT_TAGS.has(el.tagName) && el.children.length === 0 && (el.textContent ?? "").trim()) {
      // .spotlight-text sets position:relative. That's a no-op for an
      // element the page already made position:relative (the common
      // case for headers/buttons that use `relative` for their own
      // hover effects or absolutely-positioned decoration) — safe to
      // auto-tag. It's only unsafe for absolute/fixed/sticky elements,
      // where forcing relative would actually change how the page
      // placed them (e.g. the phone dial's digit badges, which rely on
      // being absolutely positioned within a parent).
      const position = getComputedStyle(el).position;
      if (position === "static" || position === "relative") return el;
      return null;
    }
    el = el.parentElement;
  }
  return null;
}

type CaretDocument = Document & {
  caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
  caretRangeFromPoint?: (x: number, y: number) => Range | null;
};

// findTextElement above only checks whether the cursor is somewhere
// inside a *leaf element's rectangular bounding box* — which for a
// large headline (the Hero name, at text-7xl) has generous line-height
// well beyond the actual glyphs, so the circle was widening over
// visibly empty space above/below the letters, and jumping size
// inconsistently between that and the much smaller "Hi, I'm" line
// right next to it. This does a real hit-test against the nearest
// actual character's own tight bounding box instead, so "wide" only
// ever means the pixel is actually on rendered text.
function isNearGlyph(x: number, y: number, container: HTMLElement): boolean {
  const doc = document as CaretDocument;
  let node: Node | null = null;
  let offset = 0;
  if (doc.caretPositionFromPoint) {
    const pos = doc.caretPositionFromPoint(x, y);
    if (!pos) return false;
    node = pos.offsetNode;
    offset = pos.offset;
  } else if (doc.caretRangeFromPoint) {
    const range = doc.caretRangeFromPoint(x, y);
    if (!range) return false;
    node = range.startContainer;
    offset = range.startOffset;
  } else {
    return true; // Neither API available — fall back to the old bounding-box behavior.
  }
  if (!node || node.nodeType !== Node.TEXT_NODE || !container.contains(node)) return false;
  const text = node.textContent ?? "";
  const charOffset = Math.min(offset, text.length - 1);
  if (charOffset < 0 || !text[charOffset]?.trim()) return false;

  const charRange = document.createRange();
  charRange.setStart(node, charOffset);
  charRange.setEnd(node, charOffset + 1);
  const rect = charRange.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return false;

  const pad = 3; // small forgiveness margin, px — a hard pixel-perfect edge felt twitchy.
  return x >= rect.left - pad && x <= rect.right + pad && y >= rect.top - pad && y <= rect.bottom + pad;
}

export default function SpotlightCursor() {
  const [pos, setPos] = useState({ x: -999, y: -999 });
  const [diameter, setDiameter] = useState(DEFAULT_DIAMETER);
  const activeElRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const clearActive = () => {
      const el = activeElRef.current;
      if (!el) return;
      el.style.removeProperty("--spotlight-local-x");
      el.style.removeProperty("--spotlight-local-y");
      el.style.removeProperty("--spotlight-zoom");
      // Elements not authored with <SpotlightText> got the class/attr
      // added on the way in below — undo that too, or an auto-tagged
      // element would keep reporting as spotlight-text (with a now-
      // stale data-text) for the rest of the page's life.
      if (el.dataset.spotlightAuto) {
        el.classList.remove("spotlight-text");
        el.removeAttribute("data-text");
        delete el.dataset.spotlightAuto;
      }
      activeElRef.current = null;
    };

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      const candidate = findTextElement(e.target);
      const el = candidate && isNearGlyph(e.clientX, e.clientY, candidate) ? candidate : null;
      if (el !== activeElRef.current) {
        clearActive();
        activeElRef.current = el;
        if (el && !el.classList.contains("spotlight-text")) {
          el.classList.add("spotlight-text");
          el.setAttribute("data-text", el.textContent ?? "");
          el.dataset.spotlightAuto = "1";
        }
      }
      if (!el) {
        setDiameter(DEFAULT_DIAMETER);
        return;
      }

      const rect = el.getBoundingClientRect();
      el.style.setProperty("--spotlight-local-x", `${e.clientX - rect.left}px`);
      el.style.setProperty("--spotlight-local-y", `${e.clientY - rect.top}px`);
      el.style.setProperty("--spotlight-zoom", String(ZOOM));

      // 1.5lh in the CSS used to be relative to *that* element's
      // line-height — the visible circle has to be computed the same
      // way per element instead of one fixed size, or it'd only ever
      // match whichever text size was used to pick an initial fixed
      // pixel value.
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      if (!Number.isNaN(lineHeight)) setDiameter((lineHeight * CLIP_RADIUS_LH + EXTRA_RADIUS_PX) * 2 * ZOOM);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      clearActive();
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500 transition-[width,height] duration-150"
      style={{
        left: pos.x,
        top: pos.y,
        width: diameter,
        height: diameter,
        boxShadow: "0 0 6px 1px rgba(236,72,153,0.6)",
      }}
    />
  );
}

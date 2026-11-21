import { Children, Fragment, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

/**
 * Splits text into masked word spans *in React* (works in Server Components).
 *
 * Animations then only transform these spans — they never restructure the
 * DOM — so React stays the sole owner of every node. (Runtime splitters like
 * GSAP SplitText rewrite React-owned text and cause "removeChild /
 * insertBefore: not a child of this node" errors on re-render or navigation.)
 *
 *   <h2 data-split><Words>Gather with <em>us.</em></Words></h2>
 */
const INLINE = new Set(["em", "strong", "span", "b", "i", "mark"]);

function split(node: ReactNode, key: string): ReactNode {
  if (typeof node === "string" || typeof node === "number") {
    return String(node)
      .split(/(\s+)/)
      .map((part, i) =>
        part === "" || /^\s+$/.test(part) ? (
          part
        ) : (
          <span key={`${key}-${i}`} className="sw">
            <span className="sw-i">{part}</span>
          </span>
        ),
      );
  }
  if (Array.isArray(node)) return node.map((child, i) => split(child, `${key}.${i}`));
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    if (el.type === Fragment) return split(Children.toArray(el.props.children), key);
    if (typeof el.type === "string" && INLINE.has(el.type) && el.props.children != null) {
      return cloneElement(el, { key: el.key ?? key }, split(el.props.children, key));
    }
  }
  return node;
}

export function Words({ children }: { children: ReactNode }) {
  return <>{split(children, "w")}</>;
}

/** Groups word spans by rendered line, for line-by-line choreography. */
export function lineIndexes(words: HTMLElement[]) {
  const tops: number[] = [];
  return words.map((w) => {
    const top = Math.round((w.parentElement ?? w).getBoundingClientRect().top);
    let idx = tops.findIndex((t) => Math.abs(t - top) < 4);
    if (idx === -1) idx = tops.push(top) - 1;
    return idx;
  });
}

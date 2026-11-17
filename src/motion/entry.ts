import { ScrollTrigger } from './MotionConfig'

// Runs once per document, before React renders (index.html already did the earliest part).
//
// A reload (F5, Ctrl+R, the browser's refresh button) must always restart the
// experience at the home with the opening — wherever the reader was. The browser
// would otherwise restore the old scroll offset (and keep #section in the URL),
// leaving scroll-driven scenes, Lenis and ScrollTrigger mid-way.
//
// In-page navigation (anchors, history within the page) never reloads the
// document, so it never replays the opening. A first visit through a shared
// deep link (e.g. /#pilares) is not a reload and still lands on that section.
export function isReload() {
  const entry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  return entry?.type === 'reload'
}

export function prepareEntry() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  // ScrollTrigger re-applies the value it captured at import on every refresh;
  // pin it to 'manual' so a later refresh can never re-enable restoration.
  ScrollTrigger.clearScrollMemory('manual')
  if (isReload() && location.hash) history.replaceState(history.state, '', location.pathname + location.search)
  if (!location.hash) window.scrollTo(0, 0)
}

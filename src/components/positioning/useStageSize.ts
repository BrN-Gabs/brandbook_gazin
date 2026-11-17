import { useLayoutEffect, useState, type RefObject } from 'react'

/**
 * Pixel size of a diagram's stage. The diagrams describe positions in % of the stage and
 * draw their SVG lines in real pixels, so strokes and the "drawing" dash animations stay
 * exact at any aspect ratio (no stretched viewBox).
 */
export function useStageSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 })
  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const measure = () => setSize(previous => {
      const width = element.clientWidth, height = element.clientHeight
      return previous.width === width && previous.height === height ? previous : { width, height }
    })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])
  return size
}

/** Cubic path from points given in % of the stage: [start, control 1, control 2, end]. */
export const percentPath = (points: [number, number][], { width, height }: { width: number; height: number }) => {
  const [start, c1, c2, end] = points.map(([x, y]) => `${(x / 100 * width).toFixed(1)} ${(y / 100 * height).toFixed(1)}`)
  return `M ${start} C ${c1}, ${c2}, ${end}`
}

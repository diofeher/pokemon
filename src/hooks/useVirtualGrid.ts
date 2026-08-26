import { useState, useCallback, useEffect, useRef } from "react";

interface VirtualGridConfig {
  totalItems: number;
  rowHeight: number;
  gap: number;
  minColumnWidth: number;
  overscan?: number;
}

interface VirtualGridResult {
  containerRef: React.RefObject<HTMLDivElement | null>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  visibleRange: { start: number; end: number };
  totalHeight: number;
  offsetY: number;
  columns: number;
}

/**
 * Virtual scrolling for a CSS grid with auto-fill columns.
 * Computes visible row range from scroll position and container width.
 */
export function useVirtualGrid({
  totalItems,
  rowHeight,
  gap,
  minColumnWidth,
  overscan = 3,
}: VirtualGridConfig): VirtualGridResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(3);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(600);

  // Track container width to compute column count
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateColumns = () => {
      const width = el.clientWidth;
      // Match CSS: repeat(auto-fill, minmax(minColumnWidth, 1fr))
      const cols = Math.max(1, Math.floor((width + gap) / (minColumnWidth + gap)));
      setColumns(cols);
    };

    updateColumns();
    const observer = new ResizeObserver(updateColumns);
    observer.observe(el);
    return () => observer.disconnect();
  }, [gap, minColumnWidth]);

  // Track scroll position
  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      setScrollTop(el.scrollTop);
      setViewportHeight(el.clientHeight);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setViewportHeight(el.clientHeight);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const totalRows = Math.ceil(totalItems / columns);
  const totalHeight = totalRows * (rowHeight + gap) - gap;

  const rowHeightWithGap = rowHeight + gap;
  const startRow = Math.max(0, Math.floor(scrollTop / rowHeightWithGap) - overscan);
  const endRow = Math.min(
    totalRows,
    Math.ceil((scrollTop + viewportHeight) / rowHeightWithGap) + overscan
  );

  const startIndex = startRow * columns;
  const endIndex = Math.min(totalItems, endRow * columns);
  const offsetY = startRow * rowHeightWithGap;

  return {
    containerRef,
    scrollRef,
    visibleRange: { start: startIndex, end: endIndex },
    totalHeight,
    offsetY,
    columns,
  };
}

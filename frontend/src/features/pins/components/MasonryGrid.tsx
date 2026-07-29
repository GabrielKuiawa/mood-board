import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import type { Pin } from "../types";
import { PinCard } from "./PinCard";
import { PinCardSkeleton } from "./PinCardSkeleton";

const minimumColumnWidth = 230;
const columnGap = 16;

type MasonryGridProps = {
  pins: Pin[];
  skeletonCount?: number;
  busy?: boolean;
};

type MasonryItem = {
  key: string;
  content: ReactNode;
};

function getColumnCount(containerWidth: number): number {
  return Math.max(
    1,
    Math.floor((containerWidth + columnGap) / (minimumColumnWidth + columnGap)),
  );
}

export function MasonryGrid({
  pins,
  skeletonCount = 0,
  busy = false,
}: MasonryGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(1);
  const [scrollMargin, setScrollMargin] = useState(0);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const updateGridMeasurements = (width: number) => {
      setColumnCount(getColumnCount(width));
      setScrollMargin(grid.getBoundingClientRect().top + window.scrollY);
    };

    updateGridMeasurements(grid.clientWidth);

    const resizeObserver = new ResizeObserver(([entry]) => {
      updateGridMeasurements(entry.contentRect.width);
    });

    resizeObserver.observe(grid);
    return () => resizeObserver.disconnect();
  }, []);

  const items = useMemo<MasonryItem[]>(
    () => [
      ...pins.map((pin, index) => ({
        key: pin.id,
        content: <PinCard pin={pin} index={index} />,
      })),
      ...Array.from({ length: skeletonCount }, (_, index) => ({
        key: `skeleton-${pins.length + index}`,
        content: <PinCardSkeleton />,
      })),
    ],
    [pins, skeletonCount],
  );

  const getItemKey = useCallback(
    (index: number) => items[index]?.key ?? index,
    [items],
  );

  const virtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: () => 320,
    getItemKey,
    gap: 20,
    lanes: columnCount,
    overscan: 3,
    scrollMargin,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const itemWidth = `calc(${100 / columnCount}% - ${
    ((columnCount - 1) * columnGap) / columnCount
  }px)`;

  return (
    <div className="w-full px-4 py-3">
      <div
        ref={gridRef}
        aria-busy={busy}
        className="relative w-full"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualItems.map((virtualItem) => {
          const item = items[virtualItem.index];
          if (!item) return null;

          return (
            <div
              key={item.key}
              ref={virtualizer.measureElement}
              data-index={virtualItem.index}
              className="absolute top-0 min-w-0"
              style={{
                left: `calc(${(virtualItem.lane * 100) / columnCount}% + ${
                  (virtualItem.lane * columnGap) / columnCount
                }px)`,
                transform: `translateY(${virtualItem.start - scrollMargin}px)`,
                width: itemWidth,
              }}
            >
              {item.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import type { Pin } from "../types";
import { PinCard } from "./PinCard";
import { PinCardSkeleton } from "./PinCardSkeleton";

const desktopMinimumColumnWidth = 230;
const desktopColumnGap = 16;
const mobileColumnGap = 8;
const mobileBreakpoint = 640;

type MasonryGridProps = {
  pins: Pin[];
  skeletonCount?: number;
  busy?: boolean;
};

type MasonryItem = {
  key: string;
  content: ReactNode;
};

function getGridLayout(containerWidth: number): {
  columnCount: number;
  columnGap: number;
} {
  if (containerWidth < mobileBreakpoint) {
    return {
      columnCount: containerWidth >= 300 ? 2 : 1,
      columnGap: mobileColumnGap,
    };
  }

  return {
    columnCount: Math.max(
      1,
      Math.floor(
        (containerWidth + desktopColumnGap) /
          (desktopMinimumColumnWidth + desktopColumnGap),
      ),
    ),
    columnGap: desktopColumnGap,
  };
}

export function MasonryGrid({
  pins,
  skeletonCount = 0,
  busy = false,
}: MasonryGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(1);
  const [columnGap, setColumnGap] = useState(mobileColumnGap);
  const [scrollMargin, setScrollMargin] = useState(0);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const updateGridMeasurements = (width: number) => {
      const layout = getGridLayout(width);
      setColumnCount(layout.columnCount);
      setColumnGap(layout.columnGap);
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
    gap: columnGap,
    lanes: columnCount,
    overscan: 3,
    scrollMargin,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const itemWidth = `calc(${100 / columnCount}% - ${
    ((columnCount - 1) * columnGap) / columnCount
  }px)`;

  return (
    <div className="w-full px-3 py-3 sm:px-4">
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

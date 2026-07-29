import type { Pin } from "../types";
import { MasonryGrid } from "./MasonryGrid";

type PinListProps = {
  pins: Pin[];
  isLoadingMore?: boolean;
  loadingCount?: number;
};

export function PinList({
  pins,
  isLoadingMore = false,
  loadingCount = 20,
}: PinListProps) {
  return (
    <MasonryGrid
      pins={pins}
      skeletonCount={isLoadingMore ? loadingCount : 0}
      busy={isLoadingMore}
    />
  );
}

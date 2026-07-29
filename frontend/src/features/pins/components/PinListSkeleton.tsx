import { MasonryGrid } from "./MasonryGrid";

type PinListSkeletonProps = {
  count?: number;
};

export function PinListSkeleton({ count = 20 }: PinListSkeletonProps) {
  return (
    <div aria-label="Carregando Pins">
      <MasonryGrid pins={[]} skeletonCount={count} busy />
    </div>
  );
}

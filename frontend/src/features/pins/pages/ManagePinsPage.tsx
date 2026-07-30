import { PageFeedback } from "@/components/shared/PageFeedback";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import { CreatedPinsSection } from "../components/CreatedPinsSection";

export function ManagePinsPage() {
  const { data: currentUser, isError, isPending } = useCurrentUserQuery();

  if (isPending) {
    return <PageFeedback>Carregando seus Pins...</PageFeedback>;
  }

  if (isError || !currentUser) {
    return (
      <PageFeedback variant="error">
        Não foi possível carregar seus Pins.
      </PageFeedback>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
      <CreatedPinsSection
        userId={currentUser.id}
        readOnly={currentUser.readOnly}
      />
    </main>
  );
}

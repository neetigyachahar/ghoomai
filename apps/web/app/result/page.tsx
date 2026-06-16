"use client";

import { AiResultScreen } from "@repo/widgets/screens/ai-flow";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-dvh w-full flex-1 flex-col">
      <AiResultScreen onNavigateBack={() => router.replace("/")} />
    </main>
  );
}

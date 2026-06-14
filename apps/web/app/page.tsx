"use client";

import { AiPromptScreen } from "@repo/widgets/screens/ai-flow";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-dvh w-full flex-1">
      <AiPromptScreen onNavigateToResult={() => router.push("/result")} />
    </main>
  );
}

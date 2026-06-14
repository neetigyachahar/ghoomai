"use client";

import { AiPromptScreen } from "@repo/widgets/screens/ai-flow";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-8">
      <AiPromptScreen onNavigateToResult={() => router.push("/result")} />
    </main>
  );
}

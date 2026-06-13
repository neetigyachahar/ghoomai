"use client";

import { Button } from "@repo/ui/button";

export function DemoButton() {
  return (
    <Button onPress={() => alert("Hello from @repo/ui (web)!")}>
      Shared UI Button
    </Button>
  );
}

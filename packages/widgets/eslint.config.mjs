import { config } from "@repo/eslint-config/react-internal";

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@repo/hooks/context/*", "**/hooks/src/context/*"],
              message:
                "Widgets must not import context directly. Use hooks from @repo/hooks/<feature> instead.",
            },
          ],
        },
      ],
    },
  },
];

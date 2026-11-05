import { defineConfig, devices } from "@playwright/experimental-ct-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    testDir: "./src/components",
    testMatch: "**/*.spec.tsx",
    timeout: 10 * 1000,
    fullyParallel: true,
    reporter: "list",
    use: {
        trace: "on-first-retry",
        ctViteConfig: {
            plugins: [tailwindcss()],
        },
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
});

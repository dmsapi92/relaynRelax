import { vitePlugin as remix } from "@remix-run/dev";
import { flatRoutes } from "remix-flat-routes";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
      },
      ignoredRouteFiles: ["**/.*"],
      routes: async (defineRoutes) => {
        return flatRoutes("routes", defineRoutes);
      },
      appDirectory: "app",
      serverModuleFormat: "esm",
    }),
    tsconfigPaths(),
  ],
  server: {
    port: 5173,
    host: true,
    allowedHosts: ["dioscschool.zapto.org"],
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    "process.env": JSON.stringify({}),
    process: {
      env: {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    },
  },
  // test: {
  //   include: ["./app/**/*.test.{ts,tsx}"],
  //   globals: true,
  //   environment: "jsdom",
  //   restoreMocks: true,
  //   setupFiles: ["./test/setup-test-env.ts"],
  //   coverage: {
  //     include: ["app/**/*.{ts,tsx}"],
  //     all: true,
  //   },
  //   css: true,
  //   reporters: ["verbose"],
  //   deps: {
  //     inline: ["@remix-run/react"],
  //   },
  // },
});

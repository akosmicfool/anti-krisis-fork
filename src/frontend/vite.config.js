import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import environment from "vite-plugin-environment";

const ii_url =
  process.env.DFX_NETWORK === "local"
    ? `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:8081/`
    : `https://identity.internetcomputer.org/`;

process.env.II_URL = process.env.II_URL || ii_url;
process.env.STORAGE_GATEWAY_URL =
  process.env.STORAGE_GATEWAY_URL || "https://blob.caffeine.ai";

// The Caffeine CLI uploads pre-built code, so the real backend canister ID and
// host are not present in the shell when `vite build` runs. The platform instead
// provides them as environment variables at build/deploy time. The post-build
// `copy:env` step copies the source env.json verbatim into dist/, so this plugin
// fills the source env.json template with the platform-provided values during
// the build. That way the runtime config loader (which reads /env.json) no longer
// sees the literal "undefined" placeholders and no longer throws
// "CANISTER_ID_BACKEND is not set". Source env.json keeps placeholder values;
// real values are substituted here only when the platform provides them.
function resolveEnvJson() {
  const envPath = fileURLToPath(new URL("./env.json", import.meta.url));
  const config = JSON.parse(readFileSync(envPath, "utf8"));

  const first = (...names) => {
    for (const name of names) {
      const value = process.env[name];
      if (value && value !== "undefined" && value.trim() !== "") return value;
    }
    return undefined;
  };

  const substitutions = [
    ["backend_canister_id", first("CANISTER_ID_BACKEND", "BACKEND_CANISTER_ID")],
    ["backend_host", first("BACKEND_HOST", "IC_HOST", "DFX_HOST")],
    ["ii_derivation_origin", first("II_DERIVATION_ORIGIN", "II_URL")],
  ];

  let changed = false;
  for (const [field, value] of substitutions) {
    if (value !== undefined && config[field] !== value) {
      config[field] = value;
      changed = true;
    }
  }

  if (changed) {
    writeFileSync(envPath, `${JSON.stringify(config, null, 2)}\n`);
  }
}

function envJsonPlugin() {
  return {
    name: "caffeine-resolve-env-json",
    closeBundle() {
      resolveEnvJson();
    },
  };
}

export default defineConfig({
  logLevel: "error",
  build: {
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
  },
  css: {
    postcss: "./postcss.config.js",
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
    environment(["II_URL"]),
    environment(["STORAGE_GATEWAY_URL"]),
    envJsonPlugin(),
    react(),
  ],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
    dedupe: ["@dfinity/agent"]
  },
});

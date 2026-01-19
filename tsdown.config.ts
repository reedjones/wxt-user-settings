import { defineConfig } from "tsdown";
import * as vite from "vite";

const basePath = "modules/user-settings";

export default defineConfig({
    entry: {
        index: `${basePath}/index.ts`,
        plugin: `${basePath}/plugin.ts`,
    },
    define: {
        "process.env.NPM": "true",
    },
    onSuccess: prebuildEntrypoints,
});

// Prebuild entrypoints
async function prebuildEntrypoints() {
    await vite.build({
        root: basePath,
        build: {
            emptyOutDir: false,
            rollupOptions: {
                input: `${basePath}/example-prebuilt.html`,
                external: ['fsevents'],
                output: {
                    dir: "dist/prebuilt",
                },
            },
        },
    });
}
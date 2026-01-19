# wxt-user-settings

A custom WXT module for user settings.

## Install

```bash
npm install wxt-user-settings
```

## Usage

Then add the module to your wxt.config.ts file:

```
export default defineConfig({
  modules: ["my-module"],
})
```

```ts
import { createUserSettingsModule } from "wxt-user-settings";

const settings = createUserSettingsModule({
  storageArea: "local",
  keyPrefix: "my-ext:"
});

await settings.define({ key: "theme", defaultValue: "light" });
const theme = await settings.get("theme", "light");
await settings.set("theme", "dark");
```

## Notes

- Update `package.json` `name`, `repository`, and `version` before publishing.
- This scaffold is framework-agnostic and can be wired into WXT modules as needed.

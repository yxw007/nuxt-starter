import { fileURLToPath } from "url";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  alias: {
    "~": fileURLToPath(new URL('./', import.meta.url)),
  },
  plugins: [
    "~/plugins/directive.ts"
  ]
})

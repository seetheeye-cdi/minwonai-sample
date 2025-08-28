import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "ko"],

  // Used when no locale matches
  defaultLocale: "ko",

  // Always show locale prefix to avoid routing issues
  localePrefix: "always",
});

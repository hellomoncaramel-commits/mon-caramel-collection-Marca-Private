// Single place for the production domain — used both client-side
// (utils/meta.js, ProductDetailSheet.jsx's share()) and at build time
// (scripts/generate-static-pages.mjs, for canonical/og:url/og:image/
// sitemap.xml). Confirmed production domain: moncaramel.ca.
export const SITE_URL = "https://moncaramel.ca";

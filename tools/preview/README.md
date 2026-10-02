# Static preview build

Not part of the Next.js app. It renders the same `HomePage` component with
React, esbuild and the Tailwind 4 compiler, for environments where Next.js
cannot be installed, and to publish a static preview. `npm run build` is the
real build; use this only if you need the preview.

    node tools/preview/build.mjs   # writes dist/preview

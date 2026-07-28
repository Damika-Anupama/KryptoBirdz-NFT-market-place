// Updated in each wave-close commit, alongside public/build.json.
// The live-deploy check curls build.json and asserts the wave number,
// proving the deploy actually propagated to GitHub Pages.
export const BUILD_INFO = {
  wave: 0,
  deployedAt: "2026-07-27",
} as const;

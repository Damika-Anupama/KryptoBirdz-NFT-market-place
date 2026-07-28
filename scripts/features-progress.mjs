// Computes the FEATURES.md index table from the features/*.md catalog files.
// Usage: node scripts/features-progress.mjs
// Counts: done = "- [x]", open = "- [ ]"; cut items "- [~]" are excluded
// from denominators. Output is pasted into FEATURES.md at wave close.

import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "features");

const files = readdirSync(dir)
  .filter((f) => f.endsWith(".md"))
  .sort();

let totalDone = 0;
let totalAll = 0;
const rows = [];

for (const file of files) {
  const text = readFileSync(join(dir, file), "utf8");
  const done = (text.match(/^- \[x\]/gim) ?? []).length;
  const open = (text.match(/^- \[ \]/gm) ?? []).length;
  const all = done + open;
  const epic = file.split("-")[0];
  totalDone += done;
  totalAll += all;
  const pct = all === 0 ? 0 : Math.round((done / all) * 1000) / 10;
  rows.push(`| ${epic} | [${file}](features/${file}) | ${done} | ${all} | ${pct}% |`);
}

const grandPct =
  totalAll === 0 ? 0 : Math.round((totalDone / totalAll) * 1000) / 10;

console.log("| Epic | File | Done | Total | % |");
console.log("|---|---|---|---|---|");
for (const row of rows) console.log(row);
console.log(`| **All** | ${files.length} epics | **${totalDone}** | **${totalAll}** | **${grandPct}%** |`);

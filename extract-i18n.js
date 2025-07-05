#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';   // ← named import

// 1. Glob your source files
const files = globSync('src/**/*.{js,jsx,ts,tsx}');

// 2. Regex for string literals (", ' or `), but skip ones inside t('…')
const stringRe = /(?<!t\()\b(["'`])((?:(?=(\\?))\3.)*?)\1/g;

const seen = new Set();
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = stringRe.exec(content))) {
    const str = match[2].trim();
    // skip very short or code‑looking strings
    if (str.length > 1 && !str.includes('=>') && !str.startsWith('<')) {
      seen.add(str);
    }
  }
}

// 3. Build JSON objects
const en = {};
const rw = {};
for (const key of Array.from(seen).sort()) {
  en[key] = key;
  rw[key] = "";
}

// 4. Ensure locales folders
const outDir = path.resolve('src/locales');
for (const lng of ['en', 'rw']) {
  const dir = path.join(outDir, lng);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// 5. Write files
fs.writeFileSync(
  path.join(outDir, 'en/translation.json'),
  JSON.stringify(en, null, 2)
);
fs.writeFileSync(
  path.join(outDir, 'rw/translation.json'),
  JSON.stringify(rw, null, 2)
);

console.log(`Extracted ${seen.size} keys to src/locales/{en,rw}/translation.json`);

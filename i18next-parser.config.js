// module.exports = {
//   // what to extract? pick your src folder
//   input: [
//     'src/**/*.{js,jsx,ts,tsx}'
//   ],
//   // where to output
//   output: 'src/locales/$LOCALE/$NAMESPACE.json',
//   // the locales you want to support
//   locales: ['en', 'rw'],
//   // default namespace
//   defaultNamespace: 'translation',
//   // keySeparator, namespaceSeparator false if your keys are flat
//   keySeparator: false,
//   namespaceSeparator: false,
//   // keep keys in the file even if no longer found in code (so you don’t lose old content)
//   keepRemoved: false,
//   // sort keys alphabetically
//   sort: true,
//   // create locale file if missing
//   createOldCatalogs: true,
//   // verbose output
//   verbose: true,
// };
// i18next-parser.config.js
// i18next-parser.config.cjs
// i18next‑parser.config.js  (ESM) or .cjs (CJS)
export default {
  input: ['src/**/*.{js,jsx,ts,tsx}'],
  output: 'src/locales/$LOCALE/$NAMESPACE.json',
  locales: ['en', 'rw'],
  defaultNamespace: 'translation',

  // Only extract from t('…') calls:
  lexers: {
    ts:    ['JavascriptLexer'],    // picks up t('…') in .ts
    tsx:   ['JsxLexer'],           // picks up t('…') in .tsx
    js:    ['JavascriptLexer'],
    jsx:   ['JsxLexer'],
    default: ['JavascriptLexer']
  },

  // keep your keys flat
  keySeparator: false,
  namespaceSeparator: false,
  sort: true,
  verbose: true,
};

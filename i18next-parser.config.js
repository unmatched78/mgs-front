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

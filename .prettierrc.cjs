module.exports = {
  arrowParens: "avoid",
  objectWrap: "collapse",
  printWidth: 120,
  semi: false,
  trailingComma: "none",
  plugins: [require.resolve("@shopify/prettier-plugin-liquid")],
  overrides: [
    { files: ["*.html", "*.liquid"], options: { parser: "liquid-html" } },
    { files: ["*.svg"], options: { parser: "html" } }
  ]
}

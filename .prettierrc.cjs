module.exports = {
  arrowParens: "avoid",
  printWidth: 120,
  semi: false,
  trailingComma: "es5",
  plugins: [require.resolve("@shopify/prettier-plugin-liquid")],
  overrides: [
    {
      files: ["*.html", "*.liquid"],
      options: {
        parser: "liquid-html",
      },
    },
  ],
}

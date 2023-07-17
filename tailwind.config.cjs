const forms = require("@tailwindcss/forms")
const typography = require("@tailwindcss/typography")
const plugin = require("tailwindcss/plugin")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/visor/**/*.{html,js,svelte,ts}",
    "./package/**/*.{html,js,svelte,ts}",
    "./public/**/*.{html,js,svelte,ts}",
    "./src/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {
      colors: {
        dmed: {
          1: "var(--dmed-1)",
          2: "var(--dmed-2)",
          3: "var(--dmed-3)",
          4: "var(--dmed-4)",
          5: "var(--dmed-5)",
          6: "var(--dmed-6)",
          7: "var(--dmed-7)",
          8: "var(--dmed-8)",
          9: "var(--dmed-9)",
          10: "var(--dmed-10)",
          11: "var(--dmed-11)",
          12: "var(--dmed-12)",
          13: "var(--dmed-13)",
          14: "var(--dmed-14)",
          15: "var(--dmed-15)",
        },
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
          6: "var(--chart-6)",
          7: "var(--chart-7)",
          8: "var(--chart-8)",
          9: "var(--chart-9)",
        },
        dmedgray: {
          1: "var(--dmedgray-1)",
          2: "var(--dmedgray-2)",
          3: "var(--dmedgray-3)",
          4: "var(--dmedgray-4)",
          5: "var(--dmedgray-5)",
          6: "var(--dmedgray-6)",
          7: "var(--dmedgray-7)",
          8: "var(--dmedgray-8)",
          9: "var(--dmedgray-9)",
          10: "var(--dmedgray-10)",
          11: "var(--dmedgray-11)",
          12: "var(--dmedgray-12)",
          13: "var(--dmedgray-13)",
        },
        espn: {
          1: "var(--espn-1)",
          2: "var(--espn-2)",
          3: "var(--espn-3)",
          4: "var(--espn-4)",
        },
      },
      fontFamily: {
        sans: ["Avenir", "Helvetica", "Arial", "sans-serif"],
      },
      spacing: {
        "5px": "5px",
        "15px": "15px",
        128: "32rem",
        144: "36rem",
      },
      backgroundImage: {
        "gray-caret-down": "url('gray-caret-down.svg')",
        "gray-caret-right": "url('gray-caret-right.svg')",
      },
      strokeWidth: {
        3: "3px",
      },
    },
  },
  plugins: [
    forms,
    typography,
    plugin(function ({ addComponents, theme }) {
      addComponents({
        ".no-appearance": {
          "-webkit-appearance": "none" /* Safari */,
          "-khtml-appearance": "none" /* Konqueror HTML */,
          "-moz-appearance": "none" /*  old versions of Firefox */,
          "-ms-appearance": "none" /* Internet Explorer/Edge */,
          "-o-appearance": "none" /* Opera */,
          appearance: "none",
        },
        ".no-highlight": {
          "-webkit-touch-callout": "none" /* iOS Safari */,
          "-webkit-user-select": "none" /* Safari */,
          "-khtml-user-select": "none" /* Konqueror HTML */,
          "-moz-user-select": "none" /* old versions of Firefox */,
          "-ms-user-select": "none" /* Internet Explorer/Edge */,
          "-o-user-select": "none" /* Opera */,
          "user-select": "none",
        },
        ".highlight": {
          "-webkit-touch-callout": "auto" /* iOS Safari */,
          "-webkit-user-select": "auto" /* Safari */,
          "-khtml-user-select": "auto" /* Konqueror HTML */,
          "-moz-user-select": "auto" /* old versions of Firefox */,
          "-ms-user-select": "auto" /* Internet Explorer/Edge */,
          "-o-user-select": "auto" /* Opera */,
          "user-select": "auto",
        },
      })
    }),
  ],
  corePlugins: {
    preflight: false,
  },
}

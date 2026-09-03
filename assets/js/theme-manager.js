// Runtime palette management. This script runs before stylesheets so a saved theme applies before first paint.

;(function () {
  const definitions = window.siteThemeDefinitions
  const persistence = window.siteThemePersistence
  const root = document.documentElement
  const themeProperties = Object.keys(definitions.themes[definitions.defaultTheme].variables)
  let activeTheme = definitions.defaultTheme
  let transitionTimer
  let supportsOklchTransitions = false

  if (window.CSS?.registerProperty && window.CSS.supports("color", "color-mix(in oklch, red, blue)")) {
    try {
      themeProperties.forEach(function (property) {
        window.CSS.registerProperty({
          name: property,
          syntax: "<color>",
          inherits: true,
          initialValue: definitions.themes[definitions.defaultTheme].variables[property]
        })
      })
      window.CSS.registerProperty({ name: "--theme-progress", syntax: "<number>", inherits: true, initialValue: "1" })
      supportsOklchTransitions = true
    } catch (_error) {
      // A browser without usable custom-property registration still switches immediately.
    }
  }

  const closeSelector = function (selector, restoreFocus) {
    selector.querySelector(".theme-selector-toggle").setAttribute("aria-expanded", "false")
    selector.querySelector(".theme-selector-menu").hidden = true
    if (restoreFocus) selector.querySelector(".theme-selector-toggle").focus()
  }

  const closeOtherSelectors = function (activeSelector) {
    document.querySelectorAll("[data-theme-selector]").forEach(function (selector) {
      if (selector !== activeSelector) closeSelector(selector, false)
    })
  }

  const openSelector = function (selector) {
    closeOtherSelectors(selector)
    selector.querySelector(".theme-selector-toggle").setAttribute("aria-expanded", "true")
    selector.querySelector(".theme-selector-menu").hidden = false
    selector.querySelector(`[data-theme-option="${activeTheme}"]`).focus()
  }

  const updateSelectors = function () {
    const activeDefinition = definitions.themes[activeTheme]

    document.querySelectorAll("[data-theme-selector]").forEach(function (selector) {
      selector
        .querySelector(".theme-selector-toggle")
        .setAttribute("aria-label", `Choose color palette. Current palette: ${activeDefinition.label}.`)
      selector.querySelectorAll("[data-theme-option]").forEach(function (option) {
        option.setAttribute("aria-checked", String(option.dataset.themeOption === activeTheme))
      })
    })
  }

  const finishThemeTransition = function (variables) {
    Object.entries(variables).forEach(function ([property, value]) {
      root.style.setProperty(property, value)
      root.style.removeProperty(property.replace("--", "--theme-from-"))
      root.style.removeProperty(property.replace("--", "--theme-to-"))
    })
    root.style.removeProperty("--theme-progress")
    root.classList.remove("theme-transitioning")
  }

  const startThemeTransition = function (variables) {
    const computedRoot = window.getComputedStyle(root)
    const currentValues = Object.fromEntries(
      themeProperties.map(function (property) {
        return [property, computedRoot.getPropertyValue(property).trim()]
      })
    )

    root.classList.remove("theme-transitioning")
    root.style.setProperty("--theme-progress", "0")
    Object.entries(variables).forEach(function ([property, value]) {
      const fromProperty = property.replace("--", "--theme-from-")
      const toProperty = property.replace("--", "--theme-to-")
      root.style.setProperty(fromProperty, currentValues[property])
      root.style.setProperty(toProperty, value)
      root.style.setProperty(
        property,
        `color-mix(in oklch, var(${fromProperty}), var(${toProperty}) calc(var(--theme-progress) * 100%))`
      )
    })
    root.classList.add("theme-transitioning")
    window.getComputedStyle(root).getPropertyValue("--theme-progress")
    root.style.setProperty("--theme-progress", "1")
  }

  const applyTheme = function (themeName, options) {
    const selectedTheme = definitions.themes[themeName] ? themeName : definitions.defaultTheme
    const variables = definitions.themes[selectedTheme].variables
    const shouldAnimate =
      options?.animate &&
      selectedTheme !== activeTheme &&
      supportsOklchTransitions &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches

    window.clearTimeout(transitionTimer)
    if (shouldAnimate) startThemeTransition(variables)
    else finishThemeTransition(variables)
    root.dataset.theme = selectedTheme
    activeTheme = selectedTheme

    if (options?.persist) persistence.save(definitions.storageKey, selectedTheme)
    if (document.readyState !== "loading") updateSelectors()

    if (shouldAnimate) {
      transitionTimer = window.setTimeout(function () {
        finishThemeTransition(variables)
      }, 320)
    }

    window.dispatchEvent(new CustomEvent("site-theme-change", { detail: { theme: selectedTheme } }))
  }

  applyTheme(persistence.load(definitions.storageKey), { animate: false, persist: false })

  document.addEventListener("DOMContentLoaded", function () {
    updateSelectors()

    document.querySelectorAll("[data-theme-selector]").forEach(function (selector) {
      const toggle = selector.querySelector(".theme-selector-toggle")
      const menu = selector.querySelector(".theme-selector-menu")

      toggle.addEventListener("click", function () {
        if (toggle.getAttribute("aria-expanded") === "true") closeSelector(selector, false)
        else openSelector(selector)
      })
      toggle.addEventListener("keydown", function (event) {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault()
          openSelector(selector)
        }
      })
      menu.addEventListener("click", function (event) {
        const option = event.target.closest("[data-theme-option]")
        if (!option) return

        applyTheme(option.dataset.themeOption, { animate: true, persist: true })
        closeSelector(selector, true)
      })
      menu.addEventListener("keydown", function (event) {
        const options = Array.from(menu.querySelectorAll("[data-theme-option]"))
        const activeIndex = options.indexOf(document.activeElement)

        if (event.key === "Escape") {
          event.preventDefault()
          closeSelector(selector, true)
        } else if (event.key === "Home" || event.key === "End") {
          event.preventDefault()
          options[event.key === "Home" ? 0 : options.length - 1].focus()
        } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault()
          const direction = event.key === "ArrowDown" ? 1 : -1
          options[(activeIndex + direction + options.length) % options.length].focus()
        } else if (event.key === "Tab") {
          closeSelector(selector, false)
        }
      })
    })

    document.addEventListener("click", function (event) {
      document.querySelectorAll("[data-theme-selector]").forEach(function (selector) {
        if (!selector.contains(event.target)) closeSelector(selector, false)
      })
    })
  })

  window.siteThemeManager = Object.freeze({ applyTheme: applyTheme })
})()

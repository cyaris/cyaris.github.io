// Runtime palette management. This script runs before stylesheets so a saved theme applies before first paint.

;(function () {
  const definitions = window.siteThemeDefinitions
  const persistence = window.siteThemePersistence
  const root = document.documentElement
  const themeProperties = Object.keys(definitions.themes[definitions.defaultTheme].variables)
  let activeTheme = definitions.defaultTheme
  let transitionTimer

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
    })
    root.classList.remove("theme-transitioning")
    window.dispatchEvent(new Event("palettechange"))
  }

  const startThemeTransition = function (variables) {
    const probe = document.body.appendChild(document.createElement("span"))
    probe.hidden = true
    const currentValues = Object.fromEntries(
      themeProperties.map(function (property) {
        probe.style.color = `var(${property})`
        return [property, window.getComputedStyle(probe).color]
      })
    )
    probe.remove()
    const startedAt = window.performance.now()

    root.classList.add("theme-transitioning")
    const animateFrame = function () {
      const progress = Math.min((window.performance.now() - startedAt) / 300, 1)
      const easedProgress = progress * progress * (3 - 2 * progress)

      Object.entries(variables).forEach(function ([property, value]) {
        root.style.setProperty(
          property,
          `color-mix(in oklch, ${currentValues[property]}, ${value} ${easedProgress * 100}%)`
        )
      })
      window.dispatchEvent(new Event("palettechange"))

      if (progress < 1) transitionTimer = window.setTimeout(animateFrame, 16)
      else finishThemeTransition(variables)
    }
    animateFrame()
  }

  const applyTheme = function (themeName, options) {
    const selectedTheme = definitions.themes[themeName] ? themeName : definitions.defaultTheme
    const variables = definitions.themes[selectedTheme].variables
    const shouldAnimate =
      options?.animate &&
      selectedTheme !== activeTheme &&
      window.CSS.supports("color", "color-mix(in oklch, red, blue)") &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches

    window.clearTimeout(transitionTimer)
    if (shouldAnimate) startThemeTransition(variables)
    else finishThemeTransition(variables)
    root.dataset.theme = selectedTheme
    activeTheme = selectedTheme

    if (options?.persist) persistence.save(definitions.storageKey, selectedTheme)
    if (document.readyState !== "loading") updateSelectors()

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

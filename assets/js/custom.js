// Site-specific behavior layered after Beautiful Jekyll's JavaScript.

window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    window.location.reload()
  }
})

document.addEventListener("DOMContentLoaded", function () {
  const navbar = $("#main-navbar")
  const collapseNavbar = function () {
    navbar.collapse("hide")
  }
  const isChromeOnIOS = /CriOS\//.test(navigator.userAgent)

  function setNavigationScrollState() {
    const state = history.state && typeof history.state === "object" ? history.state : {}
    try {
      history.replaceState({ ...state, cyarisSoftNavigation: true, scrollY: window.scrollY }, "")
    } catch {
      // WebKit throttles history.replaceState; a dropped update just keeps the previous scroll snapshot.
    }
  }

  async function loadNavigationStylesheet(url, loadedUrls = new Set()) {
    if (loadedUrls.has(url)) return ""
    loadedUrls.add(url)

    const response = await fetch(url)
    if (!response.ok) throw new Error(`Stylesheet request failed with status ${response.status}`)

    let css = await response.text()
    const imports = [...css.matchAll(/@import\s+(?:url\()?\s*["']([^"']+)["']\s*\)?\s*;/g)]
    for (const match of imports) {
      const importUrl = new URL(match[1], url)
      if (importUrl.origin === window.location.origin) {
        css = css.replace(match[0], await loadNavigationStylesheet(importUrl.href, loadedUrls))
      }
    }

    return css.replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/g, function (_match, _quote, value) {
      if (value.startsWith("data:") || value.startsWith("#")) return `url("${value}")`
      return `url("${new URL(value, url).href}")`
    })
  }

  async function inlineNavigationResources(html, url) {
    const nextDocument = new DOMParser().parseFromString(html, "text/html")
    await Promise.all(
      [...nextDocument.querySelectorAll('link[rel~="stylesheet"][href]')].map(async function (link) {
        const stylesheetUrl = new URL(link.getAttribute("href"), url)
        if (stylesheetUrl.origin !== window.location.origin) return

        const style = nextDocument.createElement("style")
        style.textContent = await loadNavigationStylesheet(stylesheetUrl.href)
        link.replaceWith(style)
      })
    )
    await Promise.all(
      [...nextDocument.querySelectorAll("script[src]:not([async]):not([defer])")].map(async function (script) {
        const scriptUrl = new URL(script.getAttribute("src"), url)
        if (scriptUrl.origin !== window.location.origin) return

        const response = await fetch(scriptUrl.href)
        if (!response.ok) throw new Error(`Script request failed with status ${response.status}`)

        script.removeAttribute("src")
        script.textContent = await response.text()
      })
    )

    return `<!doctype html>\n${nextDocument.documentElement.outerHTML}`
  }

  async function fetchNavigationDocument(url) {
    const response = await fetch(url, { headers: { "X-Cyaris-Soft-Navigation": "1" } })
    if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) {
      throw new Error(`Navigation request failed with status ${response.status}`)
    }

    const responseUrl = new URL(response.url)
    if (responseUrl.origin !== window.location.origin) throw new Error("Navigation left the site origin")

    return { html: await inlineNavigationResources(await response.text(), responseUrl.href), url: responseUrl.href }
  }

  function replaceNavigationDocument({ html, scrollY, url }, pushState) {
    try {
      sessionStorage.setItem("cyaris-soft-navigation-scroll", JSON.stringify({ scrollY, url }))
    } catch {
      // The destination still opens at its default scroll position when session storage is unavailable.
    }

    if (pushState) history.pushState({ cyarisSoftNavigation: true, scrollY }, "", url)
    document.open()
    document.write(html)
    document.close()
  }

  // On mobile, move the avatar with the expanded navbar
  navbar.on("show.bs.collapse", function () {
    $(".navbar").addClass("top-nav-expanded")
  })
  navbar.on("hidden.bs.collapse", function () {
    $(".navbar").removeClass("top-nav-expanded")
  })

  // Collapse an expanded mobile navbar after launching a firework
  $(".firework-launcher-desktop, .firework-launcher-mobile").click(collapseNavbar)

  // Keep the expanded navbar in place until a selected destination replaces the page
  let navbarNavigationPending = false
  $(".navbar").on("click", "a:not([href^='javascript:'])", function (event) {
    if (!event.isDefaultPrevented() && event.which === 1 && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
      navbarNavigationPending = true
    }
  })

  // Collapse an expanded mobile navbar after clicking elsewhere on the page
  $(document).click(function (event) {
    if (navbar.hasClass("show") && $(event.target).closest(".navbar").length === 0) {
      collapseNavbar()
    }
  })

  // Let an outside scroll gesture move the page while immediately collapsing the navbar
  $(document).on("touchstart wheel", function (event) {
    if (navbar.hasClass("show") && $(event.target).closest(".navbar").length === 0) {
      collapseNavbar()
    }
  })

  // Collapse after page scrolling initiated by a keyboard or scrollbar
  $(window).on("scroll", function () {
    if (navbar.hasClass("show") && !navbarNavigationPending) {
      collapseNavbar()
    }
  })

  if (!isChromeOnIOS) return

  setNavigationScrollState()
  let navigationPending = false
  let scrollStateUpdatePending = false
  let lastScrollHistoryUpdate = 0
  let trailingScrollHistoryUpdateTimeout = null
  const scrollHistoryUpdateIntervalMs = 350

  function scheduleScrollHistoryUpdate() {
    const now = Date.now()
    const elapsed = now - lastScrollHistoryUpdate
    if (elapsed >= scrollHistoryUpdateIntervalMs) {
      lastScrollHistoryUpdate = now
      setNavigationScrollState()
      return
    }

    clearTimeout(trailingScrollHistoryUpdateTimeout)
    trailingScrollHistoryUpdateTimeout = setTimeout(function () {
      lastScrollHistoryUpdate = Date.now()
      setNavigationScrollState()
    }, scrollHistoryUpdateIntervalMs - elapsed)
  }

  try {
    const restoration = JSON.parse(sessionStorage.getItem("cyaris-soft-navigation-scroll"))
    if (restoration?.url === window.location.href) {
      sessionStorage.removeItem("cyaris-soft-navigation-scroll")
      requestAnimationFrame(function () {
        window.scrollTo(0, restoration.scrollY)
      })
    }
  } catch {
    // A blocked or malformed session-storage value leaves the browser's default scroll position intact.
  }

  window.addEventListener(
    "scroll",
    function () {
      if (scrollStateUpdatePending) return
      scrollStateUpdatePending = true
      requestAnimationFrame(function () {
        scrollStateUpdatePending = false
        scheduleScrollHistoryUpdate()
      })
    },
    { passive: true }
  )

  document.addEventListener("click", async function (event) {
    const link = event.target.closest?.("a[href]")
    if (
      !link ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      link.hasAttribute("download") ||
      (link.target && link.target !== "_self")
    ) {
      return
    }

    const url = new URL(link.href)
    const filename = url.pathname.split("/").pop()
    if (url.origin !== window.location.origin || url.hash || (filename.includes(".") && !filename.endsWith(".html"))) {
      return
    }

    event.preventDefault()
    if (navigationPending) return
    navigationPending = true
    setNavigationScrollState()

    try {
      replaceNavigationDocument({ ...(await fetchNavigationDocument(url.href)), scrollY: 0 }, true)
    } catch {
      window.location.assign(url.href)
    }
  })

  window.addEventListener("popstate", async function (event) {
    if (!event.state?.cyarisSoftNavigation || navigationPending) return
    navigationPending = true

    try {
      replaceNavigationDocument(
        { ...(await fetchNavigationDocument(window.location.href)), scrollY: event.state.scrollY || 0 },
        false
      )
    } catch {
      window.location.reload()
    }
  })
})

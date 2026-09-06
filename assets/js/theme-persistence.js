// Storage access is isolated so privacy modes or unavailable storage never block theme selection.

window.siteThemePersistence = Object.freeze({
  load: function (key) {
    try {
      return window.localStorage.getItem(key)
    } catch (_error) {
      return null
    }
  },
  save: function (key, value) {
    try {
      window.localStorage.setItem(key, value)
    } catch (_error) {
      // The active theme still applies for this page when persistence is unavailable.
    }
  }
})

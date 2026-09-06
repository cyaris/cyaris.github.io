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
})

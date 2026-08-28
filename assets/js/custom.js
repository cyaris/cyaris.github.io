// Site-specific behavior layered after Beautiful Jekyll's JavaScript.

document.addEventListener("DOMContentLoaded", function () {
  const navbar = $("#main-navbar")
  const collapseNavbar = function () {
    navbar.collapse("hide")
  }

  // On mobile, move the avatar with the expanded navbar and lock body scrolling
  navbar.on("show.bs.collapse", function () {
    $(".navbar").addClass("top-nav-expanded")
    $("body").addClass("navbar-expanded")
  })
  navbar.on("hidden.bs.collapse", function () {
    $(".navbar").removeClass("top-nav-expanded")
    $("body").removeClass("navbar-expanded")
  })

  // On mobile, collapse the navbar after selecting a menu item
  navbar.find("a:not(.dropdown-toggle)").click(collapseNavbar)

  // Collapse an expanded mobile navbar after clicking elsewhere on the page
  $(document).click(function (event) {
    if (navbar.hasClass("show") && $(event.target).closest(".navbar").length === 0) {
      collapseNavbar()
    }
  })

  // Reset navbar state when the browser restores this page through back/forward navigation
  $(window).on("pageshow", collapseNavbar)
})

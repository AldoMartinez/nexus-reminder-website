(function () {
  "use strict";

  // ===== Mobile navigation =====
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen);
      navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Abrir menú");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Abrir menú");
      }
    });
  }

  // ===== Navbar scroll shadow =====
  var navbar = document.getElementById("navbar");
  if (navbar) {
    var onScroll = function () {
      if (window.scrollY > 10) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ===== FAQ accordion =====
  var triggers = document.querySelectorAll(".accordion-trigger");

  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var expanded = trigger.getAttribute("aria-expanded") === "true";
      var panelId = trigger.getAttribute("aria-controls");
      var panel = document.getElementById(panelId);

      // Close all other panels
      triggers.forEach(function (other) {
        if (other !== trigger) {
          other.setAttribute("aria-expanded", "false");
          var otherId = other.getAttribute("aria-controls");
          var otherPanel = document.getElementById(otherId);
          if (otherPanel) otherPanel.hidden = true;
        }
      });

      // Toggle current
      if (expanded) {
        trigger.setAttribute("aria-expanded", "false");
        if (panel) panel.hidden = true;
      } else {
        trigger.setAttribute("aria-expanded", "true");
        if (panel) panel.hidden = false;
      }
    });
  });

  // ===== Smooth scroll with offset for fixed navbar =====
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (targetId === "#" || targetId.length <= 1) return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = 80;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  });
})();

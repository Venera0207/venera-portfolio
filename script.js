// Portfolio assets: photos/sweetmoment.jpg, photos/teplye-petelki.jpg, photos/auto-service.jpg, photos/coffee-mood.jpg, photos/beauty-lavande.jpg, photos/law-landing.jpg, photos/cleaning-site.jpg; hero: hero-video.mp4
(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)");

  const body = document.body;
  const header = document.querySelector("#site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const siteMenu = document.querySelector("#site-menu");
  const spotlight = document.querySelector(".cursor-spotlight");
  const form = document.querySelector("#contact-form");
  const successMessage = document.querySelector("#form-success");
  const year = document.querySelector("#current-year");

  /* -------------------------------------------
     Footer year
  ------------------------------------------- */
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* -------------------------------------------
     Header scroll state
  ------------------------------------------- */
  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* -------------------------------------------
     Mobile navigation
  ------------------------------------------- */
  const closeMenu = () => {
    if (!menuToggle || !siteMenu) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Открыть меню");
    siteMenu.classList.remove("is-open");
    body.classList.remove("menu-open");
  };

  const openMenu = () => {
    if (!menuToggle || !siteMenu) return;
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Закрыть меню");
    siteMenu.classList.add("is-open");
    body.classList.add("menu-open");
  };

  if (menuToggle && siteMenu) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      expanded ? closeMenu() : openMenu();
    });

    siteMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (!siteMenu.classList.contains("is-open")) return;
      if (!siteMenu.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuToggle?.focus();
      }
    });
  }

  /* -------------------------------------------
     Scroll reveal
  ------------------------------------------- */
  if (prefersReducedMotion.matches) {
    document.querySelectorAll(".reveal").forEach((element) => {
      element.classList.add("is-visible");
    });
  } else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    });

    document.querySelectorAll(".reveal").forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    document.querySelectorAll(".reveal").forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  /* -------------------------------------------
     Cursor spotlight
  ------------------------------------------- */
  if (spotlight && !isTouch.matches && !prefersReducedMotion.matches) {
    let rafId = 0;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const renderSpotlight = () => {
      document.documentElement.style.setProperty("--mouse-x", `${mouseX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${mouseY}px`);
      rafId = 0;
    };

    window.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      spotlight.classList.add("is-visible");

      if (!rafId) {
        rafId = requestAnimationFrame(renderSpotlight);
      }
    }, { passive: true });

    document.addEventListener("mouseleave", () => {
      spotlight.classList.remove("is-visible");
    });
  }

  /* -------------------------------------------
     Magnetic buttons
  ------------------------------------------- */
  if (!isTouch.matches && !prefersReducedMotion.matches) {
    document.querySelectorAll(".magnetic").forEach((button) => {
      button.addEventListener("mousemove", (event) => {
        const rect = button.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;

        button.style.setProperty("--button-x", `${x}px`);
        button.style.setProperty("--button-y", `${y}px`);
      });

      button.addEventListener("mouseleave", () => {
        button.style.setProperty("--button-x", "0px");
        button.style.setProperty("--button-y", "0px");
      });
    });
  }

  /* -------------------------------------------
     Hero video fallback
  ------------------------------------------- */
  const heroVideo = document.querySelector(".hero-video");

  if (heroVideo) {
    heroVideo.addEventListener("error", () => {
      heroVideo.style.display = "none";
    });

    heroVideo.addEventListener("loadeddata", () => {
      heroVideo.classList.add("is-loaded");
    });
  }

  /* -------------------------------------------
     Contact form validation
  ------------------------------------------- */
  const getField = (name) => form?.elements?.namedItem(name);

  const setError = (name, message = "") => {
    const field = getField(name);
    const error = document.querySelector(`[data-error-for="${name}"]`);

    if (!field || !error) return;

    const wrapper = field.closest(".field");
    wrapper?.classList.toggle("has-error", Boolean(message));
    error.textContent = message;
  };

  const validateContact = (value) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return "Заполните это поле.";
    }

    if (trimmed.length < 2) {
      return "Введите минимум 2 символа.";
    }

    return "";
  };

  const validateMessage = (value) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return "Напишите несколько слов о проекте.";
    }

    if (trimmed.length < 10) {
      return "Напишите немного подробнее — хотя бы 10 символов.";
    }

    return "";
  };

  if (form) {
    ["name", "contact", "message"].forEach((name) => {
      const field = getField(name);
      if (!field) return;

      field.addEventListener("input", () => {
        setError(name, "");
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (successMessage) {
        successMessage.hidden = true;
      }

      const name = getField("name");
      const contact = getField("contact");
      const message = getField("message");

      const errors = {
        name: validateContact(name?.value || ""),
        contact: validateContact(contact?.value || ""),
        message: validateMessage(message?.value || "")
      };

      Object.entries(errors).forEach(([field, error]) => {
        setError(field, error);
      });

      const hasErrors = Object.values(errors).some(Boolean);

      if (hasErrors) {
        const firstInvalid = [name, contact, message].find((field) => {
          return field && !field.value.trim();
        });

        (firstInvalid || name)?.focus();
        return;
      }

      if (successMessage) {
        successMessage.hidden = false;
        successMessage.scrollIntoView({
          behavior: prefersReducedMotion.matches ? "auto" : "smooth",
          block: "nearest"
        });
      }

      form.reset();

      // TODO:
      // Подключить реальный backend/endpoint, когда он появится.
    });
  }

  /* -------------------------------------------
     Close menu on resize back to desktop
  ------------------------------------------- */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  }, { passive: true });
})();

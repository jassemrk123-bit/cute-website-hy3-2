/* =============================================================
   Experience Controller
   Handles: boot overlay, envelope open, dove release,
   site reveal, theme toggle, and small UI utilities.
============================================================= */
(function () {
  "use strict";

  const config = window.SiteConfig || {};
  const prefersReducedMotion = () =>
    config.animation &&
    config.animation.respectReducedMotion &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Element cache ---------- */
  const overlay = document.getElementById("boot-overlay");
  const envelope = document.getElementById("envelope");
  const app = document.getElementById("app");
  const dovesLayer = document.getElementById("doves-layer");
  const themeToggle = document.getElementById("theme-toggle");

  /* ---------- Utilities ---------- */
  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function safeRemove(node, delayMs) {
    if (!node) return;
    setTimeout(() => {
      if (node && node.parentNode) {
        node.parentNode.removeChild(node);
      }
    }, delayMs);
  }

  /* ---------- Envelope open flow ---------- */
  function openEnvelope() {
    if (!envelope || envelope.classList.contains("is-open")) return;

    envelope.classList.add("is-open");

    const revealDelay = prefersReducedMotion() ? 600 : 1400;

    setTimeout(() => {
      revealSite();
    }, revealDelay);
  }

  function revealSite() {
    if (overlay) overlay.classList.add("is-fading");

    if (app) {
      app.classList.remove("is-hidden");
      // small delay so transition feels natural after overlay fades
      setTimeout(() => {
        if (app) app.style.opacity = "1";
      }, prefersReducedMotion() ? 0 : 200);
    }

    safeRemove(overlay, prefersReducedMotion() ? 400 : 1600);

    if (config.doves && config.doves.enabled && !prefersReducedMotion()) {
      releaseDoves();
    }
  }

  /* ---------- Doves ---------- */
  function createDove() {
    const dove = document.createElement("div");
    dove.className = "dove";
    dove.setAttribute("aria-hidden", "true");

    const size = randomBetween(
      config.doves.minSize,
      config.doves.maxSize
    );
    dove.style.width = size + "px";
    dove.style.height = size + "px";
    dove.style.top = randomBetween(
      config.doves.minTopPercent,
      config.doves.maxTopPercent
    ) + "%";

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "icon");
    svg.setAttribute("viewBox", "0 0 64 64");

    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#icon-dove");
    svg.appendChild(use);

    dove.appendChild(svg);

    const duration = randomBetween(
      config.doves.minDurationMs,
      config.doves.maxDurationMs
    );
    const delay = randomBetween(
      config.doves.minDelayMs,
      config.doves.maxDelayMs
    );

    dove.style.animation = `dove-fly ${duration}ms linear forwards`;
    dove.style.animationDelay = `${delay}ms`;

    return dove;
  }

  function releaseDoves() {
    if (!dovesLayer) return;

    const count = clamp(config.doves.count || 0, 1, 40);

    for (let i = 0; i < count; i++) {
      const dove = createDove();
      dovesLayer.appendChild(dove);

      const life =
        config.doves.maxDurationMs +
        config.doves.maxDelayMs +
        400;

      safeRemove(dove, life);
    }
  }

  /* ---------- Theme toggle ---------- */
  function applyTheme(themeId) {
    const html = document.documentElement;
    config.themes.forEach((theme) => {
      html.classList.remove(theme.id);
    });
    html.classList.add(themeId);

    try {
      localStorage.setItem(config.themeStorageKey, themeId);
    } catch (err) {
      /* storage may be unavailable; ignore */
    }
  }

  function initTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem(config.themeStorageKey);
    } catch (err) {
      saved = null;
    }

    const initial =
      saved ||
      (config.themes && config.themes[0] && config.themes[0].id) ||
      "theme-ivory";

    applyTheme(initial);

    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const current = document.documentElement.classList.contains(initial)
          ? initial
          : Array.from(document.documentElement.classList).find((cls) =>
              (config.themes || []).some((t) => t.id === cls)
            ) || initial;

        const index = config.themes.findIndex((t) => t.id === current);
        const next =
          config.themes[(index + 1) % config.themes.length].id;
        applyTheme(next);
      });
    }
  }

  /* ---------- Boot ---------- */
  function initExperience() {
    initTheme();

    if (envelope) {
      envelope.addEventListener("click", openEnvelope);

      envelope.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openEnvelope();
        }
      });
    }

    // Fallback: if someone reloads after opening, do not trap them.
    if (!overlay) {
      if (app) app.classList.remove("is-hidden");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initExperience);
  } else {
    initExperience();
  }
})();

/* =============================================================
   Site Configuration
   This file drives the experience without requiring you to
   rewrite the logic. Edit text, dove count, gallery items,
   and easter-egg settings here.
============================================================= */
(function () {
  "use strict";

  window.SiteConfig = {
    /* ---- Brand / page identity ---- */
    brand: {
      name: "For You",
      tagline: "A quiet little website made with love"
    },

    /* ---- The boot letter ---- */
    letter: {
      text:
        "sorry baba im not being able to give u attention nowadays im just tryna focus on these kind of stuff like websites hopefully u like this one i made for you of course there will be more to come when i learn all of this properly, i love you baba",
      signature: "with love"
    },

    /* ---- Doves configuration ---- */
    doves: {
      enabled: true,
      count: 9,
      minDurationMs: 4200,
      maxDurationMs: 7200,
      minDelayMs: 120,
      maxDelayMs: 520,
      minTopPercent: 12,
      maxTopPercent: 68,
      minSize: 48,
      maxSize: 82
    },

    /* ---- Mood / theme toggling ---- */
    themes: [
      { id: "theme-ivory", label: "Ivory" },
      { id: "theme-blush", label: "Blush" },
      { id: "theme-midnight", label: "Midnight" },
      { id: "theme-sepia", label: "Sepia" }
    ],
    themeStorageKey: "keepsake-theme",

    /* ---- Gallery ---- */
    gallery: {
      placeholder:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=70",
      items: [
        {
          id: "memory-1",
          title: "First placeholder",
          caption: "Replace this with one of our photos.",
          src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=70",
          date: "Add a date"
        },
        {
          id: "memory-2",
          title: "Another memory",
          caption: "The gallery grows as we add more.",
          src: "https://images.unsplash.com/photo-1494774157363-9e04c6730d32?auto=format&fit=crop&w=900&q=70",
          date: "Add a date"
        },
        {
          id: "memory-3",
          title: "Quiet moment",
          caption: "Small things matter too.",
          src: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=70",
          date: "Add a date"
        },
        {
          id: "memory-4",
          title: "One more",
          caption: "Eventually this page becomes ours.",
          src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=70",
          date: "Add a date"
        }
      ]
    },

    /* ---- Easter eggs ---- */
    easterEggs: {
      enableLoveRain: true,
      loveSequence: "love",

      enableSecretSequence: true,
      secretSequence: "baba",
      secretPanelId: "secret-panel",

      enableTitleGlow: true,
      titleSelector: "#hero-title, .hero__title",

      enableHeartCursor: true,
      heartCursorButtonId: "heart-cursor",
      heartCursorDurationMs: 10000,

      enablePetalTrail: true,
      petalTrailIdleMs: 140,

      enableConsoleGreeting: true
    },

    /* ---- Animation preferences ---- */
    animation: {
      respectReducedMotion: true
    }
  };
})();

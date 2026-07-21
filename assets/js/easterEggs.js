/* =============================================================
   Easter Eggs Controller
   Handles:
   1. Typing "love" spawns falling hearts
   2. Typing secret sequence opens hidden panel
   3. Double-clicking title glows
   4. Heart cursor button
   5. Slow petal trail
   6. Console greeting for curious visitors
============================================================= */
(function () {
  "use strict";

  const config = window.SiteConfig || {};
  const eggs = config.easterEggs || {};
  const prefersReducedMotion = () =>
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let typedBuffer = "";
  let lastMouseMove = 0;
  let petalTimer = null;

  /* ---------- Love rain ---------- */
  function spawnHeart() {
    const heart = document.createElement("div");
    heart.className = "falling-heart";
    heart.innerHTML = "❤";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = randomBetween(12, 28) + "px";
    heart.style.opacity = String(randomBetween(0.6, 1));

    const fallDuration = randomBetween(2600, 4200);
    heart.style.transition = `transform ${fallDuration}ms linear, opacity ${fallDuration}ms linear`;

    document.body.appendChild(heart);

    requestAnimationFrame(() => {
      heart.style.transform = `translateY(110vh) rotate(${randomBetween(-30, 30)}deg)`;
      heart.style.opacity = "0";
    });

    setTimeout(() => {
      if (heart.parentNode) heart.parentNode.removeChild(heart);
    }, fallDuration + 100);
  }

  function handleLoveSequence() {
    if (typedBuffer.includes(eggs.loveSequence)) {
      typedBuffer = "";
      const count = prefersReducedMotion() ? 8 : 22;
      for (let i = 0; i < count; i++) {
        setTimeout(spawnHeart, i * 90);
      }
    }
  }

  /* ---------- Secret sequence ---------- */
  function handleSecretSequence() {
    if (!eggs.secretSequence) return;

    if (typedBuffer.includes(eggs.secretSequence)) {
      typedBuffer = "";
      openSecretPanel();
    }
  }

  function openSecretPanel() {
    const panel = document.getElementById(eggs.secretPanelId);
    if (!panel) return;
    panel.hidden = false;
    document.body.style.overflow = "hidden";

    panel.querySelectorAll("[data-close]").forEach((el) => {
      el.addEventListener("click", () => {
        panel.hidden = true;
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Title glow ---------- */
  function initTitleGlow() {
    if (!eggs.enableTitleGlow) return;

    const titles = document.querySelectorAll(eggs.titleSelector);
    titles.forEach((title) => {
      title.addEventListener("dblclick", () => {
        title.classList.add("title-glow");
        setTimeout(() => title.classList.remove("title-glow"), 2200);
      });
    });
  }

  /* ---------- Heart cursor ---------- */
  function initHeartCursor() {
    if (!eggs.enableHeartCursor) return;

    const button = document.getElementById(eggs.heartCursorButtonId);
    if (!button) return;

    button.addEventListener("click", () => {
      document.body.classList.add("cursor-heart");
      setTimeout(() => {
        document.body.classList.remove("cursor-heart");
      }, eggs.heartCursorDurationMs || 10000);
    });
  }

  /* ---------- Petal trail ---------- */
  function spawnPetal(x, y) {
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.style.left = x + "px";
    petal.style.top = y + "px";
    petal.style.transform = `translateY(0) scale(${randomBetween(0.7, 1.25)})`;
    petal.style.opacity = "0.75";

    const drift = randomBetween(-30, 30);
    const rise = randomBetween(20, 60);
    const life = randomBetween(900, 1600);

    petal.style.transition = `transform ${life}ms ease-out, opacity ${life}ms ease-out`;

    document.body.appendChild(petal);

    requestAnimationFrame(() => {
      petal.style.transform = `translate(${drift}px, -${rise}px) scale(0.6)`;
      petal.style.opacity = "0";
    });

    setTimeout(() => {
      if (petal.parentNode) petal.parentNode.removeChild(petal);
    }, life + 100);
  }

  function initPetalTrail() {
    if (!eggs.enablePetalTrail || prefersReducedMotion()) return;

    document.addEventListener("mousemove", (event) => {
      const now = Date.now();
      if (now - lastMouseMove < (eggs.petalTrailIdleMs || 140)) return;
      lastMouseMove = now;
      spawnPetal(event.clientX, event.clientY);
    });
  }

  /* ---------- Console greeting ---------- */
  function initConsoleGreeting() {
    if (!eggs.enableConsoleGreeting) return;

    console.log(
      "%cHello curious visitor 💛",
      "font-size:14px;color:#c9a66b;font-family:serif;"
    );
    console.log(
      "This site was made as a small gift. Try typing 'love' or looking for quiet corners."
    );
  }

  /* ---------- Utils ---------- */
  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function handleKeydown(event) {
    if (!event.key) return;
    typedBuffer += event.key.toLowerCase();
    if (typedBuffer.length > 40) {
      typedBuffer = typedBuffer.slice(-40);
    }
    if (eggs.enableLoveRain) handleLoveSequence();
    if (eggs.enableSecretSequence) handleSecretSequence();
  }

  /* ---------- Init ---------- */
  function initEasterEggs() {
    document.addEventListener("keydown", handleKeydown);
    initTitleGlow();
    initHeartCursor();
    initPetalTrail();
    initConsoleGreeting();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEasterEggs);
  } else {
    initEasterEggs();
  }
})();

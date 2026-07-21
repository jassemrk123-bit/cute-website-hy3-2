/* =============================================================
   Gallery Controller
   Renders memory cards from SiteConfig, manages lightbox,
   keyboard navigation, and empty states.
============================================================= */
(function () {
  "use strict";

  const config = window.SiteConfig || {};
  const galleryConfig = config.gallery || {};

  const root = document.getElementById("gallery-root");
  const emptyMessage = document.getElementById("gallery-empty");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");

  let items = [];
  let activeIndex = -1;

  /* ---------- Build gallery ---------- */
  function renderGallery() {
    if (!root) return;

    const sourceItems = Array.isArray(galleryConfig.items)
      ? galleryConfig.items
      : [];

    root.innerHTML = "";

    if (sourceItems.length === 0) {
      if (emptyMessage) emptyMessage.hidden = false;
      return;
    }

    if (emptyMessage) emptyMessage.hidden = true;

    sourceItems.forEach((item, index) => {
      const card = createCard(item, index);
      root.appendChild(card);
    });
  }

  function createCard(item, index) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "gallery-card";
    card.setAttribute("aria-label", `Open photo: ${item.title || "Memory"}`);

    const img = document.createElement("img");
    img.className = "gallery-card__image";
    img.src = item.src || galleryConfig.placeholder;
    img.alt = item.title || "Memory";
    img.loading = "lazy";

    const overlay = document.createElement("div");
    overlay.className = "gallery-card__overlay";

    const title = document.createElement("p");
    title.className = "gallery-card__title";
    title.textContent = item.title || "Untitled";

    const caption = document.createElement("p");
    caption.className = "gallery-card__caption";
    caption.textContent = [item.caption, item.date]
      .filter(Boolean)
      .join(" · ");

    overlay.appendChild(title);
    overlay.appendChild(caption);

    card.appendChild(img);
    card.appendChild(overlay);

    card.addEventListener("click", () => openLightbox(index));

    return card;
  }

  /* ---------- Lightbox ---------- */
  function openLightbox(index) {
    if (!lightbox || index < 0 || index >= items.length) return;

    activeIndex = index;
    updateLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    activeIndex = -1;
    document.body.style.overflow = "";
  }

  function updateLightbox() {
    const item = items[activeIndex];
    if (!item) return;

    if (lightboxImage) {
      lightboxImage.src = item.src || galleryConfig.placeholder;
      lightboxImage.alt = item.title || "Memory";
    }

    if (lightboxCaption) {
      lightboxCaption.textContent = [item.title, item.caption]
        .filter(Boolean)
        .join(" — ");
    }
  }

  function navigate(delta) {
    if (items.length === 0) return;
    activeIndex = (activeIndex + delta + items.length) % items.length;
    updateLightbox();
  }

  function bindLightbox() {
    if (!lightbox) return;

    if (lightboxPrev) {
      lightboxPrev.addEventListener("click", () => navigate(-1));
    }

    if (lightboxNext) {
      lightboxNext.addEventListener("click", () => navigate(1));
    }

    lightbox.querySelectorAll("[data-close]").forEach((el) => {
      el.addEventListener("click", () => {
        const target = el.getAttribute("data-close");
        if (target === "lightbox") closeLightbox();
      });
    });

    document.addEventListener("keydown", (event) => {
      if (lightbox.hidden) return;

      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") navigate(-1);
      if (event.key === "ArrowRight") navigate(1);
    });
  }

  /* ---------- Init ---------- */
  function initGallery() {
    items = Array.isArray(galleryConfig.items) ? galleryConfig.items : [];
    renderGallery();
    bindLightbox();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGallery);
  } else {
    initGallery();
  }
})();

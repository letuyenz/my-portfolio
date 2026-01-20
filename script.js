// script.js
(() => {
  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const headerH = header ? header.offsetHeight : 72;
  root.style.setProperty("--headerH", `${headerH}px`);

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ===== Smooth scroll (fixes “Lên đầu trang” + offsets sticky header) =====
  function scrollToTarget(el) {
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - headerH - 10;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    // optional focus for a11y
    if (el.id && el.id !== "top") el.setAttribute("tabindex", "-1");
  }

  // Intercept same-page hash links
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;

    const href = a.getAttribute("href") || "";
    if (!href.startsWith("#") || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    scrollToTarget(target);

    // close mobile drawer if open
    const drawer = document.querySelector(".nav-drawer[open]");
    if (drawer) drawer.removeAttribute("open");
  });

  // Back-to-top button
  const toTopBtn = document.querySelector("[data-to-top]");
  if (toTopBtn) {
    toTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ===== Reveal (staggered) =====
  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));
  revealEls.forEach((el, i) => {
    const d = Math.min(i * 70, 420);
    el.style.setProperty("--delay", `${d}ms`);
  });

  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -12% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // ===== Scroll progress + show/hide to-top =====
  const prog = document.querySelector(".scroll-progress span");
  const navLinks = Array.from(document.querySelectorAll(".nav .nav-link"));
  const sectionIds = ["about", "skills", "projects", "contact"];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function onScroll() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    if (prog) prog.style.transform = `scaleX(${p})`;

    if (toTopBtn) {
      if (window.scrollY > 650) toTopBtn.classList.add("is-visible");
      else toTopBtn.classList.remove("is-visible");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Active nav (section spy)
  if (sections.length && navLinks.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((x) => x.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;

        navLinks.forEach((l) => l.classList.remove("is-active"));
        const id = visible.target.id;
        const link = navLinks.find((l) => l.getAttribute("href") === `#${id}`);
        if (link) link.classList.add("is-active");
      },
      { threshold: [0.25, 0.4, 0.55], rootMargin: `-${headerH}px 0px -55% 0px` }
    );
    sections.forEach((s) => spy.observe(s));
  }

  // ===== Cursor glow (desktop only) =====
  const glow = document.querySelector(".cursor-glow");
  const canHover = window.matchMedia("(hover: hover)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (glow && canHover && !reduceMotion) {
    let raf = 0;
    let x = window.innerWidth * 0.5;
    let y = window.innerHeight * 0.35;

    const update = () => {
      raf = 0;
      root.style.setProperty("--mx", `${x}px`);
      root.style.setProperty("--my", `${y}px`);
    };

    window.addEventListener("pointermove", (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(update);
    }, { passive: true });
  }

  // ===== Contact form -> mailto =====
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  const TO_EMAIL = "you@domain.com"; // TODO: replace

  function setNote(msg) { if (note) note.textContent = msg || ""; }

  if (form) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      setNote("");

      const name = (form.querySelector("#name")?.value || "").trim();
      const email = (form.querySelector("#email")?.value || "").trim();
      const message = (form.querySelector("#message")?.value || "").trim();

      if (!name || !email || !message) {
        setNote("Vui lòng điền đầy đủ thông tin trước khi gửi.");
        return;
      }

      const subject = encodeURIComponent(`[Portfolio] Contact from ${name}`);
      const body = encodeURIComponent(`Tên: ${name}\nEmail: ${email}\n\nNội dung:\n${message}\n`);

      window.location.href = `mailto:${TO_EMAIL}?subject=${subject}&body=${body}`;
      setNote("Đang mở ứng dụng email của bạn...");
    });
  }
})();

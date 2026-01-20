// script.js
(() => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Scroll reveal
  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));
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
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // Contact form -> mailto (static-friendly for GitHub Pages)
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");

  // TODO: Replace with your real email:
  const TO_EMAIL = "you@domain.com";

  function setNote(msg) {
    if (note) note.textContent = msg || "";
  }

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
      const body = encodeURIComponent(
        `Tên: ${name}\nEmail: ${email}\n\nNội dung:\n${message}\n`
      );

      // Opens user's email client
      window.location.href = `mailto:${TO_EMAIL}?subject=${subject}&body=${body}`;
      setNote("Đang mở ứng dụng email của bạn...");
    });
  }
})();

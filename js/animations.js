// =========================================================
// ANIMATIONS.JS
// Scroll-reveal (Intersection Observer) + animated counters
// =========================================================

// ---------------------------------------------------------
// SCROLL REVEAL
// Any element with class "reveal" fades/slides into view
// the first time it crosses the viewport threshold
// ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  // -------------------------------------------------------
  // COUNTER ANIMATION
  // Numbers in .stat-number count up once their section
  // enters the viewport (used on home + about statistics)
  // -------------------------------------------------------
  const counters = document.querySelectorAll("[data-count-to]");
  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  }
});

function animateCounter(el) {
  const target = parseFloat(el.getAttribute("data-count-to"));
  const isDecimal = target % 1 !== 0;
  const duration = 1400;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    const current = target * eased;
    el.textContent = isDecimal ? current.toFixed(1) : Math.round(current).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
  }
  requestAnimationFrame(tick);
}

// ---------------------------------------------------------
// COUNTDOWN TIMER
// Used on offers.html for limited-time deals. Counts down
// to a fixed offset from page load (48 hours) for demo use.
// ---------------------------------------------------------
function initCountdown(elId, hoursFromNow = 48) {
  const el = document.getElementById(elId);
  if (!el) return;
  const target = new Date().getTime() + hoursFromNow * 60 * 60 * 1000;

  function update() {
    const now = new Date().getTime();
    const diff = Math.max(target - now, 0);

    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    el.querySelector(".cd-hours").textContent = String(h).padStart(2, "0");
    el.querySelector(".cd-minutes").textContent = String(m).padStart(2, "0");
    el.querySelector(".cd-seconds").textContent = String(s).padStart(2, "0");

    if (diff <= 0) clearInterval(timerId);
  }
  update();
  const timerId = setInterval(update, 1000);
}

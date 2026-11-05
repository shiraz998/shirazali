const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Scroll reveal: adds .in to each .rv element as it enters the screen
const items = document.querySelectorAll(".rv");
if (reduce || !("IntersectionObserver" in window)) {
  items.forEach(el => el.classList.add("in"));
} else {
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      io.unobserve(e.target);
    }
  }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  items.forEach(el => io.observe(el));
}

// Typewriter: types and erases the roles under the name
(function () {
  const el = document.getElementById("typed");
  if (!el) return;

  const words = ["WordPress Developer", "Elementor Expert", "HTML/Figma to WordPress", "Website Speed Optimization", "Responsive Website"];

  if (reduce) { el.textContent = words[0]; return; }
  let w = 0, c = 0, deleting = false;
  function tick() {
    const word = words[w];
    if (!deleting) {
      c++;
      el.textContent = word.slice(0, c);
      if (c === word.length) { deleting = true; return setTimeout(tick, 1900); }
      setTimeout(tick, 90);
    } else {
      c--;
      el.textContent = word.slice(0, c);
      if (c === 0) { deleting = false; w = (w + 1) % words.length; return setTimeout(tick, 350); }
      setTimeout(tick, 45);
    }
  }
  el.textContent = "";
  setTimeout(tick, 600);
})();

// Slow drifting particles in the background
(function () {
  if (reduce) return;
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let w, h, dots = [];

  function build() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(70, Math.floor((w * h) / 22000));
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -Math.random() * 0.25 - 0.05,
      a: Math.random() * 0.6 + 0.2
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const d of dots) {
      d.x += d.vx;
      d.y += d.vy;
      if (d.y < -4) { d.y = h + 4; d.x = Math.random() * w; }
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167, 139, 250, ${d.a})`;
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }

  build();
  window.addEventListener("resize", build);
  frame();
})();


// Skill bubbles: move each chip around the photo along its own path, keeping the text upright
(function () {
  const items = [...document.querySelectorAll(".orbit .bubble")].map(b => ({
    el: b.querySelector(".chip"),
    a: parseFloat(b.dataset.a) * Math.PI / 180,
    r: parseFloat(b.dataset.r)
  }));
  function place(theta) {
    for (const it of items) {
      const x = Math.cos(it.a + theta) * it.r;
      const y = Math.sin(it.a + theta) * it.r;
      it.el.style.transform = `translate(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px))`;
    }
  }
  if (reduce) { place(0); return; }
  const turn = 2 * Math.PI / 24000; // one full turn every 24 seconds
  function loop(t) {
    place(t * turn);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

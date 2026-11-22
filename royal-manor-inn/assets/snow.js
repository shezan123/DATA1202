// Lightweight snowfall: one canvas per [data-snow] section.
// Pauses when off-screen or when the tab is hidden; disabled for reduced motion.
(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  document.querySelectorAll('[data-snow]').forEach((host) => {
    const canvas = document.createElement('canvas');
    canvas.className = 'snow';
    canvas.setAttribute('aria-hidden', 'true');
    host.prepend(canvas);
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, flakes = [], running = false, visible = true, raf = 0, t = 0;

    function size() {
      w = host.clientWidth; h = host.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, (w * h) / 14000));
      flakes = Array.from({ length: count }, () => make(true));
    }
    function make(anywhere) {
      const r = Math.random() * 2.2 + 0.6;
      return { x: Math.random() * w, y: anywhere ? Math.random() * h : -10, r, vy: r * 0.35 + 0.25, phase: Math.random() * Math.PI * 2, a: Math.random() * 0.5 + 0.35 };
    }
    function frame() {
      t += 0.01;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#fff';
      for (const f of flakes) {
        f.y += f.vy;
        f.x += Math.sin(t + f.phase) * 0.35 * f.r * 0.5;
        if (f.y > h + 5) Object.assign(f, make(false));
        if (f.x > w + 5) f.x = -5; else if (f.x < -5) f.x = w + 5;
        ctx.globalAlpha = f.a;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }
    function update() {
      const should = visible && !document.hidden;
      if (should && !running) { running = true; raf = requestAnimationFrame(frame); }
      if (!should && running) { running = false; cancelAnimationFrame(raf); }
    }

    size();
    let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(size, 200); });
    document.addEventListener('visibilitychange', update);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => { visible = en.isIntersecting; update(); }).observe(host);
    }
    update();
  });
})();

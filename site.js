/* Minted Signals · the field */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* the four deck marks as line segments in unit space (centered, -0.5..0.5) */
  function seg(a, b, c, d) { return [(a - 50) / 100, (b - 50) / 100, (c - 50) / 100, (d - 50) / 100]; }
  var MARKS = [
    [seg(50, 14, 50, 86), seg(14, 50, 86, 50), seg(24, 24, 76, 76), seg(76, 24, 24, 76)], /* build */
    [seg(20, 20, 80, 80), seg(80, 20, 20, 80)],                                             /* scale */
    [seg(22, 78, 78, 22), seg(42, 22, 78, 22), seg(78, 22, 78, 58)],                        /* partner */
    [seg(50, 14, 50, 42), seg(50, 58, 50, 86), seg(14, 50, 42, 50), seg(58, 50, 86, 50)]    /* systems */
  ];
  function hash(i) { var x = (i * 2654435761) >>> 0; x ^= x >>> 15; x = (x * 2246822519) >>> 0; x ^= x >>> 13; return x; }

  /* A sparse field: dots on a grid, one in nine a mark. Still by default.
     One ring on load. Under the cursor, nearby cells lift a little and
     follow it, slowly. A click sends a ring. The loop only runs while
     something is moving. */
  function field(canvas, opts) {
    var ctx = canvas.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, cells = [], pings = [], running = false, gap = 24;
    var cfg = { base: 1.1, gain: 2.2, mark: 8, markHot: 14 };
    var cur = { x: -9999, y: -9999, tx: -9999, ty: -9999, on: false, str: 0 };
    var R = 130;
    function build() {
      cells = [];
      var cols = Math.floor(W / gap) + 1, rows = Math.floor(H / gap) + 1;
      var ox = (W - (cols - 1) * gap) / 2, oy = (H - (rows - 1) * gap) / 2;
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
        var i = r * cols + c, h = hash(i + 7);
        cells.push({ x: ox + c * gap, y: oy + r * gap, m: (c + r * 3) % 4, mark: h % 9 === 0 });
      }
    }
    function resize() {
      var r = canvas.parentElement.getBoundingClientRect(); W = Math.floor(r.width); H = Math.floor(r.height);
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build(); draw(performance.now());
    }
    function draw(now) {
      ctx.clearRect(0, 0, W, H);
      var speed = 0.16, band = 70, i, p, active = [], maxR = Math.max(W, H) * 1.15, hot = [];
      for (i = 0; i < pings.length; i++) { p = pings[i]; p.r = (now - p.t) * speed; if (p.r < maxR) active.push(p); }
      pings = active;
      /* the cursor eases toward the pointer, and its strength eases in and out */
      cur.x += (cur.tx - cur.x) * 0.08; cur.y += (cur.ty - cur.y) * 0.08;
      cur.str += ((cur.on ? 1 : 0) - cur.str) * 0.06;
      var cursorLive = cur.str > 0.01;
      var dots = new Path2D(), marks = new Path2D();
      for (i = 0; i < cells.length; i++) {
        var cl = cells[i], e = 0;
        for (var k = 0; k < active.length; k++) {
          p = active[k]; var d = Math.abs(Math.hypot(cl.x - p.x, cl.y - p.y) - p.r);
          if (d < band) { var t = 1 - d / band; e = Math.max(e, t * t * (1 - Math.min(p.r / maxR, 1))); }
        }
        if (cursorLive) {
          var dc = Math.hypot(cl.x - cur.x, cl.y - cur.y);
          if (dc < R) { var u = 1 - dc / R; e = Math.max(e, u * u * 0.85 * cur.str); }
        }
        if (e > 0.04) { hot.push(cl, e); continue; }
        if (cl.mark) { var sm = MARKS[cl.m]; for (var j = 0; j < sm.length; j++) { var g = sm[j]; marks.moveTo(cl.x + g[0] * cfg.mark, cl.y + g[1] * cfg.mark); marks.lineTo(cl.x + g[2] * cfg.mark, cl.y + g[3] * cfg.mark); } }
        else { dots.moveTo(cl.x + cfg.base, cl.y); dots.arc(cl.x, cl.y, cfg.base, 0, Math.PI * 2); }
      }
      ctx.fillStyle = opts.cold; ctx.fill(dots);
      ctx.strokeStyle = opts.coldStroke; ctx.lineWidth = 1; ctx.lineCap = 'square'; ctx.stroke(marks);
      for (i = 0; i < hot.length; i += 2) {
        var c2 = hot[i], en = hot[i + 1], a = 0.25 + en * 0.75;
        if (c2.mark) {
          var size = cfg.mark + (cfg.markHot - cfg.mark) * en, s2 = MARKS[c2.m];
          ctx.beginPath();
          for (var q = 0; q < s2.length; q++) { var g2 = s2[q]; ctx.moveTo(c2.x + g2[0] * size, c2.y + g2[1] * size); ctx.lineTo(c2.x + g2[2] * size, c2.y + g2[3] * size); }
          ctx.strokeStyle = opts.hot + a + ')'; ctx.lineWidth = 1 + en * 0.6; ctx.stroke();
        } else {
          ctx.fillStyle = opts.hot + a + ')';
          ctx.beginPath(); ctx.arc(c2.x, c2.y, cfg.base + en * cfg.gain, 0, Math.PI * 2); ctx.fill();
        }
      }
      var moving = Math.abs(cur.tx - cur.x) > 0.5 || Math.abs(cur.ty - cur.y) > 0.5 || Math.abs((cur.on ? 1 : 0) - cur.str) > 0.01;
      return active.length > 0 || (cursorLive && moving) || (cur.on && cursorLive);
    }
    function loop(now) { if (draw(now)) requestAnimationFrame(loop); else running = false; }
    function wake() { if (!running && !reduced) { running = true; requestAnimationFrame(loop); } }
    function ping(x, y) {
      pings.push({ x: x, y: y, t: performance.now() });
      if (pings.length > 4) pings.shift();
      if (reduced) { draw(performance.now() + 1100); return; }
      wake();
    }
    var host = canvas.parentElement;
    host.addEventListener('pointerdown', function (e) {
      if (e.target.closest('a, button')) return;
      var r = canvas.getBoundingClientRect(); ping(e.clientX - r.left, e.clientY - r.top);
    });
    if (canHover && !reduced) {
      host.addEventListener('pointermove', function (e) {
        var r = canvas.getBoundingClientRect();
        cur.tx = e.clientX - r.left; cur.ty = e.clientY - r.top;
        if (!cur.on) { cur.on = true; cur.x = cur.tx; cur.y = cur.ty; }
        wake();
      }, { passive: true });
      host.addEventListener('pointerleave', function () { cur.on = false; wake(); });
    }
    window.addEventListener('resize', resize);
    resize();
    return { pingAt: function (fx, fy) { ping(W * fx, H * fy); } };
  }

  var heroCanvas = document.getElementById('field');
  if (heroCanvas) {
    var f1 = field(heroCanvas, { cold: 'rgba(163,178,158,0.55)', coldStroke: 'rgba(163,178,158,0.62)', hot: 'rgba(52,91,72,' });
    setTimeout(function () { f1.pingAt(0.62, 0.46); }, 500);
  }
  var closeCanvas = document.getElementById('field2');
  if (closeCanvas) {
    var f2 = field(closeCanvas, { cold: 'rgba(163,178,158,0.28)', coldStroke: 'rgba(163,178,158,0.34)', hot: 'rgba(231,226,215,' });
    /* one ring when the section comes into view, then still */
    if ('IntersectionObserver' in window) {
      var seen = false;
      var io = new IntersectionObserver(function (entries) {
        if (seen || !entries.some(function (e) { return e.isIntersecting; })) return;
        seen = true; io.disconnect();
        setTimeout(function () { f2.pingAt(0.72, 0.5); }, 350);
      }, { threshold: 0.4 });
      io.observe(closeCanvas.parentElement);
    }
  }
})();

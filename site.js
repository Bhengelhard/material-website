/* Minted Signals · the field, the headline, the ticker, the clock */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* the four deck marks as line segments in unit space (centered, -0.5..0.5) */
  function seg(a, b, c, d) { return [(a - 50) / 100, (b - 50) / 100, (c - 50) / 100, (d - 50) / 100]; }
  var MARKS = [
    [seg(50, 14, 50, 86), seg(14, 50, 86, 50), seg(24, 24, 76, 76), seg(76, 24, 24, 76)], /* build */
    [seg(20, 20, 80, 80), seg(80, 20, 20, 80)],                                             /* scale */
    [seg(22, 78, 78, 22), seg(42, 22, 78, 22), seg(78, 22, 78, 58)],                        /* partner */
    [seg(50, 14, 50, 42), seg(50, 58, 50, 86), seg(14, 50, 42, 50), seg(58, 50, 86, 50)]    /* systems */
  ];
  function hash(i) { var x = (i * 2654435761) >>> 0; x ^= x >>> 15; x = (x * 2246822519) >>> 0; x ^= x >>> 13; return x; }

  /* A sparse field: dots on a grid, one in nine a mark. A ping sends a ring
     outward; cells inside the ring grow and turn moss, then settle. The loop
     only runs while a ring is alive. */
  function field(canvas, opts) {
    var ctx = canvas.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, cells = [], pings = [], running = false, gap = 24;
    var cfg = { base: 1.1, gain: 2.4, mark: 8, markHot: 15 };
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
      var dots = new Path2D(), marks = new Path2D();
      for (i = 0; i < cells.length; i++) {
        var cl = cells[i], e = 0;
        for (var k = 0; k < active.length; k++) {
          p = active[k]; var d = Math.abs(Math.hypot(cl.x - p.x, cl.y - p.y) - p.r);
          if (d < band) { var t = 1 - d / band; e = Math.max(e, t * t * (1 - Math.min(p.r / maxR, 1))); }
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
      return active.length > 0;
    }
    function loop(now) { if (draw(now)) requestAnimationFrame(loop); else running = false; }
    function ping(x, y) {
      pings.push({ x: x, y: y, t: performance.now() });
      if (pings.length > 6) pings.shift();
      if (reduced) { draw(performance.now() + 1100); return; }
      if (!running) { running = true; requestAnimationFrame(loop); }
    }
    canvas.parentElement.addEventListener('pointerdown', function (e) {
      if (e.target.closest('a, button')) return;
      var r = canvas.getBoundingClientRect(); ping(e.clientX - r.left, e.clientY - r.top);
      var h = document.getElementById('hint'); if (h) h.style.opacity = '0';
    });
    window.addEventListener('resize', resize);
    resize();
    return { ping: ping, pingAt: function (fx, fy) { ping(W * fx, H * fy); } };
  }

  var heroCanvas = document.getElementById('field');
  if (heroCanvas) {
    var f1 = field(heroCanvas, { cold: 'rgba(163,178,158,0.55)', coldStroke: 'rgba(163,178,158,0.62)', hot: 'rgba(52,91,72,' });
    /* two signals on load, then quiet */
    setTimeout(function () { f1.pingAt(0.62, 0.46); }, 500);
    setTimeout(function () { f1.pingAt(0.18, 0.78); }, 2900);
  }
  var closeCanvas = document.getElementById('field2');
  if (closeCanvas) {
    var f2 = field(closeCanvas, { cold: 'rgba(163,178,158,0.28)', coldStroke: 'rgba(163,178,158,0.34)', hot: 'rgba(231,226,215,' });
    /* one signal when the close comes into view */
    if ('IntersectionObserver' in window) {
      var seen = false;
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) { if (en.isIntersecting && !seen) { seen = true; setTimeout(function () { f2.pingAt(0.7, 0.5); }, 300); io.disconnect(); } });
      }, { threshold: 0.35 });
      io.observe(closeCanvas.parentElement);
    } else { f2.pingAt(0.7, 0.5); }
  }

  /* the headline mints itself from noise, once */
  var h1 = document.querySelector('[data-decode]');
  if (h1 && !reduced) {
    var label = h1.textContent.replace(/\s+/g, ' ').trim();
    var glyphs = '0123456789', nodes = [];
    (function wrap(el) {
      Array.prototype.slice.call(el.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (word) {
            if (!word) return;
            if (/^\s+$/.test(word)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w';
            word.split('').forEach(function (c) {
              var s = document.createElement('span'); s.className = 'ch'; s.textContent = c; s.setAttribute('aria-hidden', 'true'); nodes.push({ el: s, c: c }); w.appendChild(s);
            });
            frag.appendChild(w);
          });
          el.replaceChild(frag, n);
        } else if (n.nodeType === 1) wrap(n);
      });
    })(h1);
    h1.setAttribute('aria-label', label);
    var t0 = performance.now();
    (function run(now) {
      var t = now - t0, done = true;
      nodes.forEach(function (n, i) {
        var settle = 380 + i * 42;
        if (t < settle) { done = false; if (Math.random() < 0.5) n.el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)]; }
        else n.el.textContent = n.c;
      });
      if (!done) requestAnimationFrame(run);
    })(t0);
  }

  /* ticker and clock */
  function two(n) { return (n < 10 ? '0' : '') + n; }
  function timeStr() { var d = new Date(); return two(d.getHours()) + ':' + two(d.getMinutes()); }
  var track = document.getElementById('track');
  if (track) {
    var items = (track.getAttribute('data-items') || '').split('|').filter(Boolean);
    items.push('Signal received ' + timeStr() + ' local');
    var html = items.map(function (s) { return '<span>' + s + '</span>'; }).join('');
    track.innerHTML = html + html;
  }
  var clock = document.getElementById('clock');
  if (clock) { var tick = function () { clock.textContent = timeStr(); }; tick(); setInterval(tick, 15000); }
})();

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
     A ring lifts what it passes. Under the cursor, nearby cells lift a
     little and follow it, slowly. A click sends a ring. The loop only
     runs while something is moving.
     opts.quiet() may return rectangles (canvas coords) the field keeps
     clear, fading in over a short distance around them. */
  function field(canvas, opts) {
    var ctx = canvas.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, cells = [], pings = [], running = false, gap = 24, PAD = 26;
    var cfg = { base: 1.1, gain: 2.2, mark: 8, markHot: 14 };
    var speed = opts.speed || 0.16, band = 70;
    var cur = { x: -9999, y: -9999, tx: -9999, ty: -9999, on: false, str: 0 };
    var R = 130;
    var host = canvas.parentElement;
    function build() {
      cells = [];
      var zones = opts.quiet ? opts.quiet() : [];
      var cols = Math.floor(W / gap) + 1, rows = Math.floor(H / gap) + 1;
      var ox = (W - (cols - 1) * gap) / 2, oy = (H - (rows - 1) * gap) / 2;
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
        var i = r * cols + c, h = hash(i + 7), x = ox + c * gap, y = oy + r * gap, q = 1;
        for (var z = 0; z < zones.length && q > 0; z++) {
          var zn = zones[z];
          var dx = Math.max(zn.x - x, 0, x - (zn.x + zn.w)), dy = Math.max(zn.y - y, 0, y - (zn.y + zn.h));
          var d = Math.hypot(dx, dy);
          if (d < PAD) q = Math.min(q, d / PAD);
        }
        if (q > 0.04) cells.push({ x: x, y: y, m: (c + r * 3) % 4, mark: h % 9 === 0, q: q });
      }
    }
    function resize() {
      var r = host.getBoundingClientRect(); W = Math.floor(r.width); H = Math.floor(r.height);
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build(); draw(performance.now());
    }
    function draw(now) {
      ctx.clearRect(0, 0, W, H);
      var i, p, active = [], maxR = Math.max(W, H) * 1.15, hot = [];
      for (i = 0; i < pings.length; i++) { p = pings[i]; p.r = (now - p.t) * speed; if (p.r < maxR) active.push(p); }
      pings = active;
      /* the cursor eases toward the pointer, and its strength eases in and out */
      cur.x += (cur.tx - cur.x) * 0.08; cur.y += (cur.ty - cur.y) * 0.08;
      cur.str += ((cur.on ? 1 : 0) - cur.str) * 0.06;
      var cursorLive = cur.str > 0.01;
      /* cold cells are batched by how quiet they are: four alpha steps */
      var dots = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
      var marks = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
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
        var b = Math.min(3, Math.floor(cl.q * 4 - 0.001));
        if (cl.mark) { var sm = MARKS[cl.m]; for (var j = 0; j < sm.length; j++) { var g = sm[j]; marks[b].moveTo(cl.x + g[0] * cfg.mark, cl.y + g[1] * cfg.mark); marks[b].lineTo(cl.x + g[2] * cfg.mark, cl.y + g[3] * cfg.mark); } }
        else { dots[b].moveTo(cl.x + cfg.base, cl.y); dots[b].arc(cl.x, cl.y, cfg.base, 0, Math.PI * 2); }
      }
      ctx.lineWidth = 1; ctx.lineCap = 'square';
      for (var s = 0; s < 4; s++) {
        ctx.globalAlpha = (s + 1) / 4;
        ctx.fillStyle = opts.cold; ctx.fill(dots[s]);
        ctx.strokeStyle = opts.coldStroke; ctx.stroke(marks[s]);
      }
      ctx.globalAlpha = 1;
      for (i = 0; i < hot.length; i += 2) {
        var c2 = hot[i], en = hot[i + 1], a = (0.25 + en * 0.75) * c2.q;
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
    host.addEventListener('pointerdown', function (e) {
      if (e.target.closest(opts.skip || 'a, button')) return;
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
    if ('ResizeObserver' in window) new ResizeObserver(function () { resize(); }).observe(host);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(resize);
    resize();
    return {
      pingAt: function (fx, fy) { ping(W * fx, H * fy); },
      pingClient: function (cx, cy) { var r = canvas.getBoundingClientRect(); ping(cx - r.left, cy - r.top); },
      speed: speed
    };
  }

  function onceInView(el, threshold, fn) {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (entries) {
      if (!entries.some(function (e) { return e.isIntersecting; })) return;
      io.disconnect(); fn();
    }, { threshold: threshold });
    io.observe(el);
  }

  var heroCanvas = document.getElementById('field');
  if (heroCanvas) {
    var f1 = field(heroCanvas, { cold: 'rgba(163,178,158,0.55)', coldStroke: 'rgba(163,178,158,0.62)', hot: 'rgba(52,91,72,' });
    setTimeout(function () { f1.pingAt(0.62, 0.46); }, 500);
  }

  /* team: the grid stands on its own field. Hover or tap a person and a
     signal leaves from them, lighting each teammate as it reaches them. */
  var teamCanvas = document.getElementById('field-team');
  if (teamCanvas) {
    var sec = teamCanvas.parentElement;
    var cards = Array.prototype.slice.call(sec.querySelectorAll('.tm'));
    var ft = field(teamCanvas, {
      cold: 'rgba(163,178,158,0.5)', coldStroke: 'rgba(163,178,158,0.58)', hot: 'rgba(52,91,72,', speed: 0.3, skip: 'a, button, .tm',
      quiet: function () {
        var cr = teamCanvas.getBoundingClientRect();
        return Array.prototype.map.call(sec.querySelectorAll('.head, .tm .meta, .logos'), function (el) {
          var r = el.getBoundingClientRect();
          return { x: r.left - cr.left, y: r.top - cr.top, w: r.width, h: r.height };
        });
      }
    });
    function center(card) { var r = card.querySelector('.shot').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
    var timers = [];
    function ripple(from) {
      var c = center(from); ft.pingClient(c.x, c.y);
      if (reduced) return;
      timers.forEach(clearTimeout); timers = [];
      cards.forEach(function (card) {
        if (card === from) return;
        var o = center(card), d = Math.hypot(o.x - c.x, o.y - c.y);
        timers.push(setTimeout(function () {
          card.classList.add('lit');
          timers.push(setTimeout(function () { card.classList.remove('lit'); }, 750));
        }, d / ft.speed));
      });
    }
    var lastCard = null, lastT = 0;
    cards.forEach(function (card) {
      function go() { var now = performance.now(); if (card === lastCard && now - lastT < 1500) return; lastCard = card; lastT = now; ripple(card); }
      if (canHover) card.addEventListener('pointerenter', go);
      card.addEventListener('pointerdown', go);
    });
    onceInView(sec.querySelector('.team-grid'), 0.2, function () { setTimeout(function () { ripple(cards[0]); }, 500); });
  }

  var closeCanvas = document.getElementById('field2');
  if (closeCanvas) {
    var f2 = field(closeCanvas, { cold: 'rgba(163,178,158,0.28)', coldStroke: 'rgba(163,178,158,0.34)', hot: 'rgba(231,226,215,' });
    /* one ring when the section comes into view, then still */
    onceInView(closeCanvas.parentElement, 0.4, function () { setTimeout(function () { f2.pingAt(0.72, 0.5); }, 350); });
  }
})();

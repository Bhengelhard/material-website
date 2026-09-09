#!/usr/bin/env node
/*
  Minted Signals · design seed generator
  Prints a few random digit strings plus a handful of "readings" of each
  (shape, runs, dominant digits, balance). The digits are never used on the
  site. They are a prompt: each string gets read like a signal and turned
  into a design direction.

  Usage: node directions/seed.js [count] [length]
*/
const crypto = require('crypto');

const count = parseInt(process.argv[2] || '3', 10);
const length = parseInt(process.argv[3] || '16', 10);

function seed(n) {
  let s = '';
  while (s.length < n) s += crypto.randomInt(0, 10);
  return s;
}

const bars = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█', '█', '█'];

function readings(s) {
  const d = s.split('').map(Number);
  const sum = d.reduce((a, b) => a + b, 0);
  const counts = Array(10).fill(0);
  d.forEach((x) => counts[x]++);
  const dominant = counts.indexOf(Math.max(...counts));
  const missing = counts.map((c, i) => (c === 0 ? i : null)).filter((x) => x !== null);
  let run = 1, best = 1, bestChar = d[0];
  for (let i = 1; i < d.length; i++) {
    if (d[i] === d[i - 1]) { run++; if (run > best) { best = run; bestChar = d[i]; } } else run = 1;
  }
  let rises = 0, falls = 0, flats = 0;
  for (let i = 1; i < d.length; i++) {
    if (d[i] > d[i - 1]) rises++; else if (d[i] < d[i - 1]) falls++; else flats++;
  }
  const evens = d.filter((x) => x % 2 === 0).length;
  const highs = d.filter((x) => x >= 7).length;
  const lows = d.filter((x) => x <= 2).length;
  const first = d.slice(0, Math.floor(d.length / 2));
  const second = d.slice(Math.floor(d.length / 2));
  const avg = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  const drift = avg(second) - avg(first);
  const shape = d.map((x) => bars[x]).join('');
  const jumps = d.slice(1).map((x, i) => Math.abs(x - d[i]));
  const maxJump = Math.max(...jumps);
  const jitter = (jumps.reduce((a, b) => a + b, 0) / jumps.length).toFixed(2);
  return {
    shape,
    'digit sum': sum,
    'dominant digit': `${dominant} (x${counts[dominant]})`,
    'missing digits': missing.length ? missing.join(' ') : 'none',
    'longest run': `${best} of ${bestChar}`,
    'rises / falls / flats': `${rises} / ${falls} / ${flats}`,
    'even : odd': `${evens} : ${d.length - evens}`,
    'highs (7-9) / lows (0-2)': `${highs} / ${lows}`,
    'drift (2nd half vs 1st)': (drift >= 0 ? '+' : '') + drift.toFixed(2),
    'max jump': maxJump,
    'avg jitter': jitter,
  };
}

for (let i = 0; i < count; i++) {
  const s = seed(length);
  console.log(`\nSEED ${String.fromCharCode(65 + i)}  ${s}`);
  const r = readings(s);
  for (const [k, v] of Object.entries(r)) console.log(`  ${k.padEnd(26)} ${v}`);
}
console.log('');

#!/usr/bin/env python3
"""Build the four glass-green options as browsable copies of the site."""
import os, re, shutil, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT  = ROOT / "directions" / "glass"

PAGES = ["index.html", "studio/index.html", "team/index.html", "build/index.html", "404.html"]

OPTIONS = [
    ("1", "Glass",  ["glass.css"],              "#12362A", "The hero's frosted green on every green surface."),
    ("2", "Deep",   ["glass.css", "deep.css"],  "#0A2A1F", "The same glass mixed darker: deep emerald, not forest."),
    ("3", "Drift",  ["glass.css", "drift.css"], "#12362A", "Glass everywhere; the hero's light visibly travels."),
    ("4", "Pane",   ["glass.css", "pane.css"],  "#12362A", "One sheet of green behind the whole site; every surface is a window into it."),
]

SWITCHER = """
<style>
  .optbar{position:fixed;z-index:200;left:50%;bottom:18px;transform:translateX(-50%);display:flex;align-items:center;gap:4px;
    padding:6px;border-radius:999px;background:rgba(18,54,42,.72);backdrop-filter:blur(18px) saturate(1.3);
    -webkit-backdrop-filter:blur(18px) saturate(1.3);box-shadow:0 10px 40px rgba(6,26,19,.35);
    font:500 13px/1 Inter,-apple-system,BlinkMacSystemFont,sans-serif;max-width:calc(100vw - 24px)}
  .optbar a{display:block;padding:9px 14px;border-radius:999px;color:rgba(240,245,242,.72);text-decoration:none;white-space:nowrap;
    transition:background .2s,color .2s}
  .optbar a:hover{color:#F0F5F2}
  .optbar a[aria-current]{background:#F0F5F2;color:#12362A}
  .optbar .ttl{padding:0 10px 0 8px;color:rgba(240,245,242,.5);font-size:12px;letter-spacing:.02em}
  @media (max-width:560px){.optbar .ttl{display:none}.optbar a{padding:9px 12px}}
</style>
<div class="optbar">
  <span class="ttl">Green</span>
__LINKS__
</div>
"""


def rewrite(html, depth, sheets, theme, opt, name):
    up = "../" * depth
    # keep navigation inside this option's copy of the site
    for path, rel in (("/studio/", "studio/"), ("/team/", "team/"), ("/build/", "build/")):
        html = html.replace('href="%s"' % path, 'href="%s%s"' % (up, rel))
    html = re.sub(r'href="/"', 'href="%s"' % (up if depth else "./"), html)

    # load the option's stylesheets after the site's own
    add = "\n".join('  <link rel="stylesheet" href="/directions/glass/%s">' % s for s in sheets)
    html = html.replace('<link rel="stylesheet" href="/styles.css">',
                        '<link rel="stylesheet" href="/styles.css">\n' + add)

    html = re.sub(r'<meta name="theme-color" content="[^"]*">',
                  '<meta name="theme-color" content="%s">' % theme, html)
    html = re.sub(r"<title>([^<]*)</title>",
                  lambda m: "<title>%s · %s</title>" % (name, m.group(1)), html)

    links = []
    for num, label, _, _, _ in OPTIONS:
        cur = ' aria-current="true"' if num == opt else ""
        links.append('  <a href="/directions/glass/%s/"%s>%s &nbsp;%s</a>' % (num, cur, num, label))
    links.append('  <a href="/directions/glass/">All</a>')
    bar = SWITCHER.replace("__LINKS__", "\n".join(links))
    return html.replace("</body>", bar + "\n</body>")


built = []
for opt, name, sheets, theme, _ in OPTIONS:
    dest = OUT / opt
    if dest.exists():
        shutil.rmtree(dest)
    for page in PAGES:
        src = ROOT / page
        html = src.read_text()
        depth = page.count("/")
        out = dest / page
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(rewrite(html, depth, sheets, theme, opt, name))
        built.append(str(out.relative_to(ROOT)))

print("\n".join(built))

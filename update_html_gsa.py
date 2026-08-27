import re

with open('index.html', 'r') as f:
    html = f.read()

target = '    <div id="view-landing" class="view active">\n      <div class="lang-toggle">'
gsa_html = """    <div id="view-landing" class="view active">
      <div class="gsa-badge">
        <span class="gsa-logo">
          <span style="color:#4285F4">G</span><span style="color:#EA4335">S</span><span style="color:#FBBC05">A</span>
        </span>
        <span class="gsa-text">made by Google Student Ambassador Team고려대</span>
      </div>
      <div class="lang-toggle">"""

html = html.replace(target, gsa_html)

with open('index.html', 'w') as f:
    f.write(html)

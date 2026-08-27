import re

with open('index.html', 'r') as f:
    html = f.read()

# Replace best record container with promo banner
old_best_record = r'<div class="record-container" id="best-record-container".*?</div>'
promo_banner = '<div class="promo-banner-global"></div>'
html = re.sub(old_best_record, promo_banner, html, flags=re.DOTALL)

# Remove promo banner from footer
old_footer = r'<footer>\s*<button id="btn-ready".*?</button>\s*<div class="promo-banner-global"></div>\s*</footer>'
new_footer = '<footer>\n        <button id="btn-ready" class="primary-btn" data-i18n="btnReady">도전 준비</button>\n      </footer>'
html = re.sub(old_footer, new_footer, html)

with open('index.html', 'w') as f:
    f.write(html)

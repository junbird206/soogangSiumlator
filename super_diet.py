import re

with open('index.html', 'r') as f:
    html = f.read()

# 1. Remove GSA logo
gsa_regex = r'<div class="gsa-badge">.*?</div>'
html = re.sub(gsa_regex, '', html, flags=re.DOTALL)

# 2. Add reset notice
old_title = '<h3 data-i18n="leaderboardTitle">🔥 오늘의 Top 5</h3>'
new_title = """<div class="leaderboard-title-wrapper">
            <h3 data-i18n="leaderboardTitle">🔥 오늘의 Top 5</h3>
            <span class="reset-notice">매일 00시 기록이 초기화됩니다</span>
          </div>"""
html = html.replace(old_title, new_title)

with open('index.html', 'w') as f:
    f.write(html)


with open('style.css', 'r') as f:
    css = f.read()

# 3. Super diet CSS
css = css.replace('.rules {\n  background: var(--toss-bg);\n  padding: 0.75rem 1rem;\n  border-radius: 12px;\n  list-style: none;\n  margin-bottom: 1rem;\n  font-weight: 500;\n  font-size: 0.85rem;\n}', '.rules {\n  background: var(--toss-bg);\n  padding: 0.5rem 0.75rem;\n  border-radius: 10px;\n  list-style: none;\n  margin-bottom: 0.5rem;\n  font-weight: 500;\n  font-size: 0.75rem;\n}')

css = css.replace('.promo-banner-global {\n  margin-top: 1.5rem;\n  padding: 1rem;\n  background: rgba(49, 130, 246, 0.08);\n  border-radius: 12px;\n  color: var(--toss-blue);\n  text-align: center;\n}', '.promo-banner-global {\n  margin-top: 0.5rem;\n  padding: 0.75rem;\n  background: rgba(49, 130, 246, 0.08);\n  border-radius: 10px;\n  color: var(--toss-blue);\n  text-align: center;\n}')
css = css.replace('.promo-banner-global {\n  margin-bottom: 1rem;\n  background: var(--toss-blue-light);\n  border-radius: 12px;\n  padding: 1rem;\n  text-align: center;\n}', '.promo-banner-global {\n  margin-bottom: 0.5rem;\n  background: var(--toss-blue-light);\n  border-radius: 10px;\n  padding: 0.75rem;\n  text-align: center;\n}')

css = css.replace('.leaderboard-container {\n  margin-top: 0.75rem;\n  margin-bottom: 1rem;\n  background: var(--toss-surface);\n  border: 1px solid #e5e8eb;\n  border-radius: 12px;\n  padding: 0.8rem 1rem;\n  box-shadow: 0 4px 12px rgba(0,0,0,0.05);\n}', '.leaderboard-container {\n  margin-top: 0.5rem;\n  margin-bottom: 0.5rem;\n  background: var(--toss-surface);\n  border: 1px solid #e5e8eb;\n  border-radius: 10px;\n  padding: 0.5rem 0.75rem;\n  box-shadow: 0 4px 12px rgba(0,0,0,0.05);\n}')

css = css.replace('.leaderboard-container h3 {\n  font-size: 1.1rem;\n  font-weight: 700;\n  margin-bottom: 0.5rem;\n  color: var(--toss-text-title);\n  text-align: left;\n}', '.leaderboard-container h3 {\n  font-size: 0.95rem;\n  font-weight: 700;\n  margin-bottom: 0;\n  color: var(--toss-text-title);\n}')

css = css.replace('.leaderboard-item {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.35rem 0;\n  border-bottom: 1px solid #f2f4f6;\n  font-size: 0.9rem;\n}', '.leaderboard-item {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.25rem 0;\n  border-bottom: 1px solid #f2f4f6;\n  font-size: 0.8rem;\n}')

css = css.replace('.report-hint {\n  font-size: 0.75rem;\n  color: #f04452;\n  text-align: center;\n  margin-top: 1rem;\n  margin-bottom: 0;\n  opacity: 0.8;\n}', '.report-hint {\n  font-size: 0.65rem;\n  color: #f04452;\n  text-align: center;\n  margin-top: 0.5rem;\n  margin-bottom: 0;\n  opacity: 0.8;\n}')

css = css.replace('.all-time-best-container {\n  margin-top: 1.5rem;\n  padding: 0.8rem 1rem;\n', '.all-time-best-container {\n  margin-top: 0.75rem;\n  padding: 0.5rem 0.75rem;\n')
css = css.replace('.all-time-content .rank-name {\n  font-size: 1.05rem;\n  font-weight: 700;\n}', '.all-time-content .rank-name {\n  font-size: 0.9rem;\n  font-weight: 700;\n}')
css = css.replace('.all-time-content .rank-delay {\n  font-size: 1.05rem;\n}', '.all-time-content .rank-delay {\n  font-size: 0.9rem;\n}')
css = css.replace('.all-time-header {\n  font-size: 0.85rem;\n  font-weight: 700;\n  color: #b8860b;\n  margin-bottom: 0.5rem;\n}', '.all-time-header {\n  font-size: 0.75rem;\n  font-weight: 700;\n  color: #b8860b;\n  margin-bottom: 0.25rem;\n}')

# Add new wrapper css
new_css = """
.leaderboard-title-wrapper {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}
.reset-notice {
  font-size: 0.65rem;
  color: var(--toss-text-muted);
}
"""
css += new_css

with open('style.css', 'w') as f:
    f.write(css)


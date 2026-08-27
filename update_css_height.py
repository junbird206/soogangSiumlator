import re

with open('style.css', 'r') as f:
    css = f.read()

css = css.replace('.rules {\n  background: var(--toss-surface);\n  border-radius: 16px;\n  padding: 1.5rem;\n  margin-bottom: 2rem;', '.rules {\n  background: var(--toss-surface);\n  border-radius: 16px;\n  padding: 1rem 1.25rem;\n  margin-bottom: 1rem;')
css = css.replace('.leaderboard-container {\n  margin-top: 2rem;\n  margin-bottom: 2.5rem;\n  background: var(--toss-surface);\n  border: 1px solid #e5e8eb;\n  border-radius: 16px;\n  padding: 1.5rem;', '.leaderboard-container {\n  margin-top: 1rem;\n  margin-bottom: 1.5rem;\n  background: var(--toss-surface);\n  border: 1px solid #e5e8eb;\n  border-radius: 16px;\n  padding: 1rem 1.25rem;')
css = css.replace('.leaderboard-item {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.75rem 0;', '.leaderboard-item {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.5rem 0;')
css = css.replace('.promo-banner-global {\n  margin-bottom: 1rem;\n  background: var(--toss-blue-light);\n  border-radius: 12px;\n  padding: 1.25rem;\n  text-align: center;', '.promo-banner-global {\n  margin-bottom: 1rem;\n  background: var(--toss-blue-light);\n  border-radius: 12px;\n  padding: 1rem;\n  text-align: center;')
css = css.replace('.promo-banner-global h3 {\n  color: var(--toss-blue);\n  font-size: 1.1rem;\n  font-weight: 700;\n  margin-bottom: 0.5rem;\n}', '.promo-banner-global h3 {\n  color: var(--toss-blue);\n  font-size: 1rem;\n  font-weight: 700;\n  margin-bottom: 0.4rem;\n}')
css = css.replace('.promo-banner-global p {\n  color: var(--toss-text-muted);\n  font-size: 0.9rem;\n  font-weight: 600;\n  margin: 0;\n}', '.promo-banner-global p {\n  color: var(--toss-text-muted);\n  font-size: 0.85rem;\n  font-weight: 600;\n  margin: 0;\n}')

with open('style.css', 'w') as f:
    f.write(css)

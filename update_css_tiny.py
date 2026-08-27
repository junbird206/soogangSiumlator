import re

with open('style.css', 'r') as f:
    css = f.read()

# Make rules smaller
css = css.replace('.rules {\n  background: var(--toss-bg);\n  padding: 1rem 1.25rem;\n  border-radius: 16px;\n  list-style: none;\n  margin-bottom: 1rem;\n  font-weight: 500;\n}', '.rules {\n  background: var(--toss-bg);\n  padding: 0.75rem 1rem;\n  border-radius: 12px;\n  list-style: none;\n  margin-bottom: 1rem;\n  font-weight: 500;\n  font-size: 0.85rem;\n}')

# Leaderboard size reduction
css = css.replace('.leaderboard-container {\n  margin-top: 1rem;\n  margin-bottom: 1.5rem;\n  background: var(--toss-surface);\n  border: 1px solid #e5e8eb;\n  border-radius: 16px;\n  padding: 1rem 1.25rem;\n  box-shadow: 0 4px 12px rgba(0,0,0,0.05);\n}', '.leaderboard-container {\n  margin-top: 0.75rem;\n  margin-bottom: 1rem;\n  background: var(--toss-surface);\n  border: 1px solid #e5e8eb;\n  border-radius: 12px;\n  padding: 0.8rem 1rem;\n  box-shadow: 0 4px 12px rgba(0,0,0,0.05);\n}')

css = css.replace('.leaderboard-container h3 {\n  font-size: 1.25rem;\n  font-weight: 700;\n  margin-bottom: 1rem;\n  color: var(--toss-text-title);\n  text-align: left;\n}', '.leaderboard-container h3 {\n  font-size: 1.1rem;\n  font-weight: 700;\n  margin-bottom: 0.5rem;\n  color: var(--toss-text-title);\n  text-align: left;\n}')

css = css.replace('.leaderboard-item {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.5rem 0;\n  border-bottom: 1px solid #f2f4f6;\n}', '.leaderboard-item {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.35rem 0;\n  border-bottom: 1px solid #f2f4f6;\n  font-size: 0.9rem;\n}')

css = css.replace('.promo-banner-global p {\n  color: var(--toss-text-muted);\n  font-size: 0.85rem;\n  font-weight: 600;\n  margin: 0;\n}', '.promo-banner-global p {\n  color: var(--toss-text-muted);\n  font-size: 0.85rem;\n  font-weight: 600;\n  margin: 0;\n  text-decoration: underline;\n}')

# Add GSA CSS
new_css = """
.gsa-badge {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--toss-text-muted);
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
}
.gsa-logo {
  font-weight: 900;
  font-size: 0.8rem;
  letter-spacing: -0.5px;
}
"""
css += new_css

with open('style.css', 'w') as f:
    f.write(css)

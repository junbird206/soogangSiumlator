import re

with open('style.css', 'r') as f:
    css = f.read()

# Change rank-delay and rank-name colors
css = css.replace('.rank-name {\n  font-weight: 600;\n  color: var(--toss-text-title);\n}', '.rank-name {\n  font-weight: 600;\n  color: var(--toss-text);\n}')
css = css.replace('.rank-delay {\n  font-family: "SF Mono", monospace;\n  font-weight: 700;\n  color: var(--toss-text-title);\n}', '.rank-delay {\n  font-family: "SF Mono", monospace;\n  font-weight: 600;\n  color: var(--toss-text);\n}')

# Remove .btn-report
css = re.sub(r'\.btn-report \{.*?\}', '', css, flags=re.DOTALL)
css = re.sub(r'\.btn-report:hover \{.*?\}', '', css, flags=re.DOTALL)

# Add rank colors and report-hint
new_css = """
.rank-1 { color: #d4af37 !important; }
.rank-2 { color: #a9a9a9 !important; }
.rank-3 { color: #cd7f32 !important; }
.rank-other { color: var(--toss-text-muted) !important; }

.report-hint {
  font-size: 0.75rem;
  color: #f04452;
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 0;
  opacity: 0.8;
}
"""
css += new_css

with open('style.css', 'w') as f:
    f.write(css)

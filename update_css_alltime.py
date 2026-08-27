import re

with open('style.css', 'r') as f:
    css = f.read()

new_css = """
.all-time-best-container {
  margin-top: 1.5rem;
  padding: 0.8rem 1rem;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.05) 100%);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
}

.all-time-header {
  font-size: 0.85rem;
  font-weight: 700;
  color: #b8860b;
  margin-bottom: 0.5rem;
}

.all-time-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.all-time-content .rank-name {
  font-size: 1.05rem;
  font-weight: 700;
}

.all-time-content .rank-delay {
  font-size: 1.05rem;
}
"""

css += new_css

with open('style.css', 'w') as f:
    f.write(css)

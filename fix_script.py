import re

with open('script.js', 'r') as f:
    text = f.read()

target = r"""  if \(gameState\.bestRecord !== null\) \{
    const bestRecordText = document\.getElementById\('best-record-text'\);
    bestRecordText\.textContent = `\$\{gameState\.bestRecord\}ms`;
  \}"""

text = re.sub(target, '', text)

with open('script.js', 'w') as f:
    f.write(text)

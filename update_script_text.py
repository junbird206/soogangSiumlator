import re

with open('script.js', 'r') as f:
    text = f.read()

text = text.replace("'인스타 프로필 링크에서 바로 수령 가능!'", "'터치하면 바로 수령 가능'")

with open('script.js', 'w') as f:
    f.write(text)

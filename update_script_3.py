import re

with open('script.js', 'r') as f:
    text = f.read()

# Update translations
text = text.replace("'10시 정각, 몇 밀리초 만에 누를 수 있나요?'", "'전국에서 수강신청 젤 잘하는 사람은 누구?'")
text = text.replace("'대학생·대학원생 Google AI Plus 12개월 무료'", "'대학생/대학원생이라면 Google AI plus 1년 무료'")
text = text.replace("'인스타 팔로우하고 혜택 안내받기 👉'", "'인스타 프로필 링크에서 바로 수령 가능!'")

# Remove best record logic
text = re.sub(r'const bestRecordContainer = document\.getElementById\(\'best-record-container\'\);\nconst bestRecordText = document\.getElementById\(\'best-record-text\'\);\n', '', text)

init_landing_old = r"""function initLanding\(\) \{
  if \(gameState\.bestRecord !== null\) \{
    bestRecordContainer\.style\.display = 'block';
    bestRecordText\.textContent = `\$\{gameState\.bestRecord\}ms`;
  \} else \{
    bestRecordContainer\.style\.display = 'none';
  \}
  loadTopRecords\(\); // Reload leaderboard every time we go to landing
  switchView\('landing'\);
\}"""
init_landing_new = """function initLanding() {
  loadTopRecords(); // Reload leaderboard every time we go to landing
  switchView('landing');
}"""
text = re.sub(init_landing_old, init_landing_new, text)

update_best_old = r"""  // Re-init promos and dynamic elements
  initPromoUI\(\);
  if \(gameState\.bestRecord !== null\) \{
    const bestRecordText = document\.getElementById\(\'best-record-text\'\);
    bestRecordText\.textContent = `\$\{gameState\.bestRecord\}ms`;
  \}"""
update_best_new = """  // Re-init promos and dynamic elements
  initPromoUI();"""
text = text.replace(update_best_old, update_best_new)


with open('script.js', 'w') as f:
    f.write(text)

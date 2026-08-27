import re

with open('index.html', 'r') as f:
    html = f.read()

target = '          <p class="report-hint" data-i18n="reportHint">닉네임이 불쾌하다면 꾹 눌러서 신고해주세요.</p>'
new_content = """          <div id="all-time-best-container" class="all-time-best-container" style="display: none;">
            <div class="all-time-header">👑 All-Time No.1</div>
            <div class="all-time-content">
              <div class="rank-name" id="all-time-name"></div>
              <div class="rank-score">
                <span class="rank-delay" id="all-time-delay"></span>
                <span class="rank-time" id="all-time-date"></span>
              </div>
            </div>
          </div>
          <p class="report-hint" data-i18n="reportHint">닉네임이 불쾌하다면 꾹 눌러서 신고해주세요.</p>"""

html = html.replace(target, new_content)

with open('index.html', 'w') as f:
    f.write(html)

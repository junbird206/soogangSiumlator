import re

with open('script.js', 'r') as f:
    text = f.read()

old_func = r"async function loadTopRecords\(\) \{.*?\} catch\(e\) \{\n    console\.warn\(\"Failed to load leaderboard:\", e\);\n  \}\n\}"

new_func = """async function loadTopRecords() {
  const listEl = document.getElementById('leaderboard-list');
  if (!supabaseClient) {
    listEl.innerHTML = `<li class="empty-leaderboard">🔥 DB 연동 대기 중 (Supabase 설정 필요)</li>`;
    return;
  }
  
  try {
    const todayStr = getTodayString();
    
    const { data, error } = await supabaseClient
      .from('leaderboard')
      .select('*')
      .eq('dateString', todayStr)
      .order('delayMs', { ascending: true })
      .limit(5);
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      listEl.innerHTML = `<li class="empty-leaderboard" data-i18n="leaderboardEmpty">${i18n[currentLang].leaderboardEmpty}</li>`;
      return;
    }

    listEl.innerHTML = '';
    let rank = 1;
    data.forEach(doc => {
      const li = document.createElement('li');
      li.className = 'leaderboard-item';
      li.style.cursor = 'pointer';
      li.style.userSelect = 'none';
      
      const timeStr = doc.createdAt ? new Date(doc.createdAt).toLocaleTimeString(currentLang === 'ko' ? 'ko-KR' : 'en-US', {hour: '2-digit', minute:'2-digit'}) : '';
      const rankClass = rank <= 3 ? `rank-${rank}` : 'rank-other';
      
      li.innerHTML = `
        <div class="rank-info">
          <span class="rank-num ${rankClass}">${rank}</span>
          <span class="rank-name">${escapeHTML(doc.nickname)}</span>
        </div>
        <div class="rank-score">
          <span class="rank-delay">+${Number(doc.delayMs).toFixed(1)}ms</span>
          <span class="rank-time">${timeStr}</span>
        </div>
      `;
      
      // 꾹 누르기 (롱프레스) 신고 기능
      let pressTimer;
      const startPress = (e) => {
        pressTimer = window.setTimeout(() => {
          reportRecord(doc.id || '', doc.nickname);
        }, 800);
      };
      const cancelPress = () => {
        clearTimeout(pressTimer);
      };
      
      li.addEventListener('mousedown', startPress);
      li.addEventListener('touchstart', startPress, {passive: true});
      li.addEventListener('mouseup', cancelPress);
      li.addEventListener('mouseleave', cancelPress);
      li.addEventListener('touchend', cancelPress);
      li.addEventListener('touchcancel', cancelPress);

      listEl.appendChild(li);
      rank++;
    });
  } catch(e) {
    console.warn("Failed to load leaderboard:", e);
  }
}"""

new_text = re.sub(old_func, new_func, text, flags=re.DOTALL)
with open('script.js', 'w') as f:
    f.write(new_text)

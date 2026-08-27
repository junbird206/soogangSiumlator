import re

with open('script.js', 'r') as f:
    text = f.read()

target = '  } catch(e) {\n    console.warn("Failed to load leaderboard:", e);\n  }'
new_logic = """
    // All-time No.1 로드
    const { data: allTimeData, error: allTimeError } = await supabaseClient
      .from('leaderboard')
      .select('*')
      .order('delayMs', { ascending: true })
      .limit(1);
      
    if (!allTimeError && allTimeData && allTimeData.length > 0) {
      const best = allTimeData[0];
      document.getElementById('all-time-best-container').style.display = 'block';
      document.getElementById('all-time-name').textContent = escapeHTML(best.nickname);
      document.getElementById('all-time-delay').textContent = `+${Number(best.delayMs).toFixed(1)}ms`;
      
      let dateStr = '';
      if (best.createdAt) {
        const d = new Date(best.createdAt);
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        dateStr = `${m}/${day} ` + d.toLocaleTimeString(currentLang === 'ko' ? 'ko-KR' : 'en-US', {hour: '2-digit', minute:'2-digit'});
      }
      document.getElementById('all-time-date').textContent = dateStr;
    }
  } catch(e) {
    console.warn("Failed to load leaderboard:", e);
  }
"""

text = text.replace(target, new_logic)

with open('script.js', 'w') as f:
    f.write(text)

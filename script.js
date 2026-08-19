// Constants
const GAME_DURATION_MS = 10000; // 10초 대기
const CAMPAIGN_MODE = 'PRE_LAUNCH';  // 'PRE_LAUNCH' | 'LIVE'
const TEAM_SIGNUP_LINK = '';          // LIVE 전환 시 여기에 링크 주입
const INSTAGRAM_URL = 'https://www.instagram.com/gemini_koreauniv/'; // 임시 핸들

// Audio Context
let audioCtx = null;
let beepBuffer = null;
let currentBeepSource = null; // 오디오 중단을 위해 추가

// Game State
let gameState = {
  startTime: 0,
  targetTime: 0,
  isGameRunning: false,
  hasClicked: false,
  bestRecord: localStorage.getItem('courseRegBestRecord') ? parseInt(localStorage.getItem('courseRegBestRecord')) : null,
  animationFrameId: null
};

// ... DOM Elements ... (unchanged)
const views = {
  landing: document.getElementById('view-landing'),
  ready: document.getElementById('view-ready'),
  game: document.getElementById('view-game'),
  result: document.getElementById('view-result')
};

const clockEl = document.getElementById('clock');
const btnAction = document.getElementById('btn-action');
const btnReady = document.getElementById('btn-ready');
const btnStart = document.getElementById('btn-start');
const btnRetry = document.getElementById('btn-retry');
const btnShare = document.getElementById('btn-share');

const bestRecordContainer = document.getElementById('best-record-container');
const bestRecordText = document.getElementById('best-record-text');

// GA4 Tracker
function sendGAEvent(eventName, params = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
  }
}

// Promo UI Logic
function initPromoUI() {
  const ctaBody = document.getElementById('cta-body');
  const btnCta = document.getElementById('btn-cta');
  const promoBanners = document.querySelectorAll('.promo-banner-global');
  
  const activeMode = (CAMPAIGN_MODE === 'LIVE' && TEAM_SIGNUP_LINK) ? 'LIVE' : 'PRE_LAUNCH';

  if (activeMode === 'PRE_LAUNCH') {
    promoBanners.forEach(el => el.innerHTML = '대학생·대학원생 Google AI Plus 12개월 무료<br><span class="banner-sub">혜택 안내 준비 중</span>');
    if (ctaBody) ctaBody.innerHTML = '대학생·대학원생을 위한 Google AI Plus 12개월 무료 혜택,<br>곧 안내드립니다. 놓치지 않으려면 팔로우해주세요.';
    if (btnCta) {
      btnCta.textContent = '인스타그램 팔로우하고 소식 받기';
      btnCta.onclick = () => {
        sendGAEvent('cta_click', { mode: 'PRE_LAUNCH' });
        window.open(INSTAGRAM_URL, '_blank');
      };
    }
  } else {
    promoBanners.forEach(el => el.innerHTML = '대학생·대학원생 Google AI Plus 12개월 무료');
    if (ctaBody) ctaBody.innerHTML = '대학생·대학원생은 Google AI Plus를 12개월 무료로 쓸 수 있어요.';
    if (btnCta) {
      btnCta.textContent = '12개월 무료로 시작하기';
      btnCta.onclick = () => {
        sendGAEvent('cta_click', { mode: 'LIVE' });
        window.open(TEAM_SIGNUP_LINK, '_blank');
      };
    }
  }
}

initPromoUI();

// Initialize Landing
function initLanding() {
  if (gameState.bestRecord !== null) {
    bestRecordContainer.style.display = 'block';
    bestRecordText.textContent = `${gameState.bestRecord}ms`;
  } else {
    bestRecordContainer.style.display = 'none';
  }
  switchView('landing');
}

initLanding();

// View Switcher
function switchView(viewName) {
  Object.values(views).forEach(el => el.classList.remove('active'));
  views[viewName].classList.add('active');
}

// Format Time (09:59:XX.XX or 10:00:XX.XX)
function formatClock(remainingMs) {
  const elapsed = GAME_DURATION_MS - remainingMs; 
  let totalSeconds = 50 + Math.floor(elapsed / 1000); 
  
  let hours = 9;
  let minutes = 59;
  
  if (totalSeconds >= 60) {
    minutes += Math.floor(totalSeconds / 60);
    totalSeconds = totalSeconds % 60;
  }
  if (minutes >= 60) {
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;
  }
  
  // elapsed가 정확히 음수/양수일 때 모두 밀리초 표기를 보정
  let elapsedMs = elapsed % 1000;
  if (elapsedMs < 0) elapsedMs += 1000;
  const ms = Math.floor(elapsedMs / 10);
  
  const hrStr = hours.toString().padStart(2, '0');
  const minStr = minutes.toString().padStart(2, '0');
  const secStr = totalSeconds.toString().padStart(2, '0');
  const msStr = ms.toString().padStart(2, '0');
  
  return `${hrStr}:${minStr}:${secStr}.${msStr}`;
}

// Audio System
function base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

async function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  if (!beepBuffer && typeof navyismBase64 !== 'undefined') {
    try {
      const arrayBuffer = base64ToArrayBuffer(navyismBase64);
      beepBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    } catch (e) {
      console.error('Failed to decode navyism audio:', e);
    }
  }
}

function scheduleBeeps() {
  if (!audioCtx) return;
  
  const nowAudio = audioCtx.currentTime;
  
  // mp3 파일 내에서 마지막 긴 '삐~' 소리가 시작되는 정확한 시점(초)
  // 소리가 정각보다 살짝 빨리 나온다는 피드백 반영: 재생 시작을 살짝 늦추기 위해 값을 7.16 -> 7.08 로 줄임
  const FINAL_BEEP_START_TIME = 7.08;
  
  // 10초(GAME_DURATION_MS) 뒤인 정각에, 파일의 FINAL_BEEP_START_TIME 지점이 오도록 역산하여 1번만 재생
  const timeToPlay = (GAME_DURATION_MS / 1000) - FINAL_BEEP_START_TIME;
  
  playBeep(nowAudio + timeToPlay);
}

function playBeep(startTime) {
  if (!beepBuffer) return; // 로드 실패 시 무음 처리
  const source = audioCtx.createBufferSource();
  source.buffer = beepBuffer;
  source.connect(audioCtx.destination);
  
  // startTime이 현재 시간보다 과거면 즉시 재생 (혹시 모를 버그 방지)
  source.start(Math.max(startTime, audioCtx.currentTime));
  
  currentBeepSource = source; // 실패 시 멈추기 위해 저장
}

// Game Logic
function startGame() {
  switchView('game');
  
  const now = performance.now();
  gameState.startTime = now;
  gameState.targetTime = now + GAME_DURATION_MS;
  gameState.isGameRunning = true;
  gameState.hasClicked = false;
  
  clockEl.classList.remove('clock-warning');
  scheduleBeeps();
  
  updateClock();
}

function updateClock() {
  if (!gameState.isGameRunning) return;
  
  const now = performance.now();
  const remaining = gameState.targetTime - now;
  
  clockEl.textContent = formatClock(remaining);
  
  // 마지막 5초에 시계 색상 변경
  if (remaining <= 5000 && remaining > 0) {
    clockEl.classList.add('clock-warning');
  }
  
  if (remaining <= -3000) {
    // 3초 지날 때까지 안 누르면 장바구니행
    endGame(null);
    return;
  }
  
  gameState.animationFrameId = requestAnimationFrame(updateClock);
}

function handleAction(e) {
  if (e) e.preventDefault(); // 더블 탭 확대 등 방지
  
  if (!gameState.isGameRunning || gameState.hasClicked) return;
  gameState.hasClicked = true;
  gameState.isGameRunning = false;
  cancelAnimationFrame(gameState.animationFrameId);
  
  const clickTime = e && e.timeStamp ? e.timeStamp : performance.now();
  const delay = clickTime - gameState.targetTime;
  
  // 광탈(0ms 미만)인 경우 오디오 중지
  if (delay < 0 && currentBeepSource) {
    try {
      currentBeepSource.stop();
    } catch (err) {
      // 이미 멈췄거나 오류가 나는 경우 무시
    }
  }
  
  endGame(delay);
}

// Event Listeners
btnReady.addEventListener('click', () => {
  switchView('ready');
});

btnStart.addEventListener('click', async () => {
  // 버튼 비활성화 (여러번 클릭 방지)
  btnStart.disabled = true;
  btnStart.textContent = '준비 중...';
  
  await initAudio(); // 오디오 디코딩 완료 대기
  
  btnStart.disabled = false;
  btnStart.textContent = '시작하기';
  
  startGame();
});

// pointerdown을 사용하여 최대한 빠르게 입력 받기 (모바일 탭 딜레이 우회)
btnAction.addEventListener('pointerdown', handleAction);

btnRetry.addEventListener('click', () => {
  initLanding();
});

// Result Logic
function getGrade(delay) {
  if (delay < 0) {
    return { badge: "❌", title: "광탈", msg: "서버도 안 열렸는데 눌렀습니다", color: "#f04452", bg: "#fef0f1" };
  } else if (delay <= 50) {
    return { badge: "🏆", title: "수강신청의 신", msg: "매크로 의심받는 속도", color: "#3182f6", bg: "rgba(49, 130, 246, 0.1)" };
  } else if (delay <= 150) {
    return { badge: "🥇", title: "광클 마스터", msg: "원하는 강의 전부 잡음", color: "#1b64da", bg: "rgba(49, 130, 246, 0.06)" };
  } else if (delay <= 300) {
    return { badge: "🥈", title: "무난한 인간", msg: "전공은 잡았고 교양은 글쎄", color: "#333d4b", bg: "#f2f4f6" };
  } else if (delay <= 500) {
    return { badge: "🥉", title: "대기 15번", msg: "개강하고 눈치싸움 시작", color: "#f59e0b", bg: "#fffbeb" };
  } else if (delay <= 1000) {
    return { badge: "😵", title: "장바구니 관람객", msg: "담아둔 건 많은데 잡힌 건 없음", color: "#f97316", bg: "#fff7ed" };
  } else {
    return { badge: "💀", title: "재수강 확정", msg: "내년에 만나요", color: "#191f28", bg: "#e5e8eb" };
  }
}

function endGame(delay) {
  // delay == null 이면 3초 초과로 장바구니 관람객 처리
  const actualDelay = delay === null ? 3001 : delay;
  const grade = getGrade(actualDelay);
  
  const statusEl = document.getElementById('result-status');
  const delayEl = document.getElementById('result-delay');
  const badgeEl = document.getElementById('result-badge');
  const msgEl = document.getElementById('result-message');
  const compareEl = document.getElementById('record-compare-container');
  
  statusEl.textContent = grade.title;
  statusEl.style.color = grade.color;
  
  badgeEl.textContent = grade.badge;
  badgeEl.style.backgroundColor = grade.bg;
  badgeEl.style.color = grade.color;
  
  msgEl.textContent = grade.msg;
  
  compareEl.innerHTML = ''; // reset
  
  if (delay < 0) {
    const earlySec = (Math.abs(actualDelay) / 1000).toFixed(3);
    delayEl.textContent = `-${earlySec}초`;
    delayEl.style.color = "var(--toss-danger)";
    sendGAEvent('game_fail_early');
    
    // 광탈 시 공유 버튼 숨기기
    btnShare.style.display = 'none';
  } else {
    const msStr = actualDelay > 3000 ? ">3000ms" : `+${Math.floor(actualDelay)}ms`;
    delayEl.textContent = msStr;
    delayEl.style.color = "var(--toss-text-title)";
    sendGAEvent('game_complete', { grade: grade.title, delay_ms: Math.floor(actualDelay) });
    
    // 성공 시 공유 버튼 보이기
    btnShare.style.display = 'block';
    
    // 최고기록 갱신 로직 (성공한 경우에만)
    if (actualDelay <= 3000) {
      if (gameState.bestRecord === null || actualDelay < gameState.bestRecord) {
        const oldRecord = gameState.bestRecord;
        gameState.bestRecord = Math.floor(actualDelay);
        localStorage.setItem('courseRegBestRecord', gameState.bestRecord);
        
        if (oldRecord !== null) {
          compareEl.innerHTML = `이전 최고 ${oldRecord}ms &mdash; <span class="new-record">🎉 신기록!</span>`;
        } else {
          compareEl.innerHTML = `<span class="new-record">🎉 첫 기록 달성!</span>`;
        }
      } else {
        compareEl.innerHTML = `내 최고 기록: ${gameState.bestRecord}ms`;
      }
    }
  }
  
  // 캔버스 이미지 그리기 용도로 글로벌 저장
  gameState.lastGrade = grade;
  gameState.lastDelay = actualDelay;
  
  switchView('result');
}

// Share Logic (Canvas)
btnShare.addEventListener('click', async () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  
  // 배경색
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 헤더
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 70px Pretendard, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('수강신청 반응속도 시뮬레이터', canvas.width / 2, 400);
  
  // 뱃지 원 배경
  ctx.fillStyle = gameState.lastGrade.bg;
  ctx.beginPath();
  ctx.arc(canvas.width / 2, 700, 150, 0, Math.PI * 2);
  ctx.fill();
  
  // 이모지 (뱃지)
  ctx.font = '120px -apple-system, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText(gameState.lastGrade.badge, canvas.width / 2, 700);
  
  ctx.textBaseline = 'alphabetic'; // 원복
  
  // 상태 제목
  ctx.fillStyle = gameState.lastGrade.color;
  ctx.font = 'bold 90px Pretendard, -apple-system, sans-serif';
  ctx.fillText(gameState.lastGrade.title, canvas.width / 2, 1000);
  
  // 지연 시간
  let delayStr = "";
  if (gameState.lastDelay < 0) {
    const earlySec = (Math.abs(gameState.lastDelay) / 1000).toFixed(3);
    delayStr = `-${earlySec}초`;
    ctx.fillStyle = '#f04452';
  } else {
    delayStr = gameState.lastDelay > 3000 ? ">3000ms" : `+${Math.floor(gameState.lastDelay)}ms`;
    ctx.fillStyle = '#0f172a';
  }
  ctx.font = 'bold 160px "SF Mono", monospace';
  ctx.fillText(delayStr, canvas.width / 2, 1250);
  
  // 메시지
  ctx.fillStyle = '#64748b';
  ctx.font = '50px Pretendard, -apple-system, sans-serif';
  ctx.fillText(gameState.lastGrade.msg, canvas.width / 2, 1400);
  
  // URL 워터마크
  ctx.fillStyle = '#8b95a1';
  ctx.font = 'bold 45px Pretendard, -apple-system, sans-serif';
  ctx.fillText('soogang.netlify.app', canvas.width / 2, 1720);
  ctx.fillStyle = '#3182f6';
  ctx.fillText('@gemini_koreauniv', canvas.width / 2, 1790);
  
  // Export and share
  try {
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
    const file = new File([blob], 'course-registration-result.jpg', { type: 'image/jpeg' });
    
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: '수강신청 시뮬레이터 결과',
        text: '나의 수강신청 반응속도는?'
      });
      sendGAEvent('image_saved', { method: 'share' });
    } else {
      // Fallback for download
      const link = document.createElement('a');
      link.download = 'course-registration-result.jpg';
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
      sendGAEvent('image_saved', { method: 'download' });
      alert('이미지가 기기에 저장되었습니다.');
    }
  } catch (err) {
    console.error('Error sharing image:', err);
  }
});

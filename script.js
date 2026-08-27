// Constants
const GAME_DURATION_MS = 10000; // 10초 대기
const CAMPAIGN_MODE = 'PRE_LAUNCH';  // 'PRE_LAUNCH' | 'LIVE'
const TEAM_SIGNUP_LINK = '';          // LIVE 전환 시 여기에 링크 주입
const INSTAGRAM_URL = 'https://www.instagram.com/gemini_koreauniv/'; // 임시 핸들

// Audio Context
let audioCtx = null;
let beepBuffer = null;
let currentBeepSource = null;

// Game State
let gameState = {
  startTime: 0,
  targetTime: 0,
  isGameRunning: false,
  hasClicked: false,
  bestRecord: localStorage.getItem('courseRegBestRecord') ? parseInt(localStorage.getItem('courseRegBestRecord')) : null,
  animationFrameId: null,
  lastGrade: null,
  lastDelay: null
};

// i18n
const i18n = {
  ko: {
    title: '<img src="img/dino.png" alt="dino" style="width: 48px; vertical-align: bottom; margin-right: 4px;">수강신청 시뮬레이터',
    subtitle: '10시 정각, 몇 밀리초 만에 누를 수 있나요?',
    rule1: '<strong>버튼은 딱 한 번만 누를 수 있습니다.</strong> 연타 불가.',
    rule2: '<strong>정각 전 클릭은 광탈입니다.</strong>',
    rule3: '<strong>소리를 켜주세요.</strong> 5초 전부터 비프음이 울립니다.',
    bestRecordLabel: '🏆 내 최고 기록:',
    btnReady: '도전 준비',
    readyTitle: '<img src="img/speaker.png" alt="speaker" style="width: 36px; vertical-align: middle; margin-right: 6px;">소리를 켜주세요',
    readyDesc: '비프음에 맞춰 정각에 버튼을 누르세요.',
    btnStart: '시작하기',
    btnStartLoading: '준비 중...',
    btnAction: '수강신청',
    btnShare: '스토리에 공유하기',
    btnRetry: '다시 하기',
    promoBannerTitle: '대학생·대학원생 Google AI Plus 12개월 무료',
    promoBannerSubPre: '인스타 팔로우하고 혜택 안내받기 👉',
    promoBannerSubLive: '12개월 무료 혜택 바로가기 👉',
    ctaTitle: '<img src="img/rocket.png" alt="rocket" style="width: 24px; vertical-align: middle; margin-right: 6px; transform: translateY(-2px);">이 게임, Gemini로 만들었습니다',
    ctaBodyPre: '대학생·대학원생을 위한 Google AI Plus 12개월 무료 혜택,<br>곧 안내드립니다. 놓치지 않으려면 팔로우해주세요.',
    ctaBodyLive: '대학생·대학원생은 Google AI Plus를 12개월 무료로 쓸 수 있어요.',
    btnCtaPre: '인스타그램 팔로우하고 소식 받기',
    btnCtaLive: '12개월 무료로 시작하기',
    failTitle: '광탈',
    failMsg: '서버도 안 열렸는데 눌렀습니다',
    grade1Title: '수강신청의 신',
    grade1Msg: '매크로 의심받는 속도',
    grade2Title: '광클 마스터',
    grade2Msg: '원하는 강의 전부 잡음',
    grade3Title: '무난한 인간',
    grade3Msg: '전공은 잡았고 교양은 글쎄',
    grade4Title: '대기 15번',
    grade4Msg: '개강하고 눈치싸움 시작',
    grade5Title: '장바구니 관람객',
    grade5Msg: '담아둔 건 많은데 잡힌 건 없음',
    grade6Title: '재수강 확정',
    grade6Msg: '내년에 만나요',
    newRecord: '🎉 신기록!',
    firstRecord: '🎉 첫 기록 달성!',
    prevBest: '이전 최고',
    myBest: '내 최고 기록:',
    shareTitle: '수강신청 시뮬레이터 결과',
    shareText: '나의 수강신청 반응속도는?',
    savedMsg: '이미지가 기기에 저장되었습니다.',
    canvasTitle: '수강신청 반응속도 시뮬레이터',
    leaderboardTitle: '🔥 오늘의 Top 5',
    leaderboardEmpty: '아직 기록이 없습니다. 첫 기록의 주인공이 되어보세요!',
    nicknameTitle: '명예의 전당에 기록 남기기',
    btnSaveRecord: '저장',
    nicknameErrorLength: '닉네임은 1~10자로 입력해주세요.',
    nicknameErrorProfanity: '부적절한 단어가 포함되어 있습니다.',
    nicknameSuccess: '기록이 저장되었습니다!',
    reportConfirm: '이 닉네임을 신고하시겠습니까?',
    reportSuccess: '신고가 접수되었습니다.'
  },
  en: {
    title: '<img src="img/dino.png" alt="dino" style="width: 48px; vertical-align: bottom; margin-right: 4px;">Registration Simulator',
    subtitle: 'Exactly at 10:00:00, how fast can you click?',
    rule1: '<strong>You can only click ONCE.</strong> No spamming.',
    rule2: '<strong>Clicking early means instant FAIL.</strong>',
    rule3: '<strong>Turn on sound.</strong> Beeps start 5 seconds before.',
    bestRecordLabel: '🏆 My Best Record:',
    btnReady: 'Get Ready',
    readyTitle: '<img src="img/speaker.png" alt="speaker" style="width: 36px; vertical-align: middle; margin-right: 6px;">Turn on sound',
    readyDesc: 'Press the button exactly at 10:00 on the final beep.',
    btnStart: 'Start',
    btnStartLoading: 'Loading...',
    btnAction: 'Register',
    btnShare: 'Share to Story',
    btnRetry: 'Try Again',
    promoBannerTitle: '12 Months Free Google AI Plus for Students',
    promoBannerSubPre: 'Follow IG for updates 👉',
    promoBannerSubLive: 'Get 12 Months Free 👉',
    ctaTitle: '<img src="img/rocket.png" alt="rocket" style="width: 24px; vertical-align: middle; margin-right: 6px; transform: translateY(-2px);">Built with Gemini',
    ctaBodyPre: '12 months free Google AI Plus for university students, coming soon.<br>Follow us to stay updated.',
    ctaBodyLive: 'University students can get 12 months of Google AI Plus for free.',
    btnCtaPre: 'Follow Instagram for Updates',
    btnCtaLive: 'Start 12 Months Free',
    failTitle: 'FAIL',
    failMsg: 'You clicked before the server opened',
    grade1Title: 'God of Registration',
    grade1Msg: 'Fast enough to be suspected as a macro',
    grade2Title: 'Click Master',
    grade2Msg: 'Got every class you wanted',
    grade3Title: 'Average Student',
    grade3Msg: 'Got major classes, missed electives',
    grade4Title: 'Waitlist #15',
    grade4Msg: 'Let the add/drop battle begin',
    grade5Title: 'Window Shopper',
    grade5Msg: 'Cart is full, caught nothing',
    grade6Title: 'Retake Confirmed',
    grade6Msg: 'See you next year',
    newRecord: '🎉 New Record!',
    firstRecord: '🎉 First Record Set!',
    prevBest: 'Previous best',
    myBest: 'My Best Record:',
    shareTitle: 'Registration Simulator Result',
    shareText: 'What is my reaction speed?',
    savedMsg: 'Image saved to device.',
    canvasTitle: 'Registration Simulator',
    leaderboardTitle: '🔥 Today\'s Top 5',
    leaderboardEmpty: 'No records yet. Be the first!',
    nicknameTitle: 'Leave your mark in the Hall of Fame',
    btnSaveRecord: 'Save',
    nicknameErrorLength: 'Nickname must be 1-10 chars.',
    nicknameErrorProfanity: 'Inappropriate words detected.',
    nicknameSuccess: 'Record saved!',
    reportConfirm: 'Report this nickname?',
    reportSuccess: 'Report submitted.'
  }
};

let currentLang = localStorage.getItem('courseRegLang') || 'ko';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('courseRegLang', lang);
  
  // Update lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  // Update text content for simple strings
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[lang][key]) {
      el.textContent = i18n[lang][key];
    }
  });

  // Update HTML content for strings with formatting/images
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (i18n[lang][key]) {
      el.innerHTML = i18n[lang][key];
    }
  });
  
  // Re-init promos and dynamic elements
  initPromoUI();
  if (gameState.bestRecord !== null) {
    const bestRecordText = document.getElementById('best-record-text');
    bestRecordText.textContent = `${gameState.bestRecord}ms`;
  }
}

// DOM Elements
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
  const t = i18n[currentLang];

  if (activeMode === 'PRE_LAUNCH') {
    promoBanners.forEach(el => {
      el.innerHTML = `${t.promoBannerTitle}<br><span class="banner-sub">${t.promoBannerSubPre}</span>`;
      el.style.cursor = 'pointer';
      el.onclick = () => {
        sendGAEvent('cta_click', { mode: 'PRE_LAUNCH', source: 'banner', lang: currentLang });
        window.open(INSTAGRAM_URL, '_blank');
      };
    });
    if (ctaBody) ctaBody.innerHTML = t.ctaBodyPre;
    if (btnCta) {
      btnCta.textContent = t.btnCtaPre;
      btnCta.onclick = () => {
        sendGAEvent('cta_click', { mode: 'PRE_LAUNCH', source: 'result_cta', lang: currentLang });
        window.open(INSTAGRAM_URL, '_blank');
      };
    }
  } else {
    promoBanners.forEach(el => {
      el.innerHTML = `${t.promoBannerTitle}<br><span class="banner-sub">${t.promoBannerSubLive}</span>`;
      el.style.cursor = 'pointer';
      el.onclick = () => {
        sendGAEvent('cta_click', { mode: 'LIVE', source: 'banner', lang: currentLang });
        window.open(TEAM_SIGNUP_LINK, '_blank');
      };
    });
    if (ctaBody) ctaBody.innerHTML = t.ctaBodyLive;
    if (btnCta) {
      btnCta.textContent = t.btnCtaLive;
      btnCta.onclick = () => {
        sendGAEvent('cta_click', { mode: 'LIVE', source: 'result_cta', lang: currentLang });
        window.open(TEAM_SIGNUP_LINK, '_blank');
      };
    }
  }
}

// Initialize Landing
function initLanding() {
  if (gameState.bestRecord !== null) {
    bestRecordContainer.style.display = 'block';
    bestRecordText.textContent = `${gameState.bestRecord}ms`;
  } else {
    bestRecordContainer.style.display = 'none';
  }
  loadTopRecords(); // Reload leaderboard every time we go to landing
  switchView('landing');
}

setLang(currentLang); // initialize defaults

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
  const FINAL_BEEP_START_TIME = 7.08;
  const timeToPlay = (GAME_DURATION_MS / 1000) - FINAL_BEEP_START_TIME;
  
  playBeep(nowAudio + timeToPlay);
}

function playBeep(startTime) {
  if (!beepBuffer) return; // 로드 실패 시 무음 처리
  const source = audioCtx.createBufferSource();
  source.buffer = beepBuffer;
  source.connect(audioCtx.destination);
  
  source.start(Math.max(startTime, audioCtx.currentTime));
  currentBeepSource = source; 
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
    endGame(null);
    return;
  }
  
  gameState.animationFrameId = requestAnimationFrame(updateClock);
}

function handleAction(e) {
  if (e) e.preventDefault(); 
  
  if (!gameState.isGameRunning || gameState.hasClicked) return;
  gameState.hasClicked = true;
  gameState.isGameRunning = false;
  cancelAnimationFrame(gameState.animationFrameId);
  
  const clickTime = e && e.timeStamp ? e.timeStamp : performance.now();
  const delay = clickTime - gameState.targetTime;
  
  if (delay < 0 && currentBeepSource) {
    try {
      currentBeepSource.stop();
    } catch (err) {}
  }
  
  endGame(delay);
}

// Event Listeners
btnReady.addEventListener('click', () => {
  switchView('ready');
});

btnStart.addEventListener('click', async () => {
  btnStart.disabled = true;
  btnStart.textContent = i18n[currentLang].btnStartLoading;
  
  await initAudio(); 
  
  btnStart.disabled = false;
  btnStart.textContent = i18n[currentLang].btnStart;
  
  startGame();
});

btnAction.addEventListener('pointerdown', handleAction);

btnRetry.addEventListener('click', () => {
  initLanding();
});

// Result Logic
function getGrade(delay) {
  const t = i18n[currentLang];
  if (delay < 0) {
    return { badge: "❌", title: t.failTitle, msg: t.failMsg, color: "#f04452", bg: "#fef0f1" };
  } else if (delay <= 50) {
    return { badge: "🏆", title: t.grade1Title, msg: t.grade1Msg, color: "#3182f6", bg: "rgba(49, 130, 246, 0.1)" };
  } else if (delay <= 150) {
    return { badge: "🥇", title: t.grade2Title, msg: t.grade2Msg, color: "#1b64da", bg: "rgba(49, 130, 246, 0.06)" };
  } else if (delay <= 300) {
    return { badge: "🥈", title: t.grade3Title, msg: t.grade3Msg, color: "#333d4b", bg: "#f2f4f6" };
  } else if (delay <= 500) {
    return { badge: "🥉", title: t.grade4Title, msg: t.grade4Msg, color: "#f59e0b", bg: "#fffbeb" };
  } else if (delay <= 1000) {
    return { badge: "😵", title: t.grade5Title, msg: t.grade5Msg, color: "#f97316", bg: "#fff7ed" };
  } else {
    return { badge: "💀", title: t.grade6Title, msg: t.grade6Msg, color: "#191f28", bg: "#e5e8eb" };
  }
}

function endGame(delay) {
  const actualDelay = delay === null ? 3001 : delay;
  const grade = getGrade(actualDelay);
  const t = i18n[currentLang];
  
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
  
  compareEl.innerHTML = ''; 
  
  if (delay < 0) {
    const earlySec = (Math.abs(actualDelay) / 1000).toFixed(3);
    const suffix = currentLang === 'ko' ? '초' : 's';
    delayEl.textContent = `-${earlySec}${suffix}`;
    delayEl.style.color = "var(--toss-danger)";
    sendGAEvent('game_fail_early');
    
    btnShare.style.display = 'none';
    document.getElementById('nickname-form-container').style.display = 'none';
  } else {
    const msStr = actualDelay > 3000 ? ">3000ms" : `+${Math.floor(actualDelay)}ms`;
    delayEl.textContent = msStr;
    delayEl.style.color = "var(--toss-text-title)";
    sendGAEvent('game_complete', { grade: grade.title, delay_ms: Math.floor(actualDelay) });
    
    btnShare.style.display = 'block';
    
    if (actualDelay <= 3000) {
      if (gameState.bestRecord === null || actualDelay < gameState.bestRecord) {
        const oldRecord = gameState.bestRecord;
        gameState.bestRecord = Math.floor(actualDelay);
        localStorage.setItem('courseRegBestRecord', gameState.bestRecord);
        
        if (oldRecord !== null) {
          compareEl.innerHTML = `${t.prevBest} ${oldRecord}ms &mdash; <span class="new-record">${t.newRecord}</span>`;
        } else {
          compareEl.innerHTML = `<span class="new-record">${t.firstRecord}</span>`;
        }
      } else {
        compareEl.innerHTML = `${t.myBest} ${gameState.bestRecord}ms`;
      }
      
      // Show nickname form
      document.getElementById('nickname-form-container').style.display = 'block';
      document.getElementById('nickname-input').value = '';
      document.getElementById('nickname-input').disabled = false;
      document.getElementById('btn-save-record').style.display = 'block';
      document.getElementById('btn-save-record').disabled = false;
      document.getElementById('nickname-error').textContent = '';
      document.getElementById('nickname-error').style.color = "var(--toss-danger)";
    } else {
      document.getElementById('nickname-form-container').style.display = 'none';
    }
  }
  
  gameState.lastGrade = grade;
  gameState.lastDelay = actualDelay;
  
  switchView('result');
}

// Share Logic (Canvas)
btnShare.addEventListener('click', async () => {
  const t = i18n[currentLang];
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 70px Pretendard, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(t.canvasTitle, canvas.width / 2, 400);
  
  ctx.fillStyle = gameState.lastGrade.bg;
  ctx.beginPath();
  ctx.arc(canvas.width / 2, 700, 150, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.font = '120px -apple-system, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText(gameState.lastGrade.badge, canvas.width / 2, 700);
  
  ctx.textBaseline = 'alphabetic'; 
  
  ctx.fillStyle = gameState.lastGrade.color;
  ctx.font = 'bold 90px Pretendard, -apple-system, sans-serif';
  ctx.fillText(gameState.lastGrade.title, canvas.width / 2, 1000);
  
  let delayStr = "";
  if (gameState.lastDelay < 0) {
    const earlySec = (Math.abs(gameState.lastDelay) / 1000).toFixed(3);
    const suffix = currentLang === 'ko' ? '초' : 's';
    delayStr = `-${earlySec}${suffix}`;
    ctx.fillStyle = '#f04452';
  } else {
    delayStr = gameState.lastDelay > 3000 ? ">3000ms" : `+${Math.floor(gameState.lastDelay)}ms`;
    ctx.fillStyle = '#0f172a';
  }
  ctx.font = 'bold 160px "SF Mono", monospace';
  ctx.fillText(delayStr, canvas.width / 2, 1250);
  
  ctx.fillStyle = '#64748b';
  ctx.font = '50px Pretendard, -apple-system, sans-serif';
  ctx.fillText(gameState.lastGrade.msg, canvas.width / 2, 1400);
  
  ctx.fillStyle = '#8b95a1';
  ctx.font = 'bold 45px Pretendard, -apple-system, sans-serif';
  ctx.fillText('soogang.netlify.app', canvas.width / 2, 1720);
  ctx.fillStyle = '#3182f6';
  ctx.fillText('@gemini_koreauniv', canvas.width / 2, 1790);
  
  try {
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
    const file = new File([blob], 'course-registration-result.jpg', { type: 'image/jpeg' });
    
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: t.shareTitle,
        text: t.shareText
      });
      sendGAEvent('image_saved', { method: 'share' });
    } else {
      const link = document.createElement('a');
      link.download = 'course-registration-result.jpg';
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
      sendGAEvent('image_saved', { method: 'download' });
      alert(t.savedMsg);
    }
  } catch (err) {
    console.error('Error sharing image:', err);
  }
});

// --- Supabase & Leaderboard Logic ---
let supabase = null;
const bannedWords = /(씨발|개새끼|지랄|병신|좆|섹스|미친|애미|애비|창녀)/i;

async function initSupabase() {
  try {
    // TODO: 넷리파이 환경변수나 빌드 과정에서 주입할 Supabase 설정 (임시 플레이스홀더)
    const SUPABASE_URL = "YOUR_SUPABASE_URL";
    const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
    
    if (typeof window.supabase === 'undefined') {
      console.warn("Supabase SDK not loaded.");
      return;
    }

    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Supabase 연결되면 랭킹 로드
    loadTopRecords();
  } catch(e) {
    console.warn("Supabase Init Error.", e);
  }
}
initSupabase();

function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function loadTopRecords() {
  const listEl = document.getElementById('leaderboard-list');
  if (!supabase) {
    listEl.innerHTML = `<li class="empty-leaderboard">🔥 DB 연동 대기 중 (Supabase 설정 필요)</li>`;
    return;
  }
  
  try {
    const todayStr = getTodayString();
    
    const { data, error } = await supabase
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
      
      const timeStr = doc.createdAt ? new Date(doc.createdAt).toLocaleTimeString(currentLang === 'ko' ? 'ko-KR' : 'en-US', {hour: '2-digit', minute:'2-digit'}) : '';
      
      li.innerHTML = `
        <div class="rank-info">
          <span class="rank-num">${rank}</span>
          <span class="rank-name">${escapeHTML(doc.nickname)}</span>
        </div>
        <div class="rank-score">
          <span class="rank-delay">+${doc.delayMs}ms</span>
          <span class="rank-time">${timeStr}</span>
          <button class="btn-report" onclick="reportRecord('${doc.id || ''}', '${escapeHTML(doc.nickname)}')">🚨</button>
        </div>
      `;
      listEl.appendChild(li);
      rank++;
    });
  } catch(e) {
    console.warn("Failed to load leaderboard:", e);
  }
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// Result Page Nickname Form Logic
const btnSaveRecord = document.getElementById('btn-save-record');
const nicknameInput = document.getElementById('nickname-input');
const errorMsgEl = document.getElementById('nickname-error');

btnSaveRecord.addEventListener('click', async () => {
  const nickname = nicknameInput.value.trim();
  const t = i18n[currentLang];
  
  if (nickname.length < 1 || nickname.length > 10) {
    errorMsgEl.textContent = t.nicknameErrorLength;
    return;
  }
  
  if (bannedWords.test(nickname)) {
    errorMsgEl.textContent = t.nicknameErrorProfanity;
    return;
  }

  if (!supabase) {
    errorMsgEl.textContent = "DB not connected.";
    return;
  }

  btnSaveRecord.disabled = true;
  errorMsgEl.style.color = "var(--toss-text-muted)";
  errorMsgEl.textContent = "저장 중...";

  try {
    const todayStr = getTodayString();
    
    const { error } = await supabase
      .from('leaderboard')
      .insert([
        {
          nickname: nickname,
          delayMs: gameState.lastDelay,
          dateString: todayStr
        }
      ]);
      
    if (error) throw error;
    
    // 저장 성공 시 UI 업데이트
    errorMsgEl.style.color = "var(--toss-blue)";
    errorMsgEl.textContent = t.nicknameSuccess;
    btnSaveRecord.style.display = 'none';
    nicknameInput.disabled = true;
    
    // 리더보드 새로고침
    loadTopRecords();
  } catch(e) {
    console.error(e);
    errorMsgEl.style.color = "var(--toss-danger)";
    errorMsgEl.textContent = "저장 실패. 잠시 후 다시 시도해주세요.";
    btnSaveRecord.disabled = false;
  }
});
    
    // 저장 성공 시 UI 업데이트
    errorMsgEl.style.color = "var(--toss-blue)";
    errorMsgEl.textContent = t.nicknameSuccess;
    btnSaveRecord.style.display = 'none';
    nicknameInput.disabled = true;
    
    // 리더보드 새로고침
    loadTopRecords();
  } catch(e) {
    console.error(e);
    errorMsgEl.style.color = "var(--toss-danger)";
    errorMsgEl.textContent = "저장 실패. 잠시 후 다시 시도해주세요.";
    btnSaveRecord.disabled = false;
  }
});

window.reportRecord = async function(recordId, nickname) {
  const t = i18n[currentLang];
  if (!confirm(t.reportConfirm)) return;
  
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from('reports')
      .insert([
        {
          recordId: recordId,
          dateString: getTodayString(),
          reportedNickname: nickname,
          reason: 'User report from frontend'
        }
      ]);
      
    if (error) throw error;
    
    alert(t.reportSuccess);
  } catch(e) {
    console.warn("Report failed:", e);
  }
});
    alert(t.reportSuccess);
  } catch(e) {
    console.warn("Report failed:", e);
  }
}

/**
 * 삼덕이 금연 챌린지 - OBS 오버레이 로직
 * 독립 실행 가능 (메인 페이지 config.js와 별도)
 */

const CONFIG = {
  START_DATE: '2026-05-13T00:00:00+09:00',
  TOTAL_DAYS: 31,
  PARTICIPANT: '삼덕이',
  PENALTY: '삼루먼쇼',
  CIGARETTE_PRICE_PER_DAY: 4500,
};

function getStartDate() {
  return new Date(CONFIG.START_DATE);
}

function calculateState() {
  const now = new Date();
  const startDate = getStartDate();
  const diffMs = now - startDate;
  const currentDay = Math.floor(diffMs / 86400000) + 1;

  if (now < startDate) {
    const dDayMs = startDate - now;
    const dDay = Math.ceil(dDayMs / 86400000);
    return { status: 'before', dDay, currentDay: 0, progress: 0 };
  }

  if (currentDay >= 1 && currentDay <= CONFIG.TOTAL_DAYS) {
    const progress = Math.min((currentDay / CONFIG.TOTAL_DAYS) * 100, 100);
    return { status: 'active', currentDay, progress };
  }

  return { status: 'success', currentDay, progress: 100 };
}

function updateOverlay() {
  const state = calculateState();

  const dayLabel = document.getElementById('day-label');
  const dayValue = document.getElementById('day-value');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const penaltyText = document.getElementById('penalty-text');
  const container = document.getElementById('overlay-container');

  if (!dayLabel || !dayValue || !progressFill || !progressText) return;

  container.className = 'overlay-container';

  switch (state.status) {
    case 'before':
      container.classList.add('state-before');
      dayLabel.textContent = '금연 챌린지';
      dayValue.textContent = 'D-' + state.dDay;
      progressFill.style.width = '0%';
      progressText.textContent = '시작 대기중';
      penaltyText.textContent = '벌칙: ' + CONFIG.PENALTY;
      break;

    case 'active':
      container.classList.add('state-active');
      dayLabel.textContent = CONFIG.PARTICIPANT + ' 금연';
      dayValue.textContent = state.currentDay + '일차';
      progressFill.style.width = state.progress + '%';
      progressText.textContent = state.currentDay + ' / ' + CONFIG.TOTAL_DAYS + '일';
      penaltyText.textContent = '벌칙: ' + CONFIG.PENALTY;
      break;

    case 'success':
      container.classList.add('state-success');
      dayLabel.textContent = CONFIG.PARTICIPANT + ' 금연';
      dayValue.textContent = '성공!';
      progressFill.style.width = '100%';
      progressText.textContent = CONFIG.TOTAL_DAYS + '일 완료';
      penaltyText.textContent = '축하합니다!';
      break;
  }
}

// 초기 실행 + 1분마다 갱신
document.addEventListener('DOMContentLoaded', function () {
  updateOverlay();
  setInterval(updateOverlay, 60000);
});

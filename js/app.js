/**
 * 삼덕이 금연 챌린지 — 메인 페이지 로직
 * config.js 에 의존한다 (먼저 로드할 것).
 */

(function () {
  'use strict';

  /* ---------- DOM 캐시 ---------- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const dom = {
    // 상태별 영역
    viewBefore: $('#view-before'),
    viewOngoing: $('#view-ongoing'),
    viewSuccess: $('#view-success'),

    // 히어로
    heroBadge: $('#hero-badge'),
    dayNumber: $('#day-number'),
    dayLabel: $('#day-label'),

    // 카운트다운 (시작 전)
    cdDays: $('#cd-days'),
    cdHours: $('#cd-hours'),
    cdMinutes: $('#cd-minutes'),
    cdSeconds: $('#cd-seconds'),

    // 진행률
    progressFill: $('#progress-fill'),
    progressText: $('#progress-text'),

    // 타임라인
    timelineGrid: $('#timeline-grid'),

    // 벌칙
    penaltySection: $('#penalty-section'),

    // 건강 회복
    healthSection: $('#health-section'),
    healthSteps: $$('#health-section .health__step'),

    // 절약 금액
    savingsSection: $('#savings-section'),
    savingsAmount: $('#savings-amount'),
  };

  /* ---------- 렌더링 ---------- */

  /** 상태에 따라 영역 표시/숨기기 */
  function applyStatus(status) {
    dom.viewBefore.classList.toggle('hidden', status !== 'before');
    dom.viewOngoing.classList.toggle('hidden', status !== 'ongoing');
    dom.viewSuccess.classList.toggle('hidden', status !== 'success');

    // 히어로 뱃지
    if (status === 'before') {
      dom.heroBadge.textContent = '챌린지 시작 예정';
      dom.dayNumber.textContent = 'D-Day';
      dom.dayLabel.textContent = '곧 시작됩니다';
    } else if (status === 'ongoing') {
      const day = getCurrentDay();
      dom.heroBadge.textContent = '진행 중';
      dom.dayNumber.textContent = day;
      dom.dayLabel.textContent = '일차';
    } else {
      dom.heroBadge.textContent = '챌린지 완료';
      dom.dayNumber.textContent = '31';
      dom.dayLabel.textContent = '일 완주!';
    }
  }

  /** 시작 전 카운트다운 갱신 */
  function updateCountdown() {
    const remaining = getTimeUntilStart();
    const c = msToComponents(remaining);
    dom.cdDays.textContent = pad2(c.days);
    dom.cdHours.textContent = pad2(c.hours);
    dom.cdMinutes.textContent = pad2(c.minutes);
    dom.cdSeconds.textContent = pad2(c.seconds);
  }

  /** 진행률 바 갱신 */
  function updateProgress() {
    const pct = getProgress();
    const day = getCurrentDay();
    dom.progressFill.style.width = pct + '%';
    dom.progressText.innerHTML =
      '<strong>' + day + '</strong> / ' + CONFIG.TOTAL_DAYS + '일 (' + pct + '%)';
  }

  /** 31일 타임라인 그리드 렌더링 */
  function renderTimeline() {
    const today = getCurrentDay();
    const status = getChallengeStatus();
    let html = '';

    for (let d = 1; d <= CONFIG.TOTAL_DAYS; d++) {
      let cls = 'timeline__day';
      if (status === 'success' || (status === 'ongoing' && d < today)) {
        cls += ' timeline__day--past';
      } else if (status === 'ongoing' && d === today) {
        cls += ' timeline__day--today';
      } else {
        cls += ' timeline__day--future';
      }
      html += '<div class="' + cls + '">' + d + '</div>';
    }

    dom.timelineGrid.innerHTML = html;
  }

  /* ---------- 건강 회복 & 절약 금액 ---------- */

  /** 경과 시간에 따라 건강 단계 활성/비활성 토글 */
  function updateHealth() {
    var status = getChallengeStatus();
    dom.healthSection.classList.toggle('hidden', status === 'before');

    if (status === 'before') return;

    var elapsed = Date.now() - new Date(CONFIG.START_DATE).getTime();

    dom.healthSteps.forEach(function (step) {
      var threshold = Number(step.getAttribute('data-ms'));
      step.classList.toggle('health__step--active', elapsed >= threshold);
    });
  }

  /** 절약 금액 계산 및 표시 */
  function updateSavings() {
    var status = getChallengeStatus();
    dom.savingsSection.classList.toggle('hidden', status === 'before');

    if (status === 'before') return;

    var day = getCurrentDay();
    // 성공(완료) 시에는 전체 일수 기준
    if (day > CONFIG.TOTAL_DAYS) day = CONFIG.TOTAL_DAYS;
    var amount = day * CONFIG.CIGARETTE_PRICE_PER_DAY;
    dom.savingsAmount.textContent = amount.toLocaleString('ko-KR') + '원';
  }

  /* ---------- 메인 루프 ---------- */

  let timer = null;

  function tick() {
    const status = getChallengeStatus();
    applyStatus(status);

    if (status === 'before') {
      updateCountdown();
    } else if (status === 'ongoing') {
      updateProgress();
    }

    updateHealth();
    updateSavings();
  }

  function init() {
    renderTimeline();
    tick();

    // 상태에 따라 갱신 주기를 다르게
    const status = getChallengeStatus();
    if (status === 'before') {
      // 시작 전: 1초마다 카운트다운
      timer = setInterval(function () {
        tick();
        // 상태가 바뀌면 재초기화
        if (getChallengeStatus() !== 'before') {
          clearInterval(timer);
          init();
        }
      }, 1000);
    } else if (status === 'ongoing') {
      // 진행 중: 1분마다 갱신 (일차 변경 감지)
      timer = setInterval(function () {
        tick();
        renderTimeline();
        if (getChallengeStatus() !== 'ongoing') {
          clearInterval(timer);
          init();
        }
      }, 60000);
    }
    // 성공 상태는 갱신 불필요
  }

  // DOM 로드 후 시작
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

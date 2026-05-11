/**
 * 삼덕이 금연 챌린지 — 공통 설정 & 유틸리티
 * 메인 페이지와 OBS 오버레이가 공유한다.
 */

const CONFIG = {
  START_DATE: '2026-05-13T00:00:00+09:00',
  TOTAL_DAYS: 31,
  PARTICIPANT: '삼덕이',
  PENALTY: '삼루먼쇼',
  CIGARETTE_PRICE_PER_DAY: 4500,
};

/**
 * 현재 일차를 계산한다.
 * 시작일 이전이면 0 이하, 시작일 당일이면 1, …
 * @returns {number}
 */
function getCurrentDay() {
  const now = Date.now();
  const start = new Date(CONFIG.START_DATE).getTime();
  return Math.floor((now - start) / 86400000) + 1;
}

/**
 * 챌린지 상태를 반환한다.
 * @returns {'before' | 'ongoing' | 'success'}
 */
function getChallengeStatus() {
  const day = getCurrentDay();
  if (day < 1) return 'before';
  if (day <= CONFIG.TOTAL_DAYS) return 'ongoing';
  return 'success';
}

/**
 * 시작일까지 남은 밀리초를 반환한다. (시작 전 카운트다운용)
 * @returns {number}
 */
function getTimeUntilStart() {
  return new Date(CONFIG.START_DATE).getTime() - Date.now();
}

/**
 * 밀리초를 { days, hours, minutes, seconds } 객체로 변환한다.
 */
function msToComponents(ms) {
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const totalSec = Math.floor(ms / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
  };
}

/**
 * 진행률 (0 ~ 100)
 */
function getProgress() {
  const day = getCurrentDay();
  if (day < 1) return 0;
  if (day > CONFIG.TOTAL_DAYS) return 100;
  return Math.round((day / CONFIG.TOTAL_DAYS) * 100);
}

/**
 * 숫자를 두 자리 문자열로 패딩한다.
 */
function pad2(n) {
  return String(n).padStart(2, '0');
}

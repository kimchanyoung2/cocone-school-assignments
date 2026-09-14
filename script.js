const drawButton = document.querySelector('#draw-team');
const result = document.querySelector('#draw-result');
const machine = document.querySelector('.lotto-stage');
const picks = [...document.querySelectorAll('.lotto-pick')];
const modal = document.querySelector('#profile-modal');
const modalProfile = document.querySelector('#modal-profile');
const modalNumber = document.querySelector('#modal-number');
const modalClose = document.querySelector('.modal-close');
const winnerSmashName = document.querySelector('#winner-smash-name');
const driveOpening = document.querySelector('#drive-opening');
const openingStart = document.querySelector('#opening-start');
const openingSkip = document.querySelector('#opening-skip');
const replayIntro = document.querySelector('#replay-intro');
const driveCounter = document.querySelector('#drive-counter');
const driveStatus = document.querySelector('#drive-status');
const routeSteps = [...document.querySelectorAll('.route-progress li')];

const members = [
  { number: '01', name: '전형원', target: '#profile-jeon' },
  { number: '02', name: '김찬영', target: '#profile-kim' },
  { number: '03', name: '손용국', target: '#profile-son' },
];

let introTimers = [];

const clearIntroTimers = () => {
  introTimers.forEach((timer) => window.clearTimeout(timer));
  introTimers = [];
};

const setRouteStep = (step, message) => {
  if (driveCounter) driveCounter.textContent = String(step).padStart(2, '0');
  if (driveStatus) driveStatus.textContent = message;
  routeSteps.forEach((item, index) => {
    item.classList.toggle('is-current', index === step - 1);
    item.classList.toggle('is-passed', index < step - 1);
  });
};

const closeIntro = (startDraw = false) => {
  if (!driveOpening) return;
  driveOpening.classList.add('is-leaving');
  introTimers.push(window.setTimeout(() => {
    driveOpening.hidden = true;
    driveOpening.classList.remove('is-running', 'is-leaving');
    document.body.classList.remove('intro-open');
    if (startDraw) drawButton?.click();
  }, 650));
};

const resetIntro = () => {
  clearIntroTimers();
  if (!driveOpening) return;
  driveOpening.hidden = false;
  driveOpening.classList.remove('is-running', 'is-leaving');
  document.body.classList.add('intro-open');
  openingStart.disabled = false;
  setRouteStep(1, '휴식, 러닝, 농구. 세 팀원의 체크포인트를 지나 오늘의 팀원을 만나보세요.');
};

openingStart?.addEventListener('click', () => {
  if (driveOpening.classList.contains('is-running')) return;
  driveOpening.classList.add('is-running');
  openingStart.disabled = true;
  setRouteStep(1, '01 전형원 · 잠깐 멈추고 에너지를 충전합니다.');
  introTimers.push(window.setTimeout(() => setRouteStep(2, '02 김찬영 · 꾸준한 페이스로 다음 구간을 달립니다.'), 1050));
  introTimers.push(window.setTimeout(() => setRouteStep(3, '03 손용국 · 코트의 에너지로 결승선을 통과합니다.'), 2100));
  introTimers.push(window.setTimeout(() => closeIntro(true), 3300));
});

openingSkip?.addEventListener('click', () => closeIntro(false));
replayIntro?.addEventListener('click', resetIntro);

const openWinnerModal = (winner) => {
  const source = document.querySelector(winner.target);
  const avatar = source?.querySelector('.avatar')?.cloneNode(true);
  const details = source?.querySelector('.member-body')?.cloneNode(true);

  if (!modal || !modalProfile || !source || !avatar || !details) return;

  modalProfile.replaceChildren(avatar, details);
  modalProfile.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'));
  modalNumber.textContent = winner.number;
  modal.dataset.member = winner.number;
  modal.querySelector('.modal-shell').dataset.number = winner.number;
  modal.hidden = false;
  document.body.classList.add('modal-open');
  modalClose?.focus();
};

const closeWinnerModal = () => {
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove('modal-open');
  drawButton?.focus();
};

modalClose?.addEventListener('click', closeWinnerModal);
modal?.addEventListener('click', (event) => {
  if (event.target === modal) closeWinnerModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal && !modal.hidden) closeWinnerModal();
});

drawButton?.addEventListener('click', () => {
  if (machine.classList.contains('is-drawing')) return;

  machine.classList.add('is-drawing');
  machine.classList.remove('is-crashing');
  drawButton.disabled = true;
  picks.forEach((pick) => pick.classList.remove('is-selected'));
  result.textContent = '띠리리릿— 번호를 섞고 있습니다!';

  let tick = 0;
  const ticker = window.setInterval(() => {
    const preview = members[tick % members.length];
    result.textContent = `${preview.number} · ${preview.name}?`;
    tick += 1;
  }, 120);

  window.setTimeout(() => {
    window.clearInterval(ticker);
    const winner = members[Math.floor(Math.random() * members.length)];
    const winningBall = picks.find((pick) => pick.dataset.number === winner.number);
    winningBall?.classList.add('is-selected');
    machine.classList.remove('is-drawing');
    machine.classList.add('has-winner');
    result.textContent = `당첨! ${winner.number}번 ${winner.name}`;
    if (winnerSmashName) winnerSmashName.textContent = winner.name;

    window.setTimeout(() => {
      machine.classList.add('is-crashing');
    }, 380);

    window.setTimeout(() => {
      openWinnerModal(winner);
      drawButton.disabled = false;
      machine.classList.remove('has-winner');
      machine.classList.remove('is-crashing');
    }, 1650);
  }, 2200);
});

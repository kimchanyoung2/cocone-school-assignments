const drawButton = document.querySelector('#draw-team');
const result = document.querySelector('#draw-result');
const machine = document.querySelector('.lotto-stage');
const picks = [...document.querySelectorAll('.lotto-pick')];
const modal = document.querySelector('#profile-modal');
const modalProfile = document.querySelector('#modal-profile');
const modalNumber = document.querySelector('#modal-number');
const modalClose = document.querySelector('.modal-close');
const winnerSmashName = document.querySelector('#winner-smash-name');

const members = [
  { number: '01', name: '전형원', target: '#profile-jeon' },
  { number: '02', name: '김찬영', target: '#profile-kim' },
  { number: '03', name: '손용국', target: '#profile-son' },
];

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

const drawButton = document.querySelector('#draw-team');
const result = document.querySelector('#draw-result');
const machine = document.querySelector('.lotto-stage');
const picks = [...document.querySelectorAll('.lotto-pick')];

const members = [
  { number: '01', name: '전형원', target: '#profile-jeon' },
  { number: '02', name: '김찬영', target: '#profile-kim' },
  { number: '03', name: '손용국', target: '#profile-son' },
];

drawButton?.addEventListener('click', () => {
  if (machine.classList.contains('is-drawing')) return;

  machine.classList.add('is-drawing');
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

    window.setTimeout(() => {
      window.location.hash = winner.target;
      drawButton.disabled = false;
      machine.classList.remove('has-winner');
    }, 900);
  }, 2200);
});

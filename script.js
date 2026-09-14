const balanceGame = document.querySelector('#balance-game');
const balanceChoices = [...document.querySelectorAll('.balance-choice')];
const balanceSkip = document.querySelector('#balance-skip');
const playBalance = document.querySelector('#play-balance');
const ticketModal = document.querySelector('#ticket-modal');
const ticketClose = document.querySelector('.ticket-close');
const ticketContinue = document.querySelector('#ticket-continue');
const teamSeats = [...document.querySelectorAll('.team-seat[data-member]')];
const cardTicketButtons = [...document.querySelectorAll('.card-ticket-button')];

const ticketFields = {
  photo: document.querySelector('#ticket-photo'),
  name: document.querySelector('#ticket-name'),
  major: document.querySelector('#ticket-major'),
  mbti: document.querySelector('#ticket-mbti'),
  birth: document.querySelector('#ticket-birth'),
  hobby: document.querySelector('#ticket-hobby'),
  seat: document.querySelector('#ticket-seat'),
  code: document.querySelector('#ticket-code'),
};

const members = [
  {
    number: '01',
    code: 'JHW-01',
    name: '전형원',
    ticketName: 'JEON HEUNGWON',
    major: '관광경영학과',
    mbti: 'ISFJ',
    birth: '2003.11.01',
    hobby: '잠자기',
    seat: '01E',
    neighbor: '최태원 · 이재용 사이',
    photo: 'assets/jeon-hyeongwon.jpg',
    initial: '전',
  },
  {
    number: '02',
    code: 'KCY-02',
    name: '김찬영',
    ticketName: 'KIMCHANYOUNG',
    major: '경영학과',
    mbti: 'ISTJ',
    birth: '2004.09.25',
    hobby: '러닝',
    seat: '03B',
    neighbor: '교수님 두 분 사이',
    photo: 'assets/kim-chanyoung-profile.jpg',
    initial: '김',
  },
  {
    number: '03',
    code: 'SYG-03',
    name: '손용국',
    ticketName: 'SON YONGGUK',
    major: '행정학과',
    mbti: 'ENTP',
    birth: '2003.08.05',
    hobby: '농구 · 축구 · 게임 · 드라이브',
    seat: '05E',
    neighbor: '카리나 · 장원영 사이',
    photo: 'assets/son-yongguk.jpg',
    initial: '손',
  },
];

const getMember = (number) => members.find((member) => member.number === number);
let lastSeat = null;

function resetSeats() {
  teamSeats.forEach((seat) => {
    const member = getMember(seat.dataset.member);
    seat.classList.remove('is-occupied', 'is-recommended');
    seat.setAttribute('aria-label', `${member.seat} ${member.neighbor} 빈 좌석 선택`);
    const label = document.createElement('span');
    label.className = 'seat-empty';
    const number = document.createElement('b');
    number.textContent = '?';
    const hint = document.createElement('small');
    hint.textContent = `${member.seat} · 익명 좌석`;
    label.append(number, hint);
    seat.replaceChildren(label);
  });
  document.querySelectorAll('.member-card').forEach(card => { card.hidden = true; });
}

function enterCabin(number) {
  balanceGame.hidden = true;
  document.body.classList.remove('balance-open');
  teamSeats.forEach(seat => seat.classList.toggle('is-recommended', seat.dataset.member === number));
  const seat = teamSeats.find(item => item.dataset.member === number);
  document.querySelector('#cabin').scrollIntoView({ block: 'start' });
  seat?.focus({ preventScroll: true });
}

// Spread the three groups across the front, middle-left and rear of the cabin.
const cabin = document.querySelector('.aircraft-cabin');
const featuredRows = [...cabin.querySelectorAll('.featured-row')];
const ordinaryRows = [...cabin.querySelectorAll('.muted-row')];
const middleRow = featuredRows[1];
const middleSeats = [...middleRow.children];
middleRow.replaceChildren(...middleSeats.slice(4), middleSeats[3], ...middleSeats.slice(0, 3));
[featuredRows[0], ordinaryRows[0], featuredRows[1], ordinaryRows[1], featuredRows[2]].forEach((row, index) => {
  row.dataset.row = String(index + 1);
  row.querySelector('.aisle-number').textContent = String(index + 1).padStart(2, '0');
  cabin.insertBefore(row, cabin.querySelector('.cabin-legend'));
});
cardTicketButtons.forEach(button => {
  button.previousElementSibling.textContent = `SEAT ${getMember(button.dataset.ticketMember).seat}`;
});
resetSeats();

function renderTicket(member) {
  if (!member || !ticketModal) return;

  ticketFields.name.textContent = member.ticketName;
  ticketFields.major.textContent = member.major;
  ticketFields.mbti.textContent = member.mbti;
  ticketFields.birth.textContent = member.birth;
  ticketFields.hobby.textContent = member.hobby;
  ticketFields.seat.textContent = member.seat;
  ticketFields.code.textContent = member.code;
  ticketFields.photo.replaceChildren();

  if (member.photo) {
    const image = document.createElement('img');
    image.src = member.photo;
    image.alt = `${member.name} 프로필 사진`;
    ticketFields.photo.append(image);
  } else {
    const initial = document.createElement('span');
    initial.textContent = member.initial;
    initial.setAttribute('aria-label', `${member.name} 이니셜`);
    ticketFields.photo.append(initial);
  }

  ticketModal.dataset.member = member.number;
}

function openTicket(memberNumber) {
  const member = getMember(memberNumber);
  if (!member || !ticketModal) return;

  renderTicket(member);
  lastSeat = document.activeElement;
  const card = document.querySelector(`[data-ticket-member="${memberNumber}"]`)?.closest('.member-card');
  if (card) card.hidden = false;
  ticketModal.hidden = false;
  document.body.classList.add('ticket-open');
  ticketClose?.focus();
}

function revealSeat(seat) {
  const member = getMember(seat.dataset.member);
  if (!member || seat.classList.contains('is-occupied')) return;
  const face = document.createElement('span');
  face.className = 'member-seat-face';
  if (member.photo) {
    const image = document.createElement('img');
    image.src = member.photo;
    image.alt = '';
    face.append(image);
  } else {
    face.textContent = member.initial;
  }
  const passenger = document.createElement('span');
  passenger.className = 'seat-passenger';
  const name = document.createElement('b');
  name.textContent = member.name;
  const seatNumber = document.createElement('small');
  seatNumber.textContent = member.seat;
  passenger.append(face, name, seatNumber);
  seat.replaceChildren(passenger);
  seat.classList.add('is-occupied');
  seat.classList.remove('is-recommended');
  seat.setAttribute('aria-label', `${member.seat} ${member.name} 탑승권 다시 보기`);
}

function closeTicket({ enterCabin = false } = {}) {
  if (!ticketModal) return;

  ticketModal.hidden = true;
  document.body.classList.remove('ticket-open');
  lastSeat?.focus({ preventScroll: true });

  if (enterCabin) {
    balanceGame.hidden = true;
    document.body.classList.remove('balance-open');
    document.querySelector('#cabin')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

balanceChoices.forEach((choice) => {
  choice.addEventListener('click', () => {
    balanceChoices.forEach((item) => item.classList.toggle('is-selected', item === choice));
    enterCabin(choice.dataset.member);
  });
});

balanceSkip?.addEventListener('click', () => {
  balanceGame.hidden = true;
  document.body.classList.remove('balance-open');
  document.querySelector('#cabin')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

playBalance?.addEventListener('click', () => {
  resetSeats();
  balanceChoices.forEach((choice) => choice.classList.remove('is-selected'));
  balanceGame.hidden = false;
  document.body.classList.add('balance-open');
  balanceGame.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

teamSeats.forEach((seat) => {
  seat.addEventListener('click', () => {
    revealSeat(seat);
    openTicket(seat.dataset.member);
  });
});

cardTicketButtons.forEach((button) => {
  button.addEventListener('click', () => openTicket(button.dataset.ticketMember));
});

ticketClose?.addEventListener('click', () => closeTicket());
ticketContinue?.addEventListener('click', () => closeTicket({ enterCabin: true }));

ticketModal?.addEventListener('click', (event) => {
  if (event.target === ticketModal) closeTicket();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && ticketModal && !ticketModal.hidden) closeTicket();
});

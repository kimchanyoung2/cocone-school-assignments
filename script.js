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
  neighbor: document.querySelector('#ticket-neighbor'),
  age: document.querySelector('#ticket-age'),
  food: document.querySelector('#ticket-food'),
  major: document.querySelector('#ticket-major'),
  seat: document.querySelector('#ticket-seat'),
  code: document.querySelector('#ticket-code'),
};

const members = [
  {
    number: '01',
    code: 'JHW-01',
    name: '전형원',
    age: '24세',
    food: '바람떡',
    major: '관광경영학과',
    seat: '01E',
    neighbor: '최태원 · 이재용 사이',
    photo: 'assets/jeon-hyeongwon.jpg',
    initial: '전',
  },
  {
    number: '02',
    code: 'KCY-02',
    name: '김찬영',
    age: '23세',
    food: '김치찌개',
    major: '경영학과',
    seat: '02E',
    neighbor: '교수님 두 분 사이',
    photo: 'assets/kim-chanyoung-profile.jpg',
    initial: '김',
  },
  {
    number: '03',
    code: 'SYG-03',
    name: '손용국',
    age: '24세',
    food: '삼겹살',
    major: '행정학과',
    seat: '03E',
    neighbor: '카리나 · 장원영 사이',
    photo: 'assets/son-yongguk.jpg',
    initial: '손',
  },
];

const getMember = (number) => members.find((member) => member.number === number);

function renderTicket(member) {
  if (!member || !ticketModal) return;

  ticketFields.name.textContent = member.name;
  ticketFields.neighbor.textContent = member.neighbor;
  ticketFields.age.textContent = member.age;
  ticketFields.food.textContent = member.food;
  ticketFields.major.textContent = member.major;
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
  ticketModal.hidden = false;
  document.body.classList.add('ticket-open');
  ticketClose?.focus();
}

function closeTicket({ enterCabin = false } = {}) {
  if (!ticketModal) return;

  ticketModal.hidden = true;
  document.body.classList.remove('ticket-open');

  if (enterCabin) {
    balanceGame.hidden = true;
    document.body.classList.remove('balance-open');
    document.querySelector('#cabin')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

balanceChoices.forEach((choice) => {
  choice.addEventListener('click', () => {
    balanceChoices.forEach((item) => item.classList.toggle('is-selected', item === choice));
    openTicket(choice.dataset.member);
  });
});

balanceSkip?.addEventListener('click', () => {
  balanceGame.hidden = true;
  document.body.classList.remove('balance-open');
  document.querySelector('#cabin')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

playBalance?.addEventListener('click', () => {
  balanceChoices.forEach((choice) => choice.classList.remove('is-selected'));
  balanceGame.hidden = false;
  document.body.classList.add('balance-open');
  balanceGame.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

teamSeats.forEach((seat) => {
  seat.addEventListener('click', () => openTicket(seat.dataset.member));
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

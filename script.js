const modal = document.querySelector('#profile-modal');
const modalProfile = document.querySelector('#modal-profile');
const modalNumber = document.querySelector('#modal-number');
const modalClose = document.querySelector('.modal-close');
const boardButton = document.querySelector('#board-team');
const boardingStatus = document.querySelector('#boarding-status');
const teamSeats = [...document.querySelectorAll('.team-seat')];

const members = [
  { number: '01', name: '전형원', target: '#profile-jeon', seat: '01E' },
  { number: '02', name: '김찬영', target: '#profile-kim', seat: '02B' },
  { number: '03', name: '손용국', target: '#profile-son', seat: '03D' },
];

const openMemberModal = (member) => {
  const source = document.querySelector(member.target);
  const avatar = source?.querySelector('.avatar')?.cloneNode(true);
  const details = source?.querySelector('.member-body')?.cloneNode(true);

  if (!modal || !modalProfile || !source || !avatar || !details) return;

  modalProfile.replaceChildren(avatar, details);
  modalProfile.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'));
  modalNumber.textContent = member.number;
  modal.dataset.member = member.number;
  modal.querySelector('.modal-shell').dataset.number = member.number;
  modal.hidden = false;
  document.body.classList.add('modal-open');
  modalClose?.focus();
};

const closeMemberModal = () => {
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove('modal-open');
};

const updateBoardingStatus = () => {
  const occupiedCount = teamSeats.filter((seat) => seat.classList.contains('is-occupied')).length;
  if (!boardingStatus) return;

  if (occupiedCount === members.length) {
    boardingStatus.textContent = '탑승 완료! 팀원 좌석을 누르면 상세 프로필이 열립니다.';
    boardButton.textContent = '전원 탑승 완료 ✓';
    boardButton.disabled = true;
    return;
  }

  boardingStatus.textContent = `${occupiedCount} / ${members.length}명 탑승 · 남은 빈 좌석을 선택해 주세요.`;
};

const boardMember = (seat, member) => {
  if (seat.classList.contains('is-occupied')) {
    openMemberModal(member);
    return;
  }

  seat.classList.add('is-boarding');
  window.setTimeout(() => {
    seat.classList.remove('is-boarding');
    seat.classList.add('is-occupied');
    seat.setAttribute('aria-label', `${member.seat} ${member.name} 좌석, 상세 프로필 열기`);
    updateBoardingStatus();
  }, 420);
};

teamSeats.forEach((seat) => {
  seat.addEventListener('click', () => {
    const member = members.find((item) => item.number === seat.dataset.member);
    if (member) boardMember(seat, member);
  });
});

boardButton?.addEventListener('click', () => {
  if (boardButton.classList.contains('is-boarding')) return;
  boardButton.classList.add('is-boarding');
  boardButton.disabled = true;
  if (boardingStatus) boardingStatus.textContent = '승객 명단을 확인하고 있습니다…';

  teamSeats.forEach((seat, index) => {
    window.setTimeout(() => {
      const member = members.find((item) => item.number === seat.dataset.member);
      if (member && !seat.classList.contains('is-occupied')) boardMember(seat, member);

      if (index === teamSeats.length - 1) {
        window.setTimeout(() => {
          boardButton.classList.remove('is-boarding');
          updateBoardingStatus();
        }, 500);
      }
    }, index * 650);
  });
});

modalClose?.addEventListener('click', closeMemberModal);
modal?.addEventListener('click', (event) => {
  if (event.target === modal) closeMemberModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal && !modal.hidden) closeMemberModal();
});

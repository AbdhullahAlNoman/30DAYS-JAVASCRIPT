const cardsArray = [
  '🍎', '🍎',
  '🍌', '🍌',
  '🍇', '🍇',
  '🍒', '🍒',
  '🥝', '🥝',
  '🍋', '🍋',
  '🍓', '🍓',
  '🍉', '🍉'
];

const gameBoard = document.getElementById('gameBoard');
const restartBtn = document.getElementById('restartBtn');

let firstCard = null;
let secondCard = null;
let lockBoard = false;

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function createBoard() {
  gameBoard.innerHTML = '';
  const shuffledCards = shuffle([...cardsArray]);

  shuffledCards.forEach(symbol => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="front">${symbol}</div>
      <div class="back">❓</div>
    `;
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkMatch();
}

function checkMatch() {
  const isMatch =
    firstCard.querySelector('.front').textContent ===
    secondCard.querySelector('.front').textContent;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

restartBtn.addEventListener('click', createBoard);

createBoard();

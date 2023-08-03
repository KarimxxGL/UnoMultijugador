const SUITS = ['Rojo', 'Verde', 'Azul', 'Amarillo'];
const VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function getRandomCard() {
  const randomSuit = SUITS[Math.floor(Math.random() * SUITS.length)];
  const randomValue = VALUES[Math.floor(Math.random() * VALUES.length)];
  return { suit: randomSuit, value: randomValue };
}

class Player {
  constructor(name) {
    this.name = name;
    this.hand = [];
    this.isTurn = false;
  }

  drawCard() {
    const drawnCard = getRandomCard();
    this.hand.push(drawnCard);
    this.updateHandUI();
  }

  playCard(index) {
    if (!this.isTurn) return;

    const playedCard = this.hand[index];
    const topCard = document.getElementById('top-card');
    const topCardData = parseCardData(topCard.textContent);

    if (canPlayCard(playedCard, topCardData)) {
      this.hand.splice(index, 1);
      topCard.textContent = `${playedCard.suit} ${playedCard.value}`;
      topCard.style.backgroundColor = 'white';
      this.updateHandUI();
      switchTurn();
    }
  }

  updateHandUI() {
    const playerHandElement = document.getElementById(`${this.name}-hand`);
    playerHandElement.innerHTML = '';
    for (const [index, card] of this.hand.entries()) {
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
      cardElement.textContent = `${card.suit} ${card.value}`;
      cardElement.onclick = () => this.playCard(index);
      cardElement.style.pointerEvents = this.isTurn ? 'auto' : 'none';
      playerHandElement.appendChild(cardElement);
    }
  }
}

function parseCardData(cardText) {
  const [suit, value] = cardText.split(' ');
  return { suit, value };
}

function canPlayCard(card, topCard) {
  return card.suit === topCard.suit || card.value === topCard.value;
}

const player1 = new Player('player1');
const player2 = new Player('player2');

let currentPlayer = player1;

function drawCard() {
  currentPlayer.drawCard();
  switchTurn();
}

function switchTurn() {
  currentPlayer.isTurn = false;
  currentPlayer.updateHandUI();

  currentPlayer = currentPlayer === player1 ? player2 : player1;
  currentPlayer.isTurn = true;
  currentPlayer.updateHandUI();

  if (currentPlayer === player2) {
    // Deshabilitar el botón de Jugador 2 cuando no es su turno
    document.querySelector('.deck').style.pointerEvents = 'none';
  } else {
    // Habilitar el botón de Jugador 2 cuando es su turno
    document.querySelector('.deck').style.pointerEvents = 'auto';
  }
}

function startGame() {
  for (let i = 0; i < 7; i++) {
    player1.drawCard();
    player2.drawCard();
  }
  const topCard = document.getElementById('top-card');
  const startingCard = getRandomCard();
  topCard.textContent = `${startingCard.suit} ${startingCard.value}`;
  topCard.style.backgroundColor = 'white';

  // Comienza el juego con el Jugador 1
  player1.isTurn = true;
  player1.updateHandUI();
}

startGame(); // Comenzar el juego con una carta al azar

// Botón para que el Jugador 2 reciba una carta al azar
const drawCardButton = document.createElement('div');
drawCardButton.classList.add('deck');
drawCardButton.textContent = 'Tomar Carta (Jugador 2) ';


drawCardButton.onclick = () => {
  if (currentPlayer === player2 && currentPlayer.isTurn) {
    currentPlayer.drawCard();
    switchTurn();
  }
};

document.querySelector('.center-area').appendChild(drawCardButton);


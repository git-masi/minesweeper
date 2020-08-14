import '../styles/main.css';

import Game from './Game';

const gameConfigForm = document.querySelector('#configGame');
const gameBoard = document.querySelector('#gameBoard');
const resetButton = document.querySelector('#resetButton');
const image = document.querySelector('.victoryImage');

let game = null;

gameConfigForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (game) return;

  image.classList.remove('animateVictoryImage');
  image.classList.add('hide');

  const formData = new FormData(e.target);
  const size = formData.get('size');
  const numMinesSetting = formData.get('numMinesSetting');

  game = new Game(size, numMinesSetting);
  game.addTileHTMLEls(gameBoard);

  document.documentElement.style.setProperty('--size', game.size);
  document.documentElement.style.setProperty(
    '--board-size',
    `${gameBoard.offsetHeight}px`
  );

  window.game = game;
  console.log(window.game);
});

resetButton.addEventListener('click', (e) => {
  e.preventDefault();

  game = null;

  [...gameBoard.children].forEach((child) => gameBoard.removeChild(child));
});

gameConfigForm.querySelector('button').click();

const replayButton = document.querySelector('#replayButton');
replayButton.addEventListener('click', () => {
  resetButton.click();
  gameConfigForm.querySelector('button[type="submit"]').click();
  replayButton.classList.add('hide');
});

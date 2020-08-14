import DisplayStats from './DisplayStats';
import Tile from './Tile';

export default class Game {
  constructor(size, numMinesSetting) {
    this.numMinesSetting = numMinesSetting;
    this.size = size * 1;
    this.totalTiles = this.size ** 2;
    this.numMines = this.calcNumMines();
    this.numFlagsRemaining = this.numMines;
    this.tiles = {};
    this.tilesWithMines = [];
    this.playing = true;
    this.timeRemaining = null;
    this.distributeMinesRandomly = true;
    this.addTiles();
    this.setTilesWithMines();
    this.updateTilesWithMines();
    this.updateNumAdjMines();
    this.display = new DisplayStats('#numFlagsDisplay');
    this.display.setNumFlagsRemainingDisplay(this.numFlagsRemaining);
  }

  calcNumMines() {
    const possibleNumMines = {
      '1': this.size,
      '2': Math.ceil(this.totalTiles / Math.log2(this.totalTiles)),
      '3': Math.ceil(this.totalTiles / Math.log2(this.size)),
      '4': Math.ceil(Math.log2(this.size) * this.size) + 1,
    };

    const minMax = {
      '1': {
        min: possibleNumMines['1'],
        max: possibleNumMines['1'],
      },
      '2': {
        min: possibleNumMines['1'],
        max: possibleNumMines['2'],
      },
      '3': {
        min: possibleNumMines['2'],
        max: possibleNumMines['3'],
      },
      '4': {
        min: possibleNumMines['2'],
        max: possibleNumMines['4'],
      },
      '5': {
        min: possibleNumMines['4'],
        max: possibleNumMines['4'],
      },
    };

    console.log(possibleNumMines);

    const max = minMax[this.numMinesSetting].max;
    const min = minMax['4'].min;
    const dif = max - min;
    return min + Math.floor(Math.random() * (dif + 1));
  }

  addTiles() {
    for (let i = 1; i <= this.totalTiles; i++) {
      const adjTiles = this.getAdjTiles(i);
      this.tiles[i] = new Tile(
        i,
        adjTiles,
        this.getNumFlagsRemaining,
        this.setNumFlagsRemaining,
        this.checkIfPlaying,
        this.gameOver,
        this.gameWon,
        this.checkIfWon
      );
    }
  }

  calcAdjTiles(num) {
    const top = num - this.size;
    const bottom = num + this.size;
    return {
      topLeft: top - 1,
      top: top,
      topRight: top + 1,
      left: num - 1,
      right: num + 1,
      bottomLeft: bottom - 1,
      bottom: bottom,
      bottomRight: bottom + 1,
    };
  }

  getValidTiles(possibleTiles) {
    const validators = {
      top: (n) => n > 0,
      left: (n) => n % this.size !== 0,
      right: (n) => (n - 1) % this.size !== 0,
      bottom: (n) => n <= this.totalTiles,
      topLeft: (n) => validators.top(n) && validators.left(n),
      topRight: (n) => validators.top(n) && validators.right(n),
      bottomLeft: (n) => validators.bottom(n) && validators.left(n),
      bottomRight: (n) => validators.bottom(n) && validators.right(n),
    };

    const keys = Object.keys(possibleTiles);

    const result = [];

    for (let key of keys) {
      if (validators[key](possibleTiles[key])) result.push(possibleTiles[key]);
    }

    return result;
  }

  getAdjTiles(num) {
    const allPossibleAdjTiles = this.calcAdjTiles(num);

    return this.getValidTiles(allPossibleAdjTiles);
  }

  setTilesWithMines() {
    while (this.tilesWithMines.length < this.numMines) {
      const num = Math.ceil(Math.random() * this.totalTiles);
      if (!this.tilesWithMines.includes(num)) this.tilesWithMines.push(num);
    }
  }

  updateTilesWithMines() {
    for (let tileNum of this.tilesWithMines) {
      this.tiles[tileNum].isMine = true;
    }
  }

  updateNumAdjMines() {
    let tilesArr = Object.values(this.tiles);

    for (let tile of tilesArr) {
      tile.numAdjMines = this.getNumAdjMines(tile.adjTiles);
    }
  }

  getNumAdjMines(adjTiles) {
    let count = 0;

    for (let tileNum of adjTiles) {
      if (this.tilesWithMines.includes(tileNum)) count++;
    }

    return count;
  }

  addTileHTMLEls(parent) {
    let tilesArr = Object.values(this.tiles);

    for (let tile of tilesArr) {
      tile.createHTML(parent);
    }
  }

  getNumFlagsRemaining = () => {
    return this.numFlagsRemaining;
  };

  setNumFlagsRemaining = (type) => {
    if (type === '+' && this.numFlagsRemaining < this.numMines) {
      this.numFlagsRemaining += 1;
    } else if (type === '-' && this.numFlagsRemaining > 0) {
      this.numFlagsRemaining -= 1;
    }

    this.display.setNumFlagsRemainingDisplay(this.numFlagsRemaining);
  };

  checkIfPlaying = () => this.playing;

  uncoverAllTiles() {
    const tiles = Object.values(this.tiles);
    tiles.forEach((tile) => tile.uncoverTile());
  }

  gameOver = () => {
    this.playing = false;
    this.uncoverAllTiles();
    console.log('%cGame over dude!', 'color: tomato');

    const replayButton = document.querySelector('#replayButton');
    replayButton.classList.remove('hide');
  };

  gameWon = () => {
    this.playing = false;
    this.uncoverAllTiles();
    animateVictoryImage();
    console.log('%cVictory!', 'color: goldenrod');
  };

  checkIfWon = () => {
    const tiles = Object.values(this.tiles);
    return tiles.every((tile) => (tile.isMine ? true : !tile.isCovered));
  };
}

window.animateVictoryImage = function animateVictoryImage() {
  const gameBoard = document.querySelector('#gameBoard');

  const imageDiameter = Math.min(gameBoard.offsetHeight, 200);

  const translateLength = gameBoard.offsetHeight + imageDiameter;
  document.documentElement.style.setProperty(
    '--translate-length',
    `${translateLength}px`
  );

  const image = document.querySelector('.victoryImage');
  image.style.top = `${gameBoard.offsetTop - imageDiameter}px`;
  image.style.left = `${gameBoard.offsetLeft - imageDiameter}px`;
  image.classList.remove('hide');
  image.classList.add('animateVictoryImage');
};

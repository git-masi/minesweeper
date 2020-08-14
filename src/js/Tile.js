export default class Tile {
  constructor(
    id,
    adjTiles,
    getNumFlags,
    setNumFlags,
    checkIfPlaying,
    gameOver,
    gameWon,
    checkIfWon
  ) {
    this.html = null;
    this.id = id;
    this.isMine = false;
    this.isFlagged = false;
    this.isCovered = true;
    this.numAdjMines = 0;
    this.adjTiles = adjTiles;
    this.getNumFlags = getNumFlags;
    this.setNumFlags = setNumFlags;
    this.checkIfPlaying = checkIfPlaying;
    this.gameOver = gameOver;
    this.gameWon = gameWon;
    this.checkIfWon = checkIfWon;
  }

  createHTML(parent) {
    if (!typeof parent.tagName === 'string') return;

    const div = document.createElement('DIV');

    this.html = div;

    div.dataset.id = this.id;
    div.classList.add('tile');
    div.classList.add('covered');

    if (this.numAdjMines > 0 && !this.isMine)
      div.textContent = this.numAdjMines.toString();

    if (this.isMine) div.classList.add('mine');

    div.addEventListener('mousedown', (e) => {
      if (!this.checkIfPlaying()) return;

      /**
       *
       * e.button returns a number
       * 0 = left mouse btn
       * 2 = right mouse btn
       *
       */
      if (e.button === 0) {
        if (this.isFlagged) return;

        e.target.classList.remove('covered');
        this.isCovered = false;

        if (this.isMine) {
          e.target.style.backgroundColor = 'tomato';
          this.gameOver();
          return;
        }
      } else if (e.button === 2) {
        if (!this.isCovered) return;

        if (this.isFlagged) {
          this.isFlagged = false;
          this.setNumFlags('+');
          e.target.classList.remove('flagged');
        } else if (this.getNumFlags() > 0) {
          this.setNumFlags('-');
          this.isFlagged = true;
          e.target.classList.add('flagged');
        }
      }

      if (this.getNumFlags() === 0) this.checkIfWon() ? this.gameWon() : null;
    });

    div.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    parent.appendChild(div);
  }

  uncoverTile() {
    if (this.isCovered) this.html.classList.remove('covered');
  }
}

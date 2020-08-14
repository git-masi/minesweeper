export default class DisplayStats {
  constructor(numFlagsSelector) {
    this.numMinesDisplay = document.querySelector(numFlagsSelector);
  }

  setNumFlagsRemainingDisplay(num) {
    if (!this.numMinesDisplay) return;
    this.numMinesDisplay.textContent = num;
  }
}

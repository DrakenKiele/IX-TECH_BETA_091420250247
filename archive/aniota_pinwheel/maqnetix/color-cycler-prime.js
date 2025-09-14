
export class PrimeColorCycler {
  constructor(gradients) {
    this.gradientNames = Object.keys(gradients);
    this.gradients = gradients;
    this.pairIndex = 0;
    this.colorIndex = 0;
  }
  getColor() {
    const grad = this.gradients[this.gradientNames[this.pairIndex]];
    return grad[this.colorIndex];
  }
  cyclePair(delta) {
    this.pairIndex = (this.pairIndex + delta + this.gradientNames.length) % this.gradientNames.length;
    this.colorIndex = 0;
    return this.getColor();
  }
  cycleShade(delta) {
    const grad = this.gradients[this.gradientNames[this.pairIndex]];
    this.colorIndex = (this.colorIndex + delta + grad.length) % grad.length;
    return this.getColor();
  }
  setRandom() {
    this.pairIndex = Math.floor(Math.random() * this.gradientNames.length);
    const grad = this.gradients[this.gradientNames[this.pairIndex]];
    this.colorIndex = Math.floor(Math.random() * grad.length);
    return this.getColor();
  }
}

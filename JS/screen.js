class Screen {
  drawIntro() {
    this.ctx.beginPath();
    this.ctx.filltext("HOW TO PLAY", this.canvas.width / 2, this.canvas.height / 2,);
    this.ctx.closePath();
  }
}

export class Timer {
  constructor(duration, onTick, onComplete) {
    this.duration = duration;
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.timeLeft = duration;
    this.timerId = null;
    this.startTime = null;
  }

  start() {
    if (this.timerId) {
      this.stop();
    }

    this.timeLeft = this.duration;
    this.startTime = Date.now();
    this.timerId = setInterval(() => this.update(), 100);
  }

  update() {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    this.timeLeft = Math.max(0, this.duration - elapsed);

    if (this.onTick) {
      this.onTick(this.timeLeft);
    }

    if (this.timeLeft <= 0) {
      this.stop();
      if (this.onComplete) this.onComplete();
    }
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  getTimeLeft() {
    return this.timeLeft;
  }
}

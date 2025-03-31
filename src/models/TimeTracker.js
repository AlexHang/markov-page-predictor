export class TimeTracker {
  constructor() {
    this.timeTaken = [];
  }

  addTime(page, time) {
    this.timeTaken.push({ page, time });
  }

  getTime() {
    return this.timeTaken;
  }
}

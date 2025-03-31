export class MarkovChain {
  constructor() {
    this.transitions = {};
    this.pageVisits = [];
    this.allPages = [];
  }

  addTransition(fromPage, toPage) {
    if (!this.transitions[fromPage]) {
      this.transitions[fromPage] = {};
    }

    if (!this.transitions[fromPage][toPage]) {
      this.transitions[fromPage][toPage] = 0;
    }

    this.transitions[fromPage][toPage]++;
    this.pageVisits.push({
      from: fromPage,
      to: toPage,
      timestamp: Date.now(),
    });

    if (!this.allPages.includes(fromPage)) {
      this.allPages.push(fromPage);
    }
    if (!this.allPages.includes(toPage)) {
      this.allPages.push(toPage);
    }
  }

  predictNextPage(currentPage) {
    if (!this.transitions[currentPage]) {
      return null;
    }

    let maxCount = 0;
    let predictedPage = null;

    for (const nextPage in this.transitions[currentPage]) {
      const count = this.transitions[currentPage][nextPage];
      if (count > maxCount) {
        maxCount = count;
        predictedPage = nextPage;
      }
    }

    return predictedPage;
  }

  getProbabilities(currentPage) {
    if (!this.transitions[currentPage]) {
      return {};
    }

    const total = Object.values(this.transitions[currentPage]).reduce(
      (sum, count) => sum + count,
      0
    );
    const probabilities = {};

    for (const nextPage in this.transitions[currentPage]) {
      probabilities[nextPage] = this.transitions[currentPage][nextPage] / total;
    }

    return probabilities;
  }

  getTransitionMatrix() {
    return this.transitions;
  }

  getPageVisits() {
    return this.pageVisits;
  }

  getAllPages() {
    return this.allPages?.sort();
  }
}

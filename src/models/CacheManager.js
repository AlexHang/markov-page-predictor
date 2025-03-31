export class CacheManager {
  constructor() {
    this.cache = {};
  }

  setData(key, data) {
    this.cache[key] = {
      data,
      timestamp: Date.now(),
    };
  }

  getData(key) {
    return this.cache[key] ? this.cache[key].data : null;
  }

  hasData(key) {
    return !!this.cache[key];
  }

  clearCache() {
    this.cache = {};
  }

  getCache() {
    return this.cache;
  }
}

class WebSocketApi {
  constructor(url) {
    this.events = {};
  }

  send(data) {
    const { event, payload } = data;
    this.events[event]?.forEach((callback) => {
      callback(payload);
    });
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
}

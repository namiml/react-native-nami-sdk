import { EventEmitter } from 'events';

class AppEventEmitterType {
  private eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  addListener(event, handler) {
    this.eventEmitter.addListener(event, handler);
  }

  removeListener(event, handler) {
    this.eventEmitter.removeListener(event, handler);
  }

  emit(event, params?) {
    this.eventEmitter.emit(event, params);
  }

  once(event, handler) {
    this.eventEmitter.once(event, handler);
  }
}

export const AppEventEmitter = new AppEventEmitterType();

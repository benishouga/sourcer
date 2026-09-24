type EventHandler = (...args: any[]) => void;

export default class EventEmitter {
  private listeners = new Map<string, Set<EventHandler>>();

  public on(event: string, handler: EventHandler) {
    this.getHandlers(event).add(handler);
  }

  public removeListener(event: string, handler: EventHandler) {
    const handlers = this.listeners.get(event);
    if (!handlers) {
      return;
    }
    handlers.delete(handler);
    if (handlers.size === 0) {
      this.listeners.delete(event);
    }
  }

  public emit(event: string, ...args: any[]) {
    const handlers = this.listeners.get(event);
    if (!handlers) {
      return;
    }
    handlers.forEach(handler => handler(...args));
  }

  private getHandlers(event: string) {
    let handlers = this.listeners.get(event);
    if (!handlers) {
      handlers = new Set<EventHandler>();
      this.listeners.set(event, handlers);
    }
    return handlers;
  }
}

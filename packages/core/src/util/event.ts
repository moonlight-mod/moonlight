export type MoonlightEventCallback = (data: string) => void;

export interface MoonlightEventEmitter {
  dispatchEvent: (id: string, data: string) => void;
  addEventListener: (id: string, cb: MoonlightEventCallback) => void;
  removeEventListener: (id: string, cb: MoonlightEventCallback) => void;
}

function nodeMethod(): MoonlightEventEmitter {
  const EventEmitter = require("events");
  const eventEmitter = new EventEmitter();
  const listeners = new Map<MoonlightEventCallback, (...args: any[]) => void>();

  return {
    dispatchEvent: (id: string, data: string) => {
      eventEmitter.emit(id, data);
    },

    addEventListener: (id: string, cb: (data: string) => void) => {
      if (listeners.has(cb)) return;

      function listener(data: string) {
        cb(data);
      }

      listeners.set(cb, listener);
      eventEmitter.on(id, listener);
    },

    removeEventListener: (id: string, cb: (data: string) => void) => {
      const listener = listeners.get(cb);
      if (listener == null) return;
      listeners.delete(cb);
      eventEmitter.off(id, listener);
    }
  };
}

export function createEventEmitter(): MoonlightEventEmitter {
  webPreload: {
    const eventEmitter = new EventTarget();
    const listeners = new Map<MoonlightEventCallback, (e: Event) => void>();

    return {
      dispatchEvent: (id: string, data: string) => {
        eventEmitter.dispatchEvent(new CustomEvent(id, { detail: data }));
      },

      addEventListener: (id: string, cb: (data: string) => void) => {
        if (listeners.has(cb)) return;

        function listener(e: Event) {
          const event = e as CustomEvent<string>;
          cb(event.detail);
        }

        listeners.set(cb, listener);
        eventEmitter.addEventListener(id, listener);
      },

      removeEventListener: (id: string, cb: (data: string) => void) => {
        const listener = listeners.get(cb);
        if (listener == null) return;
        listeners.delete(cb);
        eventEmitter.removeEventListener(id, listener);
      }
    };
  }

  nodePreload: {
    return nodeMethod();
  }

  injector: {
    return nodeMethod();
  }

  throw new Error("Called createEventEmitter() in an impossible environment");
}

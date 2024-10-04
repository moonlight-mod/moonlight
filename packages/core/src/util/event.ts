import { MoonlightEventEmitter } from "@moonlight-mod/types/core/event";

function nodeMethod<
  EventId extends string = string,
  EventData = Record<EventId, any>
>(): MoonlightEventEmitter<EventId, EventData> {
  const EventEmitter = require("events");
  const eventEmitter = new EventEmitter();
  const listeners = new Map<(data: EventData) => void, (e: Event) => void>();

  return {
    dispatchEvent: <Id extends keyof EventData>(
      id: Id,
      data: EventData[Id]
    ) => {
      eventEmitter.emit(id as string, data);
    },

    addEventListener: <Id extends keyof EventData>(
      id: Id,
      cb: (data: EventData[Id]) => void
    ) => {
      const untyped = cb as (data: EventData) => void;
      if (listeners.has(untyped)) return;

      function listener(e: Event) {
        const event = e as CustomEvent<string>;
        cb(event as EventData[Id]);
      }

      listeners.set(untyped, listener);
      eventEmitter.on(id as string, listener);
    },

    removeEventListener: <Id extends keyof EventData>(
      id: Id,
      cb: (data: EventData[Id]) => void
    ) => {
      const untyped = cb as (data: EventData) => void;
      const listener = listeners.get(untyped);
      if (listener == null) return;
      listeners.delete(untyped);
      eventEmitter.off(id as string, listener);
    }
  };
}

function webMethod<
  EventId extends string = string,
  EventData = Record<EventId, any>
>(): MoonlightEventEmitter<EventId, EventData> {
  const eventEmitter = new EventTarget();
  const listeners = new Map<(data: EventData) => void, (e: Event) => void>();

  return {
    dispatchEvent: <Id extends keyof EventData>(
      id: Id,
      data: EventData[Id]
    ) => {
      eventEmitter.dispatchEvent(
        new CustomEvent(id as string, { detail: data })
      );
    },

    addEventListener: <Id extends keyof EventData>(
      id: Id,
      cb: (data: EventData[Id]) => void
    ) => {
      const untyped = cb as (data: EventData) => void;
      if (listeners.has(untyped)) return;

      function listener(e: Event) {
        const event = e as CustomEvent<string>;
        cb(event.detail as EventData[Id]);
      }

      listeners.set(untyped, listener);
      eventEmitter.addEventListener(id as string, listener);
    },

    removeEventListener: <Id extends keyof EventData>(
      id: Id,
      cb: (data: EventData[Id]) => void
    ) => {
      const untyped = cb as (data: EventData) => void;
      const listener = listeners.get(untyped);
      if (listener == null) return;
      listeners.delete(untyped);
      eventEmitter.removeEventListener(id as string, listener);
    }
  };
}

export function createEventEmitter<
  EventId extends string = string,
  EventData = Record<EventId, any>
>(): MoonlightEventEmitter<EventId, EventData> {
  webPreload: {
    return webMethod();
  }

  nodePreload: {
    return nodeMethod();
  }

  injector: {
    return nodeMethod();
  }

  browser: {
    return webMethod();
  }

  throw new Error("Called createEventEmitter() in an impossible environment");
}

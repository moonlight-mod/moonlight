import type { MoonlightEventEmitter } from "@moonlight-mod/types/core/event";

export function createEventEmitter<
  EventId extends string = string,
  EventData = Record<EventId, any>
>(): MoonlightEventEmitter<EventId, EventData> {
  webTarget: {
    const eventEmitter = new EventTarget();
    const listeners: Map<(data: EventData) => void, (e: Event) => void> = new Map();

    return {
      dispatchEvent: <Id extends keyof EventData>(id: Id, data: EventData[Id]) => {
        eventEmitter.dispatchEvent(new CustomEvent(id as string, { detail: data }));
      },

      addEventListener: <Id extends keyof EventData>(id: Id, cb: (data: EventData[Id]) => void) => {
        const untyped = cb as (data: EventData) => void;
        if (listeners.has(untyped)) return;

        function listener(e: Event) {
          const event = e as CustomEvent<string>;
          cb(event.detail as EventData[Id]);
        }

        listeners.set(untyped, listener);
        eventEmitter.addEventListener(id as string, listener);
      },

      removeEventListener: <Id extends keyof EventData>(id: Id, cb: (data: EventData[Id]) => void) => {
        const untyped = cb as (data: EventData) => void;
        const listener = listeners.get(untyped);
        if (listener == null) return;
        listeners.delete(untyped);
        eventEmitter.removeEventListener(id as string, listener);
      }
    };
  }

  nodeTarget: {
    const EventEmitter = require("node:events");
    const eventEmitter = new EventEmitter();
    const listeners: Map<(data: EventData) => void, (e: Event) => void> = new Map();

    return {
      dispatchEvent: <Id extends keyof EventData>(id: Id, data: EventData[Id]) => {
        eventEmitter.emit(id as string, data);
      },

      addEventListener: <Id extends keyof EventData>(id: Id, cb: (data: EventData[Id]) => void) => {
        const untyped = cb as (data: EventData) => void;
        if (listeners.has(untyped)) return;

        function listener(e: Event) {
          const event = e as CustomEvent<string>;
          cb(event as EventData[Id]);
        }

        listeners.set(untyped, listener);
        eventEmitter.on(id as string, listener);
      },

      removeEventListener: <Id extends keyof EventData>(id: Id, cb: (data: EventData[Id]) => void) => {
        const untyped = cb as (data: EventData) => void;
        const listener = listeners.get(untyped);
        if (listener == null) return;
        listeners.delete(untyped);
        eventEmitter.off(id as string, listener);
      }
    };
  }

  throw new Error("Called createEventEmitter() in an impossible environment");
}

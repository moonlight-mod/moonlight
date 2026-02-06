export type BasePayload = {
  type: string;
};
export type Interceptor<T extends BasePayload> = (payload: T) => boolean;
export type Listener<T extends BasePayload> = (payload: T) => void;

export type ServiceWorkerType = ServiceWorker | unknown;

export interface IPromiseEventMap {
  resolve: CallableFunction;
  reject: CallableFunction;
}

export interface IEventRequest<T> {
  type: string;
  data?: T;
}

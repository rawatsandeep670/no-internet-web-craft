export type ServiceWorkerType = ServiceWorker | unknown;

export interface IPromiseEventMap {
  resolve: CallableFunction;
  reject: CallableFunction;
}

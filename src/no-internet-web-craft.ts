import { IEventRequest, IPromiseEventMap, ServiceWorkerType } from './types';

export default class NoInternetWebCraft {
  private version: string;

  private networkFallbackURL: string;

  private eventPromiseMap: Map<string, IPromiseEventMap> = new Map();

  constructor(networkFallbackURL: string, version: string) {
    this.networkFallbackURL = networkFallbackURL;
    this.version = version;
  }

  initWebSocket = (): Promise<any> => {
    if (!('serviceWorker' in navigator)) {
      return Promise.reject(new Error('Service Worker not supported!'));
    }

    return new Promise((resolve, reject) => {
      navigator.serviceWorker
        .register('/sw.js', {
          scope: './',
        })
        .then((registration: ServiceWorkerRegistration) => {
          let serviceWorker: ServiceWorkerType;

          if (registration.installing) {
            serviceWorker = registration.installing;
          } else if (registration.waiting) {
            serviceWorker = registration.waiting;
          } else if (registration.active) {
            serviceWorker = registration.active;
            this.onWorkerActivated(serviceWorker).then((res) => {
              resolve(res);
            });
          }

          if (serviceWorker) {
            (serviceWorker as ServiceWorker).addEventListener('statechange', (event) => {
              const sw = event?.target as ServiceWorker;
              if (sw.state === 'activated') {
                this.onWorkerActivated(serviceWorker).then((res) => {
                  resolve(res);
                });
              }
            });
          }
        })
        .catch((error) => {
          // Something went wrong during registration. The service-worker.js file
          // might be unavailable or contain a syntax error.
          reject(error);
        });
    });
  };

  private onWorkerActivated(serviceWorker: ServiceWorkerType): Promise<any> {
    this.addEventListenerToSW();
    return this.sendEventToSW(serviceWorker, {
      type: 'CACHE',
      data: {
        url: this.networkFallbackURL,
        version: this.version,
      },
    }).then((res: any) => res);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  sendEventToSW = (swInstance: ServiceWorkerType, data: IEventRequest<any>): Promise<any> => {
    const identity = (Math.random() * Date.now()).toString(16);
    return new Promise((resolve, reject) => {
      this.eventPromiseMap.set(identity, { resolve, reject });
      (swInstance as ServiceWorker).postMessage({ ...data, identity });
    });
  };

  addEventListenerToSW = (): void => {
    navigator.serviceWorker.addEventListener('message', (event) => {
      const { data } = event;
      if (this.eventPromiseMap.has(data.identity)) {
        (this.eventPromiseMap.get(data.identity) as IPromiseEventMap).resolve(data);
      }
    });
  };
}

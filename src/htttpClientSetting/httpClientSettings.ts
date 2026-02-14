import type { BaseSettings, Settings } from './httpClientSettings.types';
import { RESPONSE_AS } from './httpClientSettings.types';

export class HttpClientSettings {
  private settings = HttpClientSettings.getDefault();

  public static getDefault(): BaseSettings {
    return {
      responseAs: RESPONSE_AS.json,
      baseUrl: '',
      // delays: [600, 3000, 6000, 9000],
      // totalWaitTime: 60000,
      // retryBy: [429, 500, 524],
      // circuitBreaker: {
      //   failureThreshold: 3,
      //   successThreshold: 1,
      //   timeout: 10000,
      // },
    };
  }

  public get(): BaseSettings {
    return this.settings;
  }

  public set(settings: BaseSettings): void {
    this.settings = settings;
  }

  public merge(settings: Settings): Settings {
    return { ...this.settings, ...settings };
  }

  public generateCatchErrorOff(settings: BaseSettings): Settings {
    return { ...settings, catchError: false };
  }

  public generateCatchErrorOn(settings: BaseSettings): Settings {
    return { ...settings, catchError: true };
  }

  public makeUrl(url: string): string {
    return `${this.settings.baseUrl}${url}`;
  }
}

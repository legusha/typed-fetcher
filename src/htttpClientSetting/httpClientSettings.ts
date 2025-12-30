import type { Settings } from './httpClientSettings.types';
import { RESPONSE_AS } from './httpClientSettings.types';

export class HttpClientSettings {
  private settings = HttpClientSettings.getDefault();

  public static getDefault(): Settings {
    return {
      responseAs: RESPONSE_AS.json,
      baseUrl: '',
    };
  }

  public get(): Settings {
    return this.settings;
  }

  public set(settings: Settings): void {
    this.settings = settings;
  }

  public merge(settings: Settings): Settings {
    return { ...this.settings, ...settings };
  }

  public makeUrl(url: string): string {
    return `${this.settings.baseUrl}${url}`;
  }
}

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

//https://localhost:5001 
export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

export function getServerUrl()
{
  if (environment.production) {
    return "https://online-chat-server.herokuapp.com";
  }
  else
  {
    return "https://localhost:44367"
  }
}

const providers = [
  { provide: 'SERVER_URL', useFactory: getServerUrl, deps: [] },
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.error(err));

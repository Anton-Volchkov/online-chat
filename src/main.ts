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


const providers = [
  { provide: 'SERVER_URL', useFactory: ()=>"https://online-chat-server.herokuapp.com", deps: [] },
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.error(err));

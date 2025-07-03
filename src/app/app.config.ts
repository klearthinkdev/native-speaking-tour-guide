import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { API_PROVIDERS } from './api/api-providers';
import { routes } from './app.routes';
import { MAT_PROVIDERS } from './mat-providers';
import { AppJwtModule } from './shared/modules/app-jwt.module';
import { AppTranslateModule } from './shared/modules/app-translate.module';
import { AuthInterceptor } from './shared/services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    importProvidersFrom([AppJwtModule, AppTranslateModule]),
    provideAnimationsAsync(),
    ...MAT_PROVIDERS,
    ...API_PROVIDERS,
  ],
};

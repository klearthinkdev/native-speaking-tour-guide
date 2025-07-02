import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../../../environments/environment';

export const HttpLoaderFactory = (http: HttpClient) => {
  return new TranslateHttpLoader(http, 'i18n/', `.json?v=${environment.version}`);
};

export const AppTranslateModule = TranslateModule.forRoot({
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient],
  },
});

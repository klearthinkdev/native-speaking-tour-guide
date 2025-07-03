import { JwtModule } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment';
import { tokenGetter } from '../services/token-accessors';

export const AppJwtModule = JwtModule.forRoot({
  config: {
    tokenGetter,
    allowedDomains: environment.allowedDomains,
    disallowedRoutes: environment.disallowedRoutes,
    skipWhenExpired: true,
  },
});

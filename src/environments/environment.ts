// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mock: false,
  version: '0',

  hostCompanyId: 0,
  baseApiUrl: `/api`,
  allowedDomains: ['/api'],
  disallowedRoutes: ['/api/user/login'],

  tokenKey: 'dev:native-speaking-tour-guide:token',
  roomIdKey: 'dev:native-speaking-tour-guide:roomId',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

export const environment = {
  production: false,
  mock: false,
  version: '0.1β',

  /* FOR DEV API */
  hostCompanyId: 11,
  baseApiUrl: `https://dev.aispeak.in/api`,
  allowedDomains: ['dev.aispeak.in'],
  disallowedRoutes: ['https://dev.aispeak.in/api/user/login'],

  server: { server: 's8', url: 'wss://devws.aispeak.in/' },

  tokenKey: 'local:native-speaking-tour-guide:token',
  roomIdKey: 'local:native-speaking-tour-guide:roomId',
};

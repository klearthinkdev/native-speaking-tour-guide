export const environment = {
  production: true,
  mock: false,
  version: '0.1',

  /* FOR PROD API */
  hostCompanyId: 25,
  baseApiUrl: `https://aispeakin.com/api`,
  allowedDomains: ['aispeakin.com'],
  disallowedRoutes: ['https://aispeakin.com/api/user/login'],

  server: { server: 's6', url: 'wss://s6.aispeak.in/' },

  tokenKey: 'native-speaking-tour-guide:token',
  roomIdKey: 'native-speaking-tour-guide:roomId',
};

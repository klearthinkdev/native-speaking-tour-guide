export const environment = {
  production: true,
  mock: false,
  version: '0.1',

  /* FOR PROD API */
  baseApiUrl: `https://aispeakin.com/api`,
  allowedDomains: ['aispeakin.com'],
  disallowedRoutes: ['https://aispeakin.com/api/user/login'],
};

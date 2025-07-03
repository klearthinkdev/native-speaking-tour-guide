module.exports = [
  {
    context: ['/api'],
    target: 'http://localhost:8081' /* FOR LOCAL API */,
    // target: 'https://dev.aispeak.in' /* FOR DEV API */,
    // target: "https://aispeakin.com" /* FOR PROD API */,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
  },
];

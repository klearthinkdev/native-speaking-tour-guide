module.exports = [
  {
    context: ["/api"],
    target: "https://dev.aispeak.in",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
  },
];

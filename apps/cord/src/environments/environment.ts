export const environment = {
  production: false,
  beta: false,
  // issuer: 'https://cord.local/',
  issuer: 'https://auth.rikarin.org/realms/cord-sigma',

  authEndpoint: 'https://cord.local/api/auth',
  gatewayEndpoint: 'https://cord.local/gateway',
  apiEndpoint: 'https://cord.local/api',
  // cdnEndpoint: 'http://localhost:4296',
  // cdnEndpoint: 'https://beta-cdn.cord.dj',
  cdnEndpoint: 'https://cdn.cord.dj',

  twemojiAssets: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
  hCaptchaKey: '7022de2e-5031-4bf4-a9e8-3ff4e190b1bf',
  ga: '',
  sentry: ''
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error'; // Included with Angular CLI.

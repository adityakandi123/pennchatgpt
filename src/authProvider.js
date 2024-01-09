// authProvider.js
import { MsalAuthProvider, LoginType } from 'react-aad-msal';

// Msal Configurations
const config = {
  auth: {
    authority: 'https://login.microsoftonline.com/14e34c25-dbe7-4374-a026-99d90b7392f3',
    clientId: 'c54e1475-b52f-4db2-af8e-12bdd221197e',
    redirectUri: window.location.href,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true
  }
};

// Authentication Parameters
const authenticationParameters = {
  scopes: [
    'openid', 'profile', 'user.read'
  ]
}

// Options
const options = {
  loginType: LoginType.Redirect,
  tokenRefreshUri: window.location.origin + '/auth.html'
}

export const authProvider = new MsalAuthProvider(config, authenticationParameters, options);
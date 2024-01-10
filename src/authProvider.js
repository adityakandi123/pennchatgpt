// authProvider.js
import { EventType, PublicClientApplication } from "@azure/msal-browser";

// Msal Configurations
const config = {
  auth: {
    authority:
      "https://login.microsoftonline.com/14e34c25-dbe7-4374-a026-99d90b7392f3",
    clientId: "c54e1475-b52f-4db2-af8e-12bdd221197e",
    redirectUri: window.location.href,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true,
  },
};

const myMSALObj = new PublicClientApplication(config);

// Authentication Parameters
export const authenticationParameters = {
  scopes: ["openid", "profile", "User.Read"],
};

export const appScopes = {
  scopes: ["api://c54e1475-b52f-4db2-af8e-12bdd221197e/user_impersonation"],
};

myMSALObj.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
    const account = event.payload.account || {};
    myMSALObj.setActiveAccount(account);
  }
});

export default myMSALObj;

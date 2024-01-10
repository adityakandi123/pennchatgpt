import { InteractionType } from "@azure/msal-browser";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsalAuthentication,
} from "@azure/msal-react";
import App from "./App";
import myMSALObj, { authenticationParameters } from "./authProvider";

function Entry() {
  const handleLogout = () => {
    myMSALObj.logoutRedirect().catch(() => {
      console.error("Something went wrong while logging out");
    });
  };

  useMsalAuthentication(InteractionType.Redirect, authenticationParameters);

  return (
    <div>
      <AuthenticatedTemplate>
        <App />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>Not authenticated</UnauthenticatedTemplate>
    </div>
  );
}

export default Entry;

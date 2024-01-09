

import App from './App';
import { AzureAD, AuthenticationState  } from 'react-aad-msal';
import { authProvider } from './authProvider';

function Entry() {
    return (
       
        <AzureAD provider={authProvider} forceLogin={true}>
  {
    ({login, logout, authenticationState, error, accountInfo}) => {
      switch (authenticationState) {
        case AuthenticationState.Authenticated:
          return (
            <App></App>
          );
        case AuthenticationState.Unauthenticated:
          return (
            <div>
              {error && <p><span>An error occurred during authentication, please try again!</span></p>}
             
            </div>
          );
        case AuthenticationState.InProgress:
          return (<p>Authenticating...</p>);
      }
    }
  }
</AzureAD>
    );
  }
  
  export default Entry;
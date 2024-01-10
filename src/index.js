import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Entry from "./Entrypage";
import reportWebVitals from "./reportWebVitals";
import { MsalProvider } from "@azure/msal-react";
import myMSALObj from "./authProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
  // <AzureAD provider={authProvider} forceLogin={true}>

  // </AzureAD>
  <MsalProvider instance={myMSALObj}>
    <Entry />
  </MsalProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import * as React from "react";

import  GcpChatbot from './bot/chatbot';
function Azurepage() {
    return (<GcpChatbot apiURL={'https://penn-genai-backend.azurewebsites.net/middleware'}
         hostingEnv={'azure'}                 
    ></GcpChatbot>)
}

export default Azurepage;

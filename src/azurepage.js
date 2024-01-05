import * as React from "react";

import  GcpChatbot from './bot/chatbot';
function Azurepage() {
    return (<GcpChatbot apiURL={'https://1a8a-124-123-183-23.ngrok-free.app/middleware'}
         hostingEnv={'azure'}                 
    ></GcpChatbot>)
}

export default Azurepage;

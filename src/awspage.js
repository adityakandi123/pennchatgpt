import * as React from "react";
import  GcpChatbot from './bot/chatbot';
 
function Awspage() {
    return (<GcpChatbot apiURL={'https://i4vtq824t0.execute-api.us-east-1.amazonaws.com/deployement/central-api'}
    hostingEnv={'aws'}   
    ></GcpChatbot>)
}
 
export default Awspage;
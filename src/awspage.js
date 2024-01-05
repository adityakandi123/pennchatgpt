import * as React from "react";
import  GcpChatbot from './bot/chatbot';
 
function Awspage() {
    return (<GcpChatbot apiURL={'https://18ci70yd08.execute-api.us-east-1.amazonaws.com/developement/central-api'}
    hostingEnv={'aws'}   
    ></GcpChatbot>)
}
 
export default Awspage;
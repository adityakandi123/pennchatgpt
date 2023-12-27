import logo from './logo.svg';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import './App.css';
import Awspage from './awspage';
import Azurepage from './azurepage';

// import  GcpChatbot from './azurechatbot/chatbot';

function App() {
  return (
<Router>
                <div className="App">
                  
                    <Routes>
                        <Route
                            exact
                            path="/"
                            element={<Awspage />}
                        ></Route>
                       
                        <Route
                            exact
                            path="/azure"
                            element={<Azurepage />}
                        ></Route>
                    </Routes>
                </div>
            </Router>

    // <div className="App">
    //   {/* <GcpChatbot ></GcpChatbot> */}
    //   <Awspage></Awspage>
    // </div>
  );
}

export default App;

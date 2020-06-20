import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Join from "./components/Join";
import Chat from "./components/Chat";

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/">
          <Join />
        </Route>
        <Route path="/chat">
          <Chat />
        </Route>
      </Router>
    </div>
  );
}

export default App;

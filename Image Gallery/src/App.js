import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import { AuthProvider } from './Components/AuthComponents/Auth';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div >
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
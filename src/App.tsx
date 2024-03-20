import React, { Component } from "react";
import { BrowserRouter as Router, Route, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home/Home";
import Chat from "./Pages/Chat/Chat";
import Profile from "./Pages/Profile/Profile";
import Signup from "./Pages/Signup/Signup";
import Login from "./Pages/Login/Login";
import { toast, ToastContainer, ToastPosition } from "react-toastify";

// Define empty interfaces for Props and State as placeholders
interface Props {}
interface State {}

class App extends Component (Props, State) {
  showToast = (type: number, message: string) => {
    switch (type) {
      case 0:
        toast.warning(message);
        break;
      case 1:
        toast.success(message);
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <Router>
        <ToastContainer
          autoClose={2000}
          hideProgressBar={true}
          position={toast.POSITION.BOTTOM_CENTER}
        />
        <RouterProvider>
          <Route exact path="/" component={Home} />

          <Route
            path="/login"
            render={(props) => <Login {...props} showToast={this.showToast} />}
          />

          <Route
            path="/profile"
            render={(props) => <Profile {...props} showToast={this.showToast} />}
          />

          <Route
            path="/signup"
            render={(props) => <Signup {...props} showToast={this.showToast} />}
          />

          <Route
            path="/chat"
            render={(props) => <Chat {...props} showToast={this.showToast} />}
          />
        </RouterProvider>
      </Router>
    );
  }
}

export default App;

import React, { Component } from "react";
import "./css/bootstrap.min.css";
import { Provider } from "react-redux";
import store from "./store";
import Header from "./containers/Header";
import Body from "./containers/Banner";
import CreatePost from "./components/CreatePost";
import Side from "./containers/Side";
import Rank from "./containers/Rank";
import HomePage from "./containers/HomePage";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Header />
        <div className="container" style={{ marginTop: "70px" }}>
          <Body />
          <div className="row">
            <div className="col-3">
              <Side />
              <Rank />
            </div>
            <div className="col">
              <CreatePost />
              <HomePage />
            </div>
          </div>
        </div>
      </Provider>
    );
  }
}

export default App;

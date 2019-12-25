import React, { Component } from "react";
import "./css/bootstrap.min.css";
import { Provider } from "react-redux";
import { Container, Row, Col } from 'react-bootstrap';
import store from './store';
import Header from './containers/Header';
import Social from './containers/social/Social';
import Tourism from './containers/tourism/Tourism';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Header />
        <Container>
          <Row style={{marginTop: "30px", height: "80vh"}}>
            <Col xs={6}>
              <Social />
            </Col>
            <Col>
              <Tourism />
            </Col>
          </Row>
        </Container>
      </Provider>
    );
  }
}

export default App;

import React, { Component } from 'react';
import './../css/bootstrap.min.css';

class Body extends Component {
  render() {
    return (
      <div>
        <hr />
        <div className="jumbotron">
          <h1 className="display-3">A Blockchain-based Forum!</h1>
          <p className="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
          <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
          <p className="lead">
            <a className="btn btn-primary btn-lg" href="#" role="button">Learn more</a>
          </p>
        </div>
      </div>
    );
  }
}

export default Body;

import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { getFriends } from "../../actions/peopleActions";
import { getPlaces } from "../../actions/placeActions";
import FriendCard from "./FriendCard";

var friends = [
  {
    name: "Isabel",
    location: "Taipei",
  },
  {
    name: "Kevin",
    location: "Tainan"
  }
]

class Social extends Component {
  componentDidMount() {
    this.props.getFriends("賴沂謙");
  }

  render() {
    const cardlist = this.props.people.friends.map((f, idx) => {
      return (<FriendCard key={idx} friend={f} />)
    })
    return (
      <div>
        <h5>Check out your friends!</h5>
        <div style={{ height: "80vh", overflowY: "auto" }}>
          {cardlist}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  people: state.people,
});

export default connect(mapStateToProps, { getFriends })(Social);

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
    // const name="賴沂謙";
    // axios
    //   .get(`/friends/${name}`)
    //   .then(res => {
    //     console.log(res.data)
    //   });
  }

  render() {
    const cardlist = friends.map(f => {
      return (<FriendCard friend={f} />)
    })
    return (
      <div>
        <h5>Check out your friends!</h5>
        {cardlist}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  category: state.category,
  post: state.post
});

export default connect(mapStateToProps, { getFriends, getPlaces })(Social);

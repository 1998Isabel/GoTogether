import React, { Component } from "react";
import { connect } from "react-redux";
import { getCategories } from "../../actions/categoryActions";
import { getPosts } from "../../actions/postActions";
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

export default connect(mapStateToProps, { getCategories, getPosts })(Social);

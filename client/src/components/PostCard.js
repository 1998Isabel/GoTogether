import React, { Component } from "react";
import "./../css/bootstrap.min.css";
import moment from "moment";

class PostCard extends Component {
  render() {
    let { post } = this.props;
    let time = moment(post.date).format("MMMM Do YYYY, h:mm:ss a");
    // console.log(moment().diff(moment(post.date), "seconds"));
    return (
      <div>
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{post.title}</h5>
            <h6 className="card-subtitle text-muted">{post.category}</h6>
          </div>
          {/* <img style={{height: "200px", width: "100%", display: "block"}} src="" alt="Card image" /> */}
          <div className="card-body">
            <p className="card-text">{post.content}</p>
          </div>
          <div className="card-footer text-muted">{time}</div>
        </div>
      </div>
    );
  }
}

export default PostCard;

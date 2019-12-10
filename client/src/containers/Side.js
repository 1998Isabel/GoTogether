import React, { Component } from "react";
import "./../css/bootstrap.min.css";
import { connect } from "react-redux";
import { getCategories } from "../actions/categoryActions";
import { getPosts } from "../actions/postActions";

class Side extends Component {
  componentDidMount() {
    this.props.getCategories();
    this.props.getPosts();
  }

  render() {
    const sidelist = this.props.category.categories.map((c, index) => {
      const postnum = this.props.post.posts.filter(post => post.category === c)
        .length;
      return (
        <li
          key={index}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          {c}
          <span className="badge badge-primary badge-pill">{postnum}</span>
        </li>
      );
    });
    return (
      <div>
        <h5>Catagories</h5>
        <ul className="list-group">{sidelist}</ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  category: state.category,
  post: state.post
});

export default connect(mapStateToProps, { getCategories, getPosts })(Side);

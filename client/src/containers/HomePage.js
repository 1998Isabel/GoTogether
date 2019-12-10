import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPosts, addPost, deletePost } from '../actions/postActions';
import PostCard from '../components/PostCard';

class HomePage extends Component {
	componentDidMount() {
		this.props.getPosts();
	}

	render() {
		const { posts } = this.props.post
		console.log(posts)
		const postlist = this.props.post.posts.map((p, index) => {
			return (
				<PostCard key={index} post={p} />
			)
		})

		return (
			<div>
				<h5>Posts</h5>
				{postlist}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	post: state.post
});

export default connect(mapStateToProps, { getPosts, addPost, deletePost })(HomePage);

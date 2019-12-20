import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Card, Button, Form } from 'react-bootstrap';

const color = ["success", "secondary", "danger", "warning", "info", "light"]

class FriendCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			weather: null,
			hobbies: this.props.friend.hobbies.map(h => (
				{
					check: true,
					hobby: h
				}
			))
		}
	}

	componentDidMount() {
		const location = "臺北市";
		axios.get(`/weather/${location}`)
			.then(res => {
				console.log(res);
				this.setState({
					weather: res.data[0].天氣預報綜合描述,
				})
			}
			);
	}

	checkHobby = (idx) => {
		let updatehobbies = this.state.hobbies;
		updatehobbies[idx].check = !updatehobbies[idx].check;
		this.setState({hobbies: updatehobbies})
	}

	getHobbies = () => {
		return this.state.hobbies.map((h, idx) => {
			const showcolor = h.check ? color[idx % 5] : color[5];
			return (
				<span key={idx} onClick={() => this.checkHobby(idx)} className={`badge badge-${showcolor}`} style={{ marginLeft: "10px", cursor: "pointer" }}>{h.hobby}</span>
			)
		})
	}

	render() {
		return (
			<Card style={{ margin: "10px" }}>
				<Card.Header as="h5">
					{this.props.friend.name}
					<Button variant="primary" style={{ float: "right" }}>Go</Button>
				</Card.Header>
				<Card.Body>
					<Card.Title>{this.props.friend.location}</Card.Title>
					<Card.Text>
						<p>
							Hobbys:
							{this.getHobbies()}
						</p>
						<p>
							Location: 臺北市
							<footer class="blockquote-footer">{this.state.weather}</footer>
						</p>
					</Card.Text>
				</Card.Body>
			</Card>
		);
	}
}

const mapStateToProps = state => ({
	people: state.people,
});


export default connect(mapStateToProps, null)(FriendCard);

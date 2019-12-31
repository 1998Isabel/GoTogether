import React, { Component } from "react";
import axios from "axios";
import jsxToString from 'jsx-to-string';
import { connect } from "react-redux";
import { getPlaces } from "../../actions/placeActions";
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import urls from "../../weatherurl";
import { color, EN_hobbies, CH_hobbies } from '../../utils';

class FriendCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			weather: null,
			weatherurl: null,
			location: this.props.friend.location[0],
			hobbies: this.props.friend.hobbies.map(h => (
				{
					check: true,
					hobby: h
				}
			))
		}
	}

	componentDidMount() {
		axios.get(`/weather/${this.state.location}`)
			.then(res => {
				const url = urls.find(w => w.weather === res.data[0].天氣現象).url
				this.setState({
					weather: res.data[0].天氣預報綜合描述,
					weatherurl: url,
				})
			});
	}

	checkHobby = (idx) => {
		let updatehobbies = this.state.hobbies;
		updatehobbies[idx].check = !updatehobbies[idx].check;
		this.setState({ hobbies: updatehobbies })
	}

	getHobbies = () => {
		return this.state.hobbies.map((h, idx) => {
			const showcolor = h.check ? color[idx % 5] : color[5];
			return (
				<span key={idx} onClick={() => this.checkHobby(idx)} className={`badge badge-${showcolor}`} style={{ marginLeft: "10px", cursor: "pointer" }}>{CH_hobbies[EN_hobbies.findIndex(e => e === (h.hobby))]}</span>
			)
		})
	}

	chooseLocation = (e) => {
		this.setState({ location: e.target.value })
	}

	handleInviteClick = () => {
		let checkedplaces = this.props.place.places.filter(p => p.check).map(p => (
			<li>
				<h3>{p.title}</h3>
				<ul>
					<li>{p.address}</li>
				</ul>
			</li>
		))
		let emailhtml = (
			<div>
				<h3>Invited trip from your friend!</h3>
				<h4>These are the recommended tourism~</h4>
				<ul>
					{checkedplaces}
				</ul>
				<footer>--From GoTogether!</footer>
			</div>
		)
		let xmlText = jsxToString(emailhtml)
		axios.post('/email', {
			params: {
				addr: this.props.friend.studentId + "@ntu.edu.tw",
				subject: this.props.people.user.name + " has invited you to a trip!",
				body: xmlText,
			}
		}).then(res => {
			console.log(res)
		})
	}

	handleGoClick = () => {
		const con = {
			location: this.props.people.user.location[0],
			latlng: this.props.people.user.latlng,
			hobbies: this.state.hobbies.filter(h => h.check).map(h => h.hobby)
		}
		this.props.getPlaces(con)
	}

	render() {

		return (
			<Card style={{ marginBottom: "10px" }}>
				<Card.Header as="h5">
					{this.props.friend.name}
					<Button variant="primary" size="sm" style={{ float: "right" }} onClick={this.handleGoClick}>Go</Button>
					<Button variant="outline-secondary" size="sm" style={{ float: "right", marginRight: "10px" }} onClick={this.handleInviteClick}>Invite</Button>
				</Card.Header>
				<Card.Body>
					<Card.Text>
						<p>
							Hobbies:
							{this.getHobbies()}
						</p>
						<Row>
							<Col>
								Location: {this.props.friend.location[0]}, {this.props.friend.location[1]}
								<span style={{ marginLeft: "10px" }}><img src={this.state.weatherurl} alt="weather" width="30px" /></span>
							</Col>
						</Row>
					</Card.Text>
					<footer className="blockquote-footer">{this.state.weather}</footer>
				</Card.Body>
			</Card>
		);
	}
}

const mapStateToProps = state => ({
	people: state.people,
	place: state.place,
});


export default connect(mapStateToProps, { getPlaces })(FriendCard);

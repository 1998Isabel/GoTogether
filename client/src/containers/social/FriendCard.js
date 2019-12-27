import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { getPlaces } from "../../actions/placeActions";
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import urls from "../../weatherurl";

const color = ["success", "secondary", "danger", "warning", "info", "light"]
const cities = ["基隆市", "臺北市", "新北市", "桃園縣", "新竹市", "新竹縣", "苗栗縣", "台中市", "彰化縣", "南投縣", "雲林縣",
	"嘉義市", "嘉義縣", "臺南市", "高雄市", "屏東縣", "臺東縣", "花蓮縣", "宜蘭縣", "澎湖縣", "金門縣", "連江縣"]

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
				<span key={idx} onClick={() => this.checkHobby(idx)} className={`badge badge-${showcolor}`} style={{ marginLeft: "10px", cursor: "pointer" }}>{h.hobby}</span>
			)
		})
	}

	chooseLocation = (e) => {
		this.setState({ location: e.target.value })
	}

	handleGoClick = () => {
		const con = {
			location: this.props.people.user.location[0],
			latlng: this.props.people.user.latlng,
			hobbies: this.state.hobbies.filter(h => h.check).map(h => h.hobby)
		}
		this.props.getPlaces(con)
		console.log(this.state)
	}

	render() {
		const cityOptions = cities.map((c, idx) => (
			<option key={idx} value={c}>{c}</option>
		))
		return (
			<Card style={{ marginBottom: "10px" }}>
				<Card.Header as="h5">
					{this.props.friend.name}
					<Button variant="primary" size="sm" style={{ float: "right" }} onClick={this.handleGoClick}>Go</Button>
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
});


export default connect(mapStateToProps, { getPlaces })(FriendCard);

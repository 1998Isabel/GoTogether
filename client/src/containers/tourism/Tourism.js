import React, { Component } from 'react';
import axios from "axios";
import { connect } from "react-redux";
import { showPlace } from "../../actions/placeActions";
import { ListGroup, Table } from 'react-bootstrap';
import Map from "./Map";
import urls from "../../weatherurl";

const color = ["success", "secondary", "danger", "warning", "info"]

class Tourism extends Component {
	constructor(props) {
		super(props);
		this.state = {
			weather: []
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.people.user !== prevProps.people.user) {
			axios.get(`/weather/${this.props.people.user.location[0]}`)
				.then(res => {
					let weathers = []
					res.data.forEach((d, idx) => {
						if (idx % 2 === 1) {
							weathers.push(urls.find(w => w.weather === d.天氣現象).url)
						}
					})
					this.setState({
						weather: weathers
					})
				});
		}
	}

	handleClick = (idx) => {
		const { map, maps } = this.props.place.gmap;
		const { places } = this.props.place;
		map.setCenter(new maps.LatLng(places[idx].latitude, places[idx].longitude));
		map.setZoom(16);
		this.props.showPlace(idx);
	}

	render() {
		let placeItem = this.props.place.places.map((p, idx) => (
			<ListGroup.Item key={idx} variant={color[idx % 5]} onClick={() => this.handleClick(idx)}>{p.title}</ListGroup.Item>
		))

		if (placeItem.length === 0)
			placeItem.push((
				<div>No recommend tourism yet!</div>
			))

		const labels = this.state.weather.map((l, idx) => (
			<th key={idx} style={{ textAlign: "center" }}>第{idx + 1}天</th>
		))
		const imgs = this.state.weather.map((w, idx) => (
			<td>
				<img src={w} alt={idx} width="80%" />
			</td>
		))

		return (
			<div style={{ width: "100%", height: "90%" }}>
				<h5>Tourism for you in <span className="text-muted"> {this.props.people.user?this.props.people.user.location[0]+", "+this.props.people.user.location[1]:null}</span>!</h5>
				<div style={{ width: "100%", height: "13vh" }}>
					<Table responsive size="sm">
						<thead>
							<tr>
								{labels}
							</tr>
						</thead>
						<tbody>
							<tr>
								{imgs}
							</tr>
						</tbody>
					</Table>
				</div>
				<ListGroup variant="flush" style={{ width: "100%", height: "28vh", overflowY: "auto", marginBottom: "10px" }}>
					{placeItem}
				</ListGroup>
				<Map />
			</div>
		)
	}
}
const mapStateToProps = state => ({
	people: state.people,
	place: state.place
});

export default connect(mapStateToProps, { showPlace })(Tourism);
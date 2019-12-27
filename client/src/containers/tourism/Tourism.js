import React, { Component } from 'react';
import axios from "axios";
import { connect } from "react-redux";
import { showPlace } from "../../actions/placeActions";
import { ListGroup, Table } from 'react-bootstrap';
import Map from "./Map";
import urls from "../../weatherurl";

const color = ["success", "secondary", "danger", "warning", "info", "light"]

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
					console.log("RES", res)
					res.data.forEach((d, idx) => {
						if (idx % 2 === 1) {
							weathers.push(urls.find(w => w.weather === d.天氣現象).url)
						}
					})
					console.log("WEA", weathers)
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
		const placeItem = this.props.place.places.map((p, idx) => (
			<ListGroup.Item key={idx} variant={color[idx % 6]} onClick={() => this.handleClick(idx)}>{p.title}</ListGroup.Item>
		))

		const labels = this.state.weather.map((l, idx) => (
			<th style={{ textAlign: "center" }}>第{idx + 1}天</th>
		))
		const imgs = this.state.weather.map((w, idx) => (
			<td>
				<img src={w} alt={idx} width="80%" />
			</td>
		))

		return (
			<div style={{ width: "100%", height: "90%" }}>
				<h5>Tourism for you in <span className="text-muted"> {this.props.people.user?this.props.people.user.location[0]+", "+this.props.people.user.location[1]:null}</span>!</h5>
				<div style={{ width: "100%", height: "15%" }}>
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
				<ListGroup variant="flush" style={{ width: "100%", height: "20%", overflowY: "auto", marginBottom: "10px" }}>
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
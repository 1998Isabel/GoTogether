import React, { Component } from 'react';
import { connect } from "react-redux";
import { changePlace } from "../../actions/placeActions";
import InfoWindow from './InfoWindow';

// Marker component
class Marker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			place: this.props.place
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps !== this.props) {
			const { idx, place, onChangeGeo } = this.props;
			var request = {
				query: place.title,
				fields: ['name', 'formatted_address', 'geometry', 'photos', 'place_id', 'types', 'rating'],
			};
			this.setState({ place: place })
			var service = new this.props.mapApi.places.PlacesService(this.props.mapInstance);
			service.findPlaceFromQuery(request, (results, status) => {
				if (status === this.props.mapApi.places.PlacesServiceStatus.OK) {
					if (place.latitude === 0)
						this.props.changePlace({ id: idx, lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() });
					const updateplace = { ...this.state.place, ...results[0] }
					this.setState({ place: updateplace })
				}
			});
		}
	}

	render() {
		// const { idx, place, onChangeGeo } = this.props;
		// var request = {
		// 	query: place.title,
		// 	fields: ['name', 'formatted_address', 'geometry', 'photos', 'place_id', 'types', 'rating'],
		// };
		// var updateplace = place;
		// var service = new this.props.mapApi.places.PlacesService(this.props.mapInstance);
		// service.findPlaceFromQuery(request, (results, status) => {
		// 	if (status === this.props.mapApi.places.PlacesServiceStatus.OK) {
		// 		if (place.latitude === 0)
		// 			this.props.changePlace({ id: idx, lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() });
		// 		updateplace = { ...place, ...results[0] }
		// 	}
		// });
		return (
			<>
				{this.props.show && <InfoWindow place={this.state.place} />}
			</>
		)
	}
};

export default connect(null, { changePlace })(Marker);
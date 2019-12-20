import React, { Component } from 'react';
import InfoWindow from './InfoWindow';

// Marker component
class Marker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			place: this.props.place
		}
	}

	componentDidMount() {
		const { idx, place, lat, lng, onChangeGeo } = this.props;
		var request = {
			query: this.state.place.name,
			fields: ['name', 'formatted_address', 'geometry', 'icon', 'permanently_closed', 'photos', 'place_id', 'types', 'rating'],
		};
		var service = new this.props.mapApi.places.PlacesService(this.props.mapInstance);
		service.findPlaceFromQuery(request, (results, status) => {
			if (status === this.props.mapApi.places.PlacesServiceStatus.OK) {
				console.log(results[0]);
				const newlat = results[0].geometry.location.lat();
				const newlng = results[0].geometry.location.lng();
				if (lat !== newlat || lng !== newlng) {
					onChangeGeo(idx, newlat, newlng);
				}
				const place = { ...this.state.place, ...results[0] }
				this.setState({ place: place })
			}
		});
	}

	render() {
		return (
			<>
				{this.props.show && <InfoWindow place={this.state.place} />}
			</>
		)
	}
};

export default Marker;
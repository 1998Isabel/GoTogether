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
		var request = {
			query: this.state.place.name,
			fields: ['name', 'formatted_address', 'geometry', 'icon', 'permanently_closed', 'photos', 'place_id', 'types', 'rating'],
		};
		var service = new this.props.mapApi.places.PlacesService(this.props.mapInstance);
		service.findPlaceFromQuery(request, (results, status) => {
			if (status === this.props.mapApi.places.PlacesServiceStatus.OK) {
				for (var i = 0; i < results.length; i++) {
					console.log(results[i]);
					const place = { ...this.state.place, ...results[i] }
					this.setState({ place: place })
				}
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
import React, { Component } from 'react';
import isEmpty from 'lodash.isempty';
import { connect } from "react-redux";
import { loadMap, showPlace } from "../../actions/placeActions";
import GoogleMap from './GoogleMap';
import MarkerInfo from './MarkerInfo';

const CENTER = [25.021918, 121.535285];
var markers = [];

class Map extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mapApiLoaded: false,
			mapInstance: null,
			mapApi: null,
		};
	}

	apiHasLoaded = (map, maps, places) => {
		this.props.loadMap({map: map, maps: maps});
		this.setState({
			mapApiLoaded: true,
			mapInstance: map,
			mapApi: maps,
		});
	}

	pickcenter = (place) => {
		if (place) {
			console.log("NEW PLACE")
			return [place.latitude, place.longitude];
		}
		else {
			console.log("OLD PLACE")
			return CENTER;
		}
	}

	showMarker = (places) => {
		const { mapInstance, mapApi } = this.state
		if (!(mapApi && mapInstance)) return
		// clear marker
		markers.forEach(mark => {
			mark.setMap(null);
		})
		markers = [];
		places.forEach(async (place) => {
			markers.push(new mapApi.Marker({
				map: mapInstance,
				position: {
					lat: place.latitude,
					lng: place.longitude,
				},
			}));
		});
		markers.forEach((marker, i) => {
			marker.addListener('click', () => {
				this.state.mapInstance.setCenter(new mapApi.LatLng(this.props.place.places[i].latitude, this.props.place.places[i].longitude));
				this.state.mapInstance.setZoom(15);
				this.props.showPlace(i);
			});
		});
	}

	render() {
		const { mapApiLoaded, mapInstance, mapApi } = this.state;
		const { places } = this.props.place;
		return (
			<div style={{ width: "100%", height: "55%" }}>
				<GoogleMap
					defaultZoom={12}
					center={this.pickcenter(places[0])}
					bootstrapURLKeys={{
						key: process.env.REACT_APP_MAP_KEY,
						libraries: ['places', 'geometry'],
					}}
					yesIWantToUseGoogleMapApiInternals
					onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps, places)}
				>
					{this.showMarker(places)}
					{!isEmpty(places) &&
						this.state.mapApiLoaded &&
						places.map((place, idx) => (
							<MarkerInfo
								key={idx}
								idx={idx}
								lat={place.latitude}
								lng={place.longitude}
								show={place.show}
								place={place}
								mapApi={mapApi}
								mapInstance={mapInstance}
								onChangeGeo={this.handleGeo}
							/>
						))}
				</GoogleMap>
			</div>
		)
	}
}
const mapStateToProps = state => ({
	place: state.place,
});

export default connect(mapStateToProps, { loadMap, showPlace })(Map);
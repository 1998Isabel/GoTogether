import React, { Component } from 'react';
import isEmpty from 'lodash.isempty';
import { connect } from "react-redux";
import { loadMap, showPlace } from "../../actions/placeActions";
import { setUserFromLatlng } from "../../actions/peopleActions";
import GoogleMap from './GoogleMap';
import MarkerInfo from './MarkerInfo';


const CENTER = [25.021918, 121.535285];
var markers = [];
var usermarker = null;

class Map extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mapApiLoaded: false,
			mapInstance: null,
			mapApi: null,
		};
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.people.user !== this.props.people.user) {
			if (this.props.people.user.latlng && this.props.people.user.latlng[0] !== 0) {
				let latlng = new this.props.place.gmap.maps.LatLng(this.props.people.user.latlng[0], this.props.people.user.latlng[1]);
				this.handleUserMarker(latlng);
			}
		}
	}

	apiHasLoaded = (map, maps, places) => {
		this.props.loadMap({ map: map, maps: maps });
		this.setState({
			mapApiLoaded: true,
			mapInstance: map,
			mapApi: maps,
		});
		map.addListener('click', (e) => {
			this.props.setUserFromLatlng({
				...this.props.people.user,
				latlng: [e.latLng.lat(), e.latLng.lng()],
				mapApi: maps
			})
		});
	}

	handleUserMarker = (latlng) => {
		if (usermarker)
			usermarker.setMap(null);
		usermarker = new this.props.place.gmap.maps.Marker({
			position: latlng,
			map: this.props.place.gmap.map,
			draggable: true,
			label: "Me",
		});
		usermarker.addListener('dragend', (e) => {
			this.props.setUserFromLatlng({
				...this.props.people.user,
				latlng: [usermarker.getPosition().lat(), usermarker.getPosition().lng()],
				mapApi: this.props.place.gmap.maps
			})
		})
		this.props.place.gmap.map.panTo(latlng);
	}

	pickcenter = (place) => {
		if (place) {
			return place.latlng;
		}
		else {
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
		places.forEach((place,i) => {
			let marker = new mapApi.Marker({
				map: mapInstance,
				position: {
					lat: place.latitude,
					lng: place.longitude,
				},
			})
			marker.addListener('click', () => {
				this.state.mapInstance.setCenter(new mapApi.LatLng(this.props.place.places[i].latitude, this.props.place.places[i].longitude));
				this.state.mapInstance.setZoom(15);
				this.props.showPlace(i);
			});
			markers.push(marker);
		});
	}

	render() {
		const { mapApiLoaded, mapInstance, mapApi } = this.state;
		const { places } = this.props.place;
		return (
			<div style={{ width: "100%", height: "38vh" }}>
				<GoogleMap
					defaultZoom={12}
					center={this.pickcenter(this.props.people.user)}
					options={{scrollwheel: false}}
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
	people: state.people,
	place: state.place,
});

export default connect(mapStateToProps, { loadMap, showPlace, setUserFromLatlng })(Map);
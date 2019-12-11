import React, { Component } from 'react';
import isEmpty from 'lodash.isempty';
import GoogleMap from './GoogleMap';
import MarkerInfo from './MarkerInfo';
import { Button } from 'react-bootstrap';

const CENTER = [25.021918, 121.535285];
var markers = [];
const myplaces = [
	{
		id: "1",
		name: "台灣大學",
		lat: 25.0173402,
		lng: 121.530997,
		show: true,
	},
	{
		id: "2",
		name: "寶藏巖台北國際藝術村",
		lat: 25.010732,
		lng: 121.5234988,
		show: true,
	}
]

class Map extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mapApiLoaded: false,
			mapInstance: null,
			mapApi: null,
			places: myplaces,
		};
	}

	apiHasLoaded = (map, maps, places) => {
		this.setState({
			mapApiLoaded: true,
			mapInstance: map,
			mapApi: maps,
		});
	}

	pickcenter = (place) => {
		if (place) {
			console.log("NEW PLACE")
			return [place.lat, place.lng];
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
					lat: place.lat,
					lng: place.lng,
				},
			}));
		});
		markers.forEach((marker, i) => {
      marker.addListener('click', () => {
        this.setState((state) => {
          state.mapInstance.setCenter(new mapApi.LatLng(state.places[i].lat, state.places[i].lng));
          state.mapInstance.setZoom(15);
          state.places[i].show = !state.places[i].show; // eslint-disable-line no-param-reassign
          return { places: state.places };
        });
      });
    });
	}

	queryPlaces = () => {
		myplaces.forEach(place => {
			var request = {
				query: place.name,
				fields: ['name', 'formatted_address', 'geometry', 'icon', 'permanently_closed', 'photos', 'place_id', 'types'],
			};
			if (this.state.mapApiLoaded) {
				var service = new this.state.mapApi.places.PlacesService(this.state.mapInstance);
				service.findPlaceFromQuery(request, (results, status) => {
					if (status === this.state.mapApi.places.PlacesServiceStatus.OK) {
						for (var i = 0; i < results.length; i++) {
							console.log(results[i]);
							place = { ...place, ...results[i] }
						}
					}
				});
			}
		})
	}

	render() {
		const { places, mapApiLoaded, mapInstance, mapApi } = this.state;
		return (
			<div style={{ width: "100%", height: "92%" }}>
				<GoogleMap
					defaultZoom={16}
					defaultCenter={this.pickcenter(places[0])}
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
						places.map(place => (
							<MarkerInfo
								key={place.id}
								lat={place.lat}
								lng={place.lng}
								show={place.show}
								place={place}
								mapApi={mapApi}
								mapInstance={mapInstance}
							/>
						))}
				</GoogleMap>
			</div>
		)
	}
}

export default Map;
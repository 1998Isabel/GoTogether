import React, { Component } from 'react';
import { Card } from 'react-bootstrap';

class InfoWindow extends Component {
	constructor(props) {
		super(props);
	}

	clickDebug = () => {
		console.log(this.props.place)
	}

	render() {
		return (
			<Card style={{ width: '35vw' }} onClick={this.clickDebug}>
				<Card.Body>
					<Card.Title>{this.props.place.title}</Card.Title>
					{this.props.place.rating===0?null:(<Card.Subtitle className="mb-2 text-muted">
						<span style={{ color: 'grey' }}>
							{this.props.place.rating}{' '}
						</span>
						<span style={{ color: 'orange' }}>
							{String.fromCharCode(9733).repeat(Math.floor(this.props.place.rating))}
						</span>
						<span style={{ color: 'lightgrey' }}>
							{String.fromCharCode(9733).repeat(5 - Math.floor(this.props.place.rating))}
						</span>
					</Card.Subtitle>)}
					<Card.Text>
						{this.props.place.address}
						{this.props.place.photos&&<img src={this.props.place.photos[0].getUrl()} width="100%" style={{marginBottom: "10px"}} />}
						<br />
						{this.props.place.description}
    				</Card.Text>
				</Card.Body>
			</Card>
		)
	}
}

export default InfoWindow;
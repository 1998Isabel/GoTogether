import React, { Component } from 'react';
import { Card } from 'react-bootstrap';

class InfoWindow extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Card style={{ width: '18rem' }}>
				<Card.Body>
					<Card.Title>{this.props.place.name}</Card.Title>
					<Card.Subtitle className="mb-2 text-muted">
						<span style={{ color: 'grey' }}>
							{this.props.place.rating}{' '}
						</span>
						<span style={{ color: 'orange' }}>
							{String.fromCharCode(9733).repeat(Math.floor(this.props.place.rating))}
						</span>
						<span style={{ color: 'lightgrey' }}>
							{String.fromCharCode(9733).repeat(5 - Math.floor(this.props.place.rating))}
						</span>
					</Card.Subtitle>
					<Card.Text>
						{this.props.place.formatted_address}
    			</Card.Text>
					{/* <Card.Link href="#">Card Link</Card.Link>
					<Card.Link href="#">Another Link</Card.Link> */}
				</Card.Body>
			</Card>
		)
	}
}

export default InfoWindow;
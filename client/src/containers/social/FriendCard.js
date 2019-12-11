import React, { Component } from "react";
import { Card, Button } from 'react-bootstrap';

class FriendCard extends Component {

	render() {
		return (
			<Card style={{margin:"10px"}}>
				<Card.Header as="h5">{this.props.friend.name}</Card.Header>
				<Card.Body>
					<Card.Title>{this.props.friend.location}</Card.Title>
					<Card.Text>
						Hobbys: ...
          </Card.Text>
					<Button variant="primary">Go somewhere</Button>
				</Card.Body>
			</Card>
		);
	}
}

export default FriendCard;

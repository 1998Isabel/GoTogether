import React, { Component } from 'react';
import { connect } from "react-redux";
import { setUser, setUserLocation } from "../actions/peopleActions";
import { Navbar, Nav, NavDropdown, Modal, Button, Form, Col, Row } from 'react-bootstrap';
import taiwan from './../Taiwan.json';

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: true,
			name: "",
			city: null,
			area: null,
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (!prevProps.people.user) {
			console.log("UPDATE", this.props.people.user)
			if (this.props.people.user) {
				console.log(prevState)
				this.setState({
					city: this.props.people.user.location[0],
					area: this.props.people.user.location[1]
				})
			}
		}
		else if (prevProps.people.user.name !== this.props.people.user.name) {
			this.setState({
				city: this.props.people.user.location[0],
				area: this.props.people.user.location[1]
			})
		}
	}

	onShow = () => {
		this.setState(state => ({ show: !state.show }))
	}

	changeName = (e) => {
		this.setState({ name: e.target.value })
		console.log(this.state.name)
	}

	submitName = () => {
		console.log(this.state.name)
		this.props.setUser({ name: this.state.name, mapApi: this.props.place.gmap })
	}

	changeCity = (e) => {
		// let areaIdx = taiwan.find(c => c.CityName === this.state.city).AreaList.findIndex(a => a.AreaName === this.state.area)
		// console.log("AREA",areaIdx)
		// console.log(taiwan[e.target.value].AreaList[areaIdx].AreaName)
		this.setState({ city: taiwan[e.target.value].CityName, area: taiwan[e.target.value].AreaList[0].AreaName })
	}

	changeArea = (e) => {
		this.setState({ area: taiwan.find(c => c.CityName === this.state.city).AreaList[e.target.value].AreaName })
	}

	submitLocation = (e) => {
		this.props.setUserLocation({ ...this.props.people.user, location: [this.state.city, this.state.area], mapApi: this.props.place.gmap })
	}

	showInform = () => {
		if (!this.state.city) {
			return (
				<Form>
					<Form.Group as={Row} controlId="formPlaintextName">
						<Form.Label column sm="2">
							Name
    							</Form.Label>
						<Col sm="8">
							<Form.Control placeholder="Fill in your name." onChange={this.changeName} />
						</Col>
						<Col>
							<Button variant="outline-primary" onClick={this.submitName}>OK</Button>
						</Col>
					</Form.Group>
				</Form>
			)
		}
		else {
			console.log(this.state)
			const cityoptions = taiwan.map((c, idx) => (
				<option key={idx} value={idx}>
					{c.CityName}
				</option>
			))
			const areaoptions = taiwan.find(c => c.CityName === this.state.city).AreaList.map((a, idx) => (
				<option key={idx} value={idx}>
					{a.AreaName}
				</option>
			))
			return (
				<Form>
					<Form.Group as={Row} controlId="formPlaintextName">
						<Form.Label column sm="2">
							Name
    							</Form.Label>
						<Col sm="8">
							<Form.Control defaultValue={this.props.people.user.name} onChange={this.changeName} />
						</Col>
						<Col>
							<Button variant="outline-primary" onClick={this.submitName}>OK</Button>
						</Col>
					</Form.Group>
					<Form.Group as={Row} controlId="formPlaintextLocation">
						<Form.Label column xs="2">
							City/Area
    					</Form.Label>
						<Col>
							<Form.Control xs="4" as="select" value={taiwan.findIndex(c => c.CityName === this.state.city)} onChange={this.changeCity}>
								{cityoptions}
							</Form.Control>
						</Col>
						<Col>
							<Form.Control xs="4" as="select" value={taiwan.find(c => c.CityName === this.state.city).AreaList.findIndex(a => a.AreaName === this.state.area)} onChange={this.changeArea}>
								{areaoptions}
							</Form.Control>
						</Col>
						<Col>
							<Button variant="outline-primary" onClick={this.submitLocation}>OK</Button>
						</Col>
					</Form.Group>
					<Form.Group as={Row} controlId="formPlaintextLocation">
						<Form.Label column xs="2">
							Location
    					</Form.Label>
						<Col>
							<Form.Control readOnly value={this.props.people.user.latlng[0]} />
						</Col>
						<Col>
							<Form.Control readOnly value={this.props.people.user.latlng[1]}/>
						</Col>
					</Form.Group>
				</Form>
			)
		}
	}

	render() {
		return (
			<Navbar bg="dark" expand="lg" variant="dark" sticky="top">
				<Navbar.Brand href="#home">Go Together</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="mr-auto">
						{/* <Nav.Link href="#home">Home</Nav.Link>
						<Nav.Link href="#link">Link</Nav.Link>
						<NavDropdown title="Dropdown" id="basic-nav-dropdown">
							<NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
							<NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
							<NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
						</NavDropdown> */}
					</Nav>
					<span className="text-light" style={{ marginRight: "10px" }}>
						Hello {this.props.people.user ? (this.props.people.user.name) : null} !
					</span>
					<Button variant="primary" color="secondary" onClick={this.onShow}>Setting</Button>
				</Navbar.Collapse>
				<Modal
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					centered
					show={this.state.show}
				>
					<Modal.Header>
						<Modal.Title id="contained-modal-title-vcenter">
							User Setting
        				</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{this.showInform()}
						<Button onClick={this.onShow} style={{ float: "right" }}>Close</Button>
					</Modal.Body>
				</Modal>
			</Navbar>
		);
	}
}

const mapStateToProps = state => ({
	people: state.people,
	place: state.place
});

export default connect(mapStateToProps, { setUser, setUserLocation })(Header);

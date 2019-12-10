import React, { Component } from 'react';
import './../css/bootstrap.min.css';
import uuid from "uuid";
// import getWeb3 from "./../utils/getWeb3";
import { connect } from 'react-redux';
import { addPost } from '../actions/postActions';
import { getCategories } from '../actions/categoryActions';
import { Button, Modal, Form } from 'react-bootstrap';

class CreatePost extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
			title: "",
			content: "",
			category: "News",
			web3: null,
			fromAccount: null,
			toAccount: null,
		};
	}

	componentDidMount = async () => {
		this.props.getCategories();
		// try {
		// 	const web3 = await getWeb3();
		// 	const accounts = await web3.eth.getAccounts();
		// 	// const networkId = await web3.eth.net.getId();
		// 	// const deployedNetwork = TodoAppContract.networks[networkId];
		// 	// const instance = new web3.eth.Contract(
		// 	// 	TodoAppContract.abi,
		// 	// 	deployedNetwork && deployedNetwork.address,
		// 	// );
		// 	console.log(accounts);
		// 	const balance = await web3.eth.getBalance(accounts[0]);
		// 	console.log(balance);
		// 	this.setState({ web3, fromAccount: accounts[0], toAccount: "0x1ce421937a6F59bF58FaafE316D23AaED690DA18" });

		// } catch (error) {
		// 	alert(
		// 		`Failed to load web3, accounts. Check console for details.`,
		// 	);
		// 	console.error(error);
		// }
	}

	handleShow = () => this.setState({ show: true });
	handleClose = () => this.setState({ show: false });
	changeTitle = (event) => this.setState({ title: event.target.value });
	changeContent = (event) => this.setState({ content: event.target.value });
	changeCategory = (event) => this.setState({ category: event.target.value });
	handleSubmit = async () => {
		// var txnObject = {
		// 	"from": this.state.fromAccount,
		// 	"to": this.state.toAccount,
		// 	"value": 100,
		// 	// "gas": 21000,          // (optional)
		// 	// "gasPrice": 4500000,   // (optional)
		// 	// "data": 'For testing', // (optional)
		// 	// "nonce": 10            // (optional) 
		// };
		// await this.state.web3.eth.sendTransaction(txnObject);
		// const balance1 = await this.state.web3.eth.getBalance(this.state.fromAccount);
		// console.log(balance1);
		// const balance2 = await this.state.web3.eth.getBalance(this.state.toAccount);
		// console.log(balance2);
		this.props.addPost({
			id: uuid.v1(),
			category: this.state.category,
			title: this.state.title,
			content: this.state.content,
		});
		this.handleClose()
	}

	render() {
		const { show } = this.state;
		const categoryOption = this.props.category.categories.map(c => (<option>{c}</option>))

		return (
			<div>
				<h5>Create Post</h5>
				<form>
					<div className="form-group">
						<div className="input-group mb-3" onClick={this.handleShow}>
							<input type="text" className="form-control" placeholder="Say something..." aria-label="Recipient's username" aria-describedby="button-addon2" />
							<div className="input-group-append">
								<button className="btn btn-outline-secondary" type="button" id="button-addon2">Post</button>
							</div>
						</div>
						<Modal show={show} onHide={this.handleClose}>
							<Modal.Header closeButton>
								<Modal.Title>Create Post</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<Form>
									<Form.Group controlId="ControlInput1">
										<Form.Label>Title</Form.Label>
										<Form.Control type="text" onChange={this.changeTitle} />
									</Form.Group>
									<Form.Group controlId="ControlSelect1">
										<Form.Label>Select category</Form.Label>
										<Form.Control as="select" onChange={this.changeCategory}>
											{/* <option>1</option>
											<option>2</option>
											<option>3</option>
											<option>4</option>
											<option>5</option> */}
											{categoryOption}
										</Form.Control>
									</Form.Group>
									<Form.Group controlId="ControlTextarea1">
										<Form.Label>Content</Form.Label>
										<Form.Control as="textarea" rows="3" onChange={this.changeContent} />
									</Form.Group>
								</Form>
							</Modal.Body>
							<Modal.Footer>
								<Button variant="secondary" onClick={this.handleClose}>
									Cancel
          						</Button>
								<Button variant="primary" onClick={this.handleSubmit}>
									Submit
          						</Button>
							</Modal.Footer>
						</Modal>
					</div>
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	category: state.category
});

export default connect(mapStateToProps, { addPost, getCategories })(CreatePost);

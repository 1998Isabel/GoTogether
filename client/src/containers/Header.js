import React from 'react';
import "./../css/bootstrap.min.css"

function Header() {
	return (
		<div className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
			<a className="navbar-brand" href="#">真。論壇</a>
			<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
			</button>

			<div className="collapse navbar-collapse" id="navbarColor02">
				<ul className="navbar-nav mr-auto">
					<li className="nav-item active">
						<a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#">Features</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#">Pricing</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#">About</a>
					</li>
				</ul>
				<form className="form-inline my-2 my-lg-0" style={{margin: "5px"}}>
					<input className="form-control mr-sm-2" type="text" placeholder="Search" />
					{/* <button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</button> */}
				</form>
				{/* <button type="button" className="btn btn-outline-secondary" style={{ margin: "5px" }}>Login</button> */}
				<button type="button" className="btn btn-secondary" style={{ margin: "5px" }}>Account</button>
			</div>
		</div>

	);
}

export default Header;

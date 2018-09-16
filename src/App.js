import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PropTypes from "prop-types";
import './App.css';
import { FontsPage } from "./FontsPage";
import { FontImagesPage } from "./FontImagesPage";

export class App extends Component {
	render() {
		var name = "What's the font?";
		return (
			<div className="App">
				<div className="App-header">
					<h2>{ name }</h2>
				</div>
				<Router>
					<div className="app container">
						<Switch>
						<Route exact path="/images" component={FontImagesPage} />
						<Route exact path="/" component={FontsPage} />
						</Switch>
					</div>
				</Router>				
			</div>
		);
	}
}

export default App;

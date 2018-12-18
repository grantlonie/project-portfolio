import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { withAuthenticator } from 'aws-amplify-react'

import ListAccomplishments from './components/ListAccomplishments'
import EditAccomplishments from './components/EditAccomplishments'
import './App.css'

class App extends Component {
	render() {
		return (
			<Router>
				<div>
					<Route exact path="/" component={() => <ListAccomplishments />} />
					<Route path="/editAccomplishments" component={() => <EditAccomplishments />} />
				</div>
			</Router>
		)
	}
}

export default withAuthenticator(App)

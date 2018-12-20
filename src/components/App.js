import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Auth } from 'aws-amplify'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { withAuthenticator } from 'aws-amplify-react'
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	IconButton,
	Drawer,
	List,
	ListItem,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'

import ListAccomplishments from './ListAccomplishments'
import Accomplishments from './Accomplishments'
import EditAccomplishment from './EditAccomplishment'

import { getAllData } from '../js/apiInterface'

const drawerLinks = [
	{ link: '/', text: 'List Accomplishments' },
	{ link: '/accomplishments', text: 'Accomplishments' },
]

class App extends Component {
	constructor(props) {
		super(props)

		// Get user and accomplisment data and update redux
		getAllData().then(data => {
			this.props.updateAllData(data)
		})

		this.state = { showDrawer: false }
	}

	handleLogout() {
		Auth.signOut()
			.then(data => {
				window.location.reload(true)
			})
			.catch(err => console.log(err))
	}

	toggleDrawer() {
		this.setState({ showDrawer: !this.state.showDrawer })
	}

	render() {
		const { showDrawer } = this.state

		return (
			<Router>
				<div>
					<AppBar position="static">
						<Toolbar>
							<IconButton
								style={{ margin: '0 20px 0 -12px' }}
								color="inherit"
								aria-label="Menu"
								onClick={this.toggleDrawer.bind(this)}>
								<MenuIcon />
							</IconButton>

							<Typography style={{ flexGrow: 1 }} variant="h6" color="inherit">
								Project Porfolio
							</Typography>

							<Button color="inherit" onClick={this.handleLogout.bind(this)}>
								Logout
							</Button>
						</Toolbar>
					</AppBar>

					<Drawer open={showDrawer} onClose={this.toggleDrawer.bind(this)}>
						<div
							tabIndex={0}
							role="button"
							onClick={this.toggleDrawer.bind(this)}
							onKeyDown={this.toggleDrawer.bind(this)}>
							<List>
								{drawerLinks.map(page => (
									<Link key={page.text} to={page.link}>
										<ListItem button>{page.text}</ListItem>
									</Link>
								))}
							</List>
						</div>
					</Drawer>

					<Route exact path="/" component={ListAccomplishments} />

					<Route path="/accomplishments" component={Accomplishments} />

					<Route path="/editAccomplishment/:id" component={EditAccomplishment} />
				</div>
			</Router>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		updateAllData: data => {
			dispatch({ type: 'UPDATE_ALL_DATA', ...data })
		},
	}
}

export default withAuthenticator(
	connect(
		null,
		mapDispatchToProps
	)(App)
)

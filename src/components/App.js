import React, { Component } from 'react'
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
import EditAccomplishments from './EditAccomplishments'

const PAGES = [
	{ link: '/', text: 'List Accomplishments' },
	{ link: '/editAccomplishments', text: 'Edit Accomplishments' },
]

class App extends Component {
	state = { showDrawer: false }

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

					<Drawer open={this.state.showDrawer} onClose={this.toggleDrawer.bind(this)}>
						<div
							tabIndex={0}
							role="button"
							onClick={this.toggleDrawer.bind(this)}
							onKeyDown={this.toggleDrawer.bind(this)}>
							<List>
								{PAGES.map(page => (
									<Link key={page.text} to={page.link}>
										<ListItem button>{page.text}</ListItem>
									</Link>
								))}
							</List>
						</div>
					</Drawer>

					<Route exact path="/" component={() => <ListAccomplishments />} />
					<Route path="/editAccomplishments" component={() => <EditAccomplishments />} />
				</div>
			</Router>
		)
	}
}

export default withAuthenticator(App)

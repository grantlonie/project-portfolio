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

import ListProjects from './ListProjects'
import Projects from './Projects'
import EditProject from './EditProject'
import EditSkills from './EditSkills'
import Spinner from './Spinner'

import { getAllData } from '../js/apiInterface'

const drawerLinks = [
	{ link: '/', text: 'List Projects' },
	{ link: '/projects', text: 'Projects' },
	{ link: '/skills', text: 'Edit Skills' },
]

class App extends Component {
	constructor(props) {
		super(props)

		this.bodyStyle = {
			margin: 'auto',
			maxWidth: '1000px',
			padding: '20px',
		}

		// Get user and project data and update redux
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
								{drawerLinks.map(page => (
									<Link key={page.text} to={page.link}>
										<ListItem button>{page.text}</ListItem>
									</Link>
								))}
							</List>
						</div>
					</Drawer>

					<div style={this.bodyStyle}>
						<Route exact path="/" component={ListProjects} />
						<Route path="/projects" component={Projects} />
						<Route path="/editProject/:id" component={EditProject} />
						<Route path="/skills" component={EditSkills} />
					</div>

					<Spinner />
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

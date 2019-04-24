import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Auth } from 'aws-amplify'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { withAuthenticator } from 'aws-amplify-react'
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'

import Sunburst from './Sunburst'
import ListProjects from './ListProjects'
import Projects from './Projects'
import EditProject from './EditProject'
import EditSkills from './EditSkills'
import EditTools from './EditTools'
import Spinner from './Spinner'

import '../styles/body.css'

import { getAllData } from '../js/apiInterface'

const drawerLinks = [
	{ link: '/', text: 'Sunburst' },
	{ link: '/listProjects', text: 'List Projects' },
	{ link: '/projects', text: 'Projects' },
	{ link: '/skills', text: 'Edit Skills' },
	{ link: '/tools', text: 'Edit Tools' },
]

interface Props {
	updateAllData: (data: any) => null
}

const bodyStyle: React.CSSProperties = {
	margin: 'auto',
	maxWidth: '1000px',
	padding: '20px',
}

const App = (props: Props) => {
	const { updateAllData } = props

	useEffect(() => {
		// Get user and project data and update redux
		getAllData().then(data => {
			updateAllData(data)
		})
	}, [])

	const [showDrawer, setShowDrawer] = useState(false)

	function handleLogout() {
		Auth.signOut()
			.then(data => {
				window.location.reload(true)
			})
			.catch(err => console.log(err))
	}

	return (
		<Router>
			<div>
				<AppBar position="static">
					<Toolbar>
						<IconButton
							style={{ margin: '0 20px 0 -12px' }}
							color="inherit"
							aria-label="Menu"
							onClick={() => setShowDrawer(true)}
						>
							<MenuIcon />
						</IconButton>

						<Typography style={{ flexGrow: 1 }} variant="h6" color="inherit">
							Project Porfolio
						</Typography>

						<Button color="inherit" onClick={() => handleLogout()}>
							Logout
						</Button>
					</Toolbar>
				</AppBar>

				<Drawer open={showDrawer} onClose={() => setShowDrawer(false)}>
					<div tabIndex={0} role="button" onClick={() => setShowDrawer(false)} onKeyDown={() => setShowDrawer(false)}>
						<List>
							{drawerLinks.map(page => (
								<Link key={page.text} to={page.link}>
									<ListItem button>{page.text}</ListItem>
								</Link>
							))}
						</List>
					</div>
				</Drawer>

				<Route exact path="/" component={Sunburst} />

				<div style={bodyStyle}>
					<Route path="/listProjects" component={ListProjects} />
					<Route path="/projects" component={Projects} />
					<Route path="/editProject/:id/:isNew?" component={EditProject} />
					<Route path="/skills" component={EditSkills} />
					<Route path="/tools" component={EditTools} />
				</div>

				<Spinner />
			</div>
		</Router>
	)
}

const mapDispatchToProps = dispatch => {
	return {
		updateAllData: data => {
			dispatch({ type: 'UPDATE_ALL_DATA', ...data })
		},
	}
}

const connectedApp = connect(
	null,
	mapDispatchToProps
)(App)

export default (process.env.REACT_APP_USE_LOCAL_DATA ? connectedApp : withAuthenticator(connectedApp))

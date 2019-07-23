import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Auth } from 'aws-amplify'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import { withAuthenticator } from 'aws-amplify-react'
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'

import routes from '../js/routes'
import Spinner from './Spinner'

import '../styles/body.css'

import { getAllData } from '../js/apiStartupMethods'

interface Props {
	updateAllData: (data: any) => null
}

const App = (props: Props) => {
	const { updateAllData } = props

	useEffect(() => {
		// Get user and project data and update redux
		getAllData().then(data => {
			updateAllData(data)
		})
	}, [updateAllData])

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
							{Object.values(routes).map(({ drawerText, path }) => {
								if (!drawerText) return null

								return (
									<Link key={path} to={path}>
										<ListItem button>{drawerText}</ListItem>
									</Link>
								)
							})}
						</List>
					</div>
				</Drawer>

				<Switch>
					{Object.values(routes).map(({ path, component, addBodyWrapper }) => (
						<Route key={path} exact path={path} component={addBodyWrapper ? withBodyWrapper(component) : component} />
					))}
				</Switch>

				<Spinner />
			</div>
		</Router>
	)
}

const withBodyWrapper = Component => () => (
	<div style={{ margin: 'auto', maxWidth: '1000px', padding: '20px' }}>
		<Component />
	</div>
)

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

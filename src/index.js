import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Amplify from '@aws-amplify/core'
import '@aws-amplify/auth'

import './index.css'
import store from './js/store'
import App from './components/App'
import * as serviceWorker from './serviceWorker'
import aws_exports from './aws-exports'

const { NODE_ENV, REACT_APP_USE_WHY_DID_YOU_UPDATE } = process.env

if (NODE_ENV !== 'production' && REACT_APP_USE_WHY_DID_YOU_UPDATE) {
	const { whyDidYouUpdate } = require('why-did-you-update')
	whyDidYouUpdate(React)
}

// in this way you are only importing Auth and configuring it.
Amplify.configure(aws_exports)

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
)

serviceWorker.unregister()

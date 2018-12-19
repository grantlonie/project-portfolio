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

// in this way you are only importing Auth and configuring it.
Amplify.configure(aws_exports)

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
)

serviceWorker.unregister()

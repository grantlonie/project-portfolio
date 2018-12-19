import React from 'react'
import ReactDOM from 'react-dom'
import Amplify from '@aws-amplify/core'
import '@aws-amplify/auth'

import './index.css'
import App from './components/App'
import * as serviceWorker from './serviceWorker'
import aws_exports from './aws-exports'

// in this way you are only importing Auth and configuring it.
Amplify.configure(aws_exports)

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()

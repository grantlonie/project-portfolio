import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import reducers from './reducers'

const enhancers = []
if (process.env.NODE_ENV === 'development') {
	const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__
	if (typeof devToolsExtension === 'function') enhancers.push(devToolsExtension())
}

const composedEnhancers = compose(
	applyMiddleware(thunk),
	...enhancers
)

const store = createStore(reducers, composedEnhancers)

export default store

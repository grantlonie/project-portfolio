import API, { graphqlOperation } from '@aws-amplify/api'
import { createProject } from '../graphql/mutations'

import store from './store'

export async function addProject() {
	const { userId } = store.getState()

	store.dispatch({ type: 'SHOW_SPINNER', show: true })

	const date = new Date()
	const year = date.getFullYear()
	let month = ('0' + (date.getMonth() + 1)).slice(-2)
	let day = ('0' + date.getDate()).slice(-2)

	const emptyProject = { userId, date: `${year}-${month}-${day}` }

	const data = await API.graphql(graphqlOperation(createProject, { input: { ...emptyProject } }))

	store.dispatch({ type: 'SHOW_SPINNER', show: false })
	store.dispatch({ type: 'ADD_PROJECT', project: data['data']['createProject'] })

	return data['data']['createProject'].id
}

import API, { graphqlOperation } from '@aws-amplify/api'
import { Auth } from 'aws-amplify'

import { listProjects, listCategorys, listSkills, listTools } from '../graphql/queries'

function getUserId() {
	return Auth.currentUserInfo().then(data => data.id)
}

export function getCategories(userId) {
	return API.graphql(
		graphqlOperation(listCategorys, {
			filter: { userId: { eq: userId } },
		})
	).then(data => data.data.listCategorys.items)
}

function getSkills(userId) {
	return API.graphql(
		graphqlOperation(listSkills, {
			filter: { userId: { eq: userId } },
		})
	).then(data => data.data.listSkills.items)
}

export function getTools(userId) {
	return API.graphql(
		graphqlOperation(listTools, {
			filter: { userId: { eq: userId } },
		})
	).then(data => data.data.listTools.items)
}

function getProjects(userId) {
	return API.graphql(
		graphqlOperation(listProjects, {
			filter: { userId: { eq: userId } },
		})
	).then(data => data.data.listProjects.items)
}

export async function getAllData() {
	const userId = await getUserId()
	const projects = await getProjects(userId)
	const allSkills = await getSkills(userId)

	return { userId, projects, allSkills }
}

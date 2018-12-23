import API, { graphqlOperation } from '@aws-amplify/api'
import { Auth } from 'aws-amplify'

import { listAccomplishments, listCategorys, listSkills, listTools } from '../graphql/queries'

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

function getAccomplishments(userId) {
	return API.graphql(
		graphqlOperation(listAccomplishments, {
			filter: { userId: { eq: userId } },
		})
	).then(data => data.data.listAccomplishments.items)
}

export async function getAllData() {
	const userId = await getUserId()
	const accomplishments = await getAccomplishments(userId)
	const allSkills = await getSkills(userId)

	return { userId, accomplishments, allSkills }
}

export const generalCategoryId = '24d5c4be-4753-4e25-8ffe-ad8d899c4a6c'

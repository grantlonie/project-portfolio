import API, { graphqlOperation } from '@aws-amplify/api'
import { Auth } from 'aws-amplify'

import { listAccomplishments, listAccomplishmentCategorys, listCategorys } from '../graphql/queries'

function getUserId() {
	return Auth.currentUserInfo().then(data => data.id)
}

async function getAccomplishmentCategories(userId) {
	const { data } = await API.graphql(
		graphqlOperation(listAccomplishmentCategorys, {
			filter: { userId: { eq: userId } },
		})
	)
	return data.listAccomplishmentCategorys.items
}

async function getCategories(userId) {
	const { data } = await API.graphql(
		graphqlOperation(listCategorys, {
			filter: { userId: { eq: userId } },
		})
	)
	return data.listCategorys.items
}

async function getAccomplishments(userId) {
	const { data } = await API.graphql(
		graphqlOperation(listAccomplishments, {
			filter: { userId: { eq: userId } },
		})
	)

	return data.listAccomplishments.items
}

export async function getAllData() {
	const userId = await getUserId()
	const accomplishmentCategories = await getAccomplishmentCategories(userId)
	const categories = await getCategories(userId)
	const accomplishments = await getAccomplishments(userId)

	return { userId, accomplishments, accomplishmentCategories, categories }
}

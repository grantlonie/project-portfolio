import API, { graphqlOperation } from '@aws-amplify/api'
import { Auth } from 'aws-amplify'

import { listAccomplishments } from '../graphql/queries'

function getUserId() {
	return Auth.currentUserInfo().then(data => data.id)
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
	const accomplishments = await getAccomplishments(userId)

	return { userId, accomplishments }
}

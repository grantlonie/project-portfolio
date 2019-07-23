import API, { graphqlOperation } from '@aws-amplify/api'

/**
 * read a record in the AWS database using graphql
 * @param query graphql query string
 * @param input input object for query string
 */
export function read(query, input) {
	return API.graphql(graphqlOperation(query, input)) as Promise<any>
}

/**
 * update - delete or modify, a record in the AWS database using graphql
 * @param query graphql query string
 * @param input input object for query string
 */
export function update(query, input) {
	return API.graphql(graphqlOperation(query, { input })) as Promise<any>
}

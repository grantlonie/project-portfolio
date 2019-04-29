import API, { graphqlOperation } from '@aws-amplify/api'
import { Auth } from 'aws-amplify'

import { listProjects, listCategorys, listSkills, listTools, listProjectSkills, getUser } from '../graphql/queries'
import { updateProjectSkill, deleteProjectSkill, updateUser } from '../graphql/mutations'

function getUserId() {
	const { NODE_ENV, REACT_APP_TEST_USER } = process.env

	if (NODE_ENV === 'development' && REACT_APP_TEST_USER) return REACT_APP_TEST_USER

	return Auth.currentUserInfo().then(data => data.id)
}

function endpoint(query, userId) {
	return API.graphql(
		graphqlOperation(query, {
			filter: { userId: { eq: userId } },
			limit: 1000,
		})
	) as Promise<any>
}

/**
 * update - delete or modify, a record in the AWS database using graphql
 * @param query graphql query string
 * @param input input object for query string
 */
export function update(query, input) {
	return API.graphql(graphqlOperation(query, { input })) as Promise<any>
}

const getCategories = userId => endpoint(listCategorys, userId).then(data => data.data.listCategorys.items)

const getSkills = userId => endpoint(listSkills, userId).then(data => data.data.listSkills.items)

const getTools = userId => endpoint(listTools, userId).then(data => data.data.listTools.items)

const getProjects = userId => endpoint(listProjects, userId).then(data => data.data.listProjects.items)

const getProjectSkills = userId => endpoint(listProjectSkills, userId).then(data => data.data.listProjectSkills.items)

const getUserData = id => (API.graphql(graphqlOperation(getUser, { id })) as Promise<any>).then(data => data.data.getUser)

// This method checks to see if dirty tables exist and cleans them
async function cleanupDirtyTables(userId, allSkills, allTools) {
	const userData = await getUserData(userId)

	if (userData.dirtyTables) {
		const projectSkills = await getProjectSkills(userId)

		// Go through all ProjectSkills
		for (const projectSkill of projectSkills) {
			const { id, toolIds } = projectSkill

			// Remove any ProjectSkill that has a skillId that is not in Skills
			if (allSkills.findIndex(skill => skill.id === projectSkill.skillId) === -1) {
				await API.graphql(graphqlOperation(deleteProjectSkill, { input: { id } }))
			}

			// Remove any ProjectSkill tool that no longer exist in Tools
			else if (Array.isArray(toolIds)) {
				for (const toolId of toolIds) {
					if (allTools.findIndex(tool => tool.id === toolId) === -1) {
						const newToolIds = toolIds.filter(i => i !== toolId)

						await API.graphql(
							graphqlOperation(updateProjectSkill, {
								input: { id, toolIds: newToolIds },
							})
						)
					}
				}
			}
		}

		// No more dirty tables!
		await API.graphql(
			graphqlOperation(updateUser, {
				input: { id: userId, dirtyTables: false },
			})
		)

		console.log('Dirty tables cleaned')
	}
}

export async function getAllData() {
	// If working with local data
	if (process.env.REACT_APP_USE_LOCAL_DATA) {
		return fetch('/assets/sample-data.json').then(res => res.json())
	}

	const userId = await getUserId()
	const allSkills = await getSkills(userId)
	const allTools = await getTools(userId)

	await cleanupDirtyTables(userId, allSkills, allTools)

	const projects = await getProjects(userId)
	const allCategories = await getCategories(userId)

	return { userId, projects, allSkills, allTools, allCategories }
}

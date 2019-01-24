import API, { graphqlOperation } from '@aws-amplify/api'
import { Auth } from 'aws-amplify'

import {
	listProjects,
	listCategorys,
	listSkills,
	listTools,
	listProjectSkills,
	getUser,
} from '../graphql/queries'
import {
	updateProjectSkill,
	deleteProjectSkill,
	updateUser,
	deleteTool,
} from '../graphql/mutations'

function getUserId() {
	const { NODE_ENV, REACT_APP_TEST_USER } = process.env

	if (NODE_ENV === 'development' && REACT_APP_TEST_USER) return REACT_APP_TEST_USER

	return Auth.currentUserInfo().then(data => data.id)
}

function getCategories(userId) {
	return API.graphql(
		graphqlOperation(listCategorys, {
			filter: { userId: { eq: userId } },
			limit: 1000,
		})
	).then(data => data.data.listCategorys.items)
}

function getSkills(userId) {
	return API.graphql(
		graphqlOperation(listSkills, {
			filter: { userId: { eq: userId } },
			limit: 1000,
		})
	).then(data => data.data.listSkills.items)
}

export function getTools(userId) {
	return API.graphql(
		graphqlOperation(listTools, {
			filter: { userId: { eq: userId } },
			limit: 1000,
		})
	).then(data => data.data.listTools.items)
}

function getProjects(userId) {
	return API.graphql(
		graphqlOperation(listProjects, {
			filter: { userId: { eq: userId } },
			limit: 1000,
		})
	).then(data => data.data.listProjects.items)
}

function getProjectSkills(userId) {
	return API.graphql(
		graphqlOperation(listProjectSkills, {
			filter: { userId: { eq: userId } },
			limit: 1000,
		})
	).then(data => data.data.listProjectSkills.items)
}

function getUserData(id) {
	return API.graphql(graphqlOperation(getUser, { id })).then(data => data.data.getUser)
}

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

		// Delete any tool where parent skill no longer exists
		for (const tool of allTools) {
			if (!tool.skill) {
				await API.graphql(graphqlOperation(deleteTool, { input: { id: tool.id } }))
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
	const userId = await getUserId()
	const allSkills = await getSkills(userId)
	console.log('allSkills: ', allSkills)
	const allTools = await getTools(userId)

	await cleanupDirtyTables(userId, allSkills, allTools)

	const projects = await getProjects(userId)
	const allCategories = await getCategories(userId)

	return { userId, projects, allSkills, allTools, allCategories }
}

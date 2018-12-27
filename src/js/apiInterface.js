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
import { updateProjectSkill, updateUser } from '../graphql/mutations'

function getUserId() {
	return Auth.currentUserInfo().then(data => data.id)
}

function getCategories(userId) {
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

function getProjectSkills(userId) {
	return API.graphql(
		graphqlOperation(listProjectSkills, {
			filter: { userId: { eq: userId } },
		})
	).then(data => data.data.listProjectSkills.items)
}

function getUserData(id) {
	return API.graphql(graphqlOperation(getUser, { id })).then(data => data.data.getUser)
}

// This method checks to see if dirty tables exist and cleans them
async function cleanupDirtyTables(userId) {
	const userData = await getUserData(userId)

	if (userData.dirtyTables) {
		const projectSkills = await getProjectSkills(userId)
		const tools = await getTools(userId)

		// Go through all ProjectSkills and remove all tool that no longer exists
		projectSkills.forEach(projectSkill => {
			const { id, toolIds } = projectSkill

			if (Array.isArray(toolIds)) {
				toolIds.forEach(toolId => {
					if (tools.findIndex(tool => tool.id === toolId) === -1) {
						const newToolIds = toolIds.filter(i => i !== toolId)

						API.graphql(
							graphqlOperation(updateProjectSkill, {
								input: { id, toolIds: newToolIds },
							})
						).then(() => {
							API.graphql(
								graphqlOperation(updateUser, {
									input: { id: userId, dirtyTables: false },
								})
							)
						})
					}
				})
			}
		})
	}
}

export async function getAllData() {
	const userId = await getUserId()
	const projects = await getProjects(userId)
	const allSkills = await getSkills(userId)
	const allCategories = await getCategories(userId)

	cleanupDirtyTables(userId)

	return { userId, projects, allSkills, allCategories }
}

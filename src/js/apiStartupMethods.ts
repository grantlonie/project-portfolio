import { Auth } from 'aws-amplify'

import { listProjects, listCategorys, listSkills, listTools, listProjectSkills, getUser } from '../graphql/queries'
import { updateProjectSkill, deleteProjectSkill, updateUser } from '../graphql/mutations'
import { read, update } from './apiInterface'

let userId

function getUserId() {
	const { NODE_ENV, REACT_APP_TEST_USER } = process.env

	if (NODE_ENV === 'development' && REACT_APP_TEST_USER) return REACT_APP_TEST_USER

	return Auth.currentUserInfo().then(data => data.id)
}

function endpoint(query) {
	return read(query, {
		filter: { userId: { eq: userId } },
		limit: 1000,
	})
}

const getCategories = () => endpoint(listCategorys).then(res => res.data.listCategorys.items)

const getSkills = () => endpoint(listSkills).then(res => res.data.listSkills.items)

const getTools = () => endpoint(listTools).then(res => res.data.listTools.items)

const getProjects = () => endpoint(listProjects).then(res => res.data.listProjects.items)

const getProjectSkills = () => endpoint(listProjectSkills).then(res => res.data.listProjectSkills.items)

const getUserData = id => read(getUser, { id }).then(res => res.data.getUser)

// This method checks to see if dirty tables exist and cleans them
async function cleanupDirtyTables(userId, allSkills, allTools) {
	const userData = await getUserData(userId)

	if (userData.dirtyTables) {
		const projectSkills = await getProjectSkills()

		// Go through all ProjectSkills
		for (const projectSkill of projectSkills) {
			const { id, toolIds } = projectSkill

			// Remove any ProjectSkill that has a skillId that is not in Skills
			if (allSkills.findIndex(skill => skill.id === projectSkill.skillId) === -1) {
				await update(deleteProjectSkill, { id })
			}

			// Remove any ProjectSkill tool that no longer exist in Tools
			else if (Array.isArray(toolIds)) {
				for (const toolId of toolIds) {
					if (allTools.findIndex(tool => tool.id === toolId) === -1) {
						const newToolIds = toolIds.filter(i => i !== toolId)

						await update(updateProjectSkill, { id, toolIds: newToolIds })
					}
				}
			}
		}

		// No more dirty tables!
		await update(updateUser, { id: userId, dirtyTables: false })

		console.log('Dirty tables cleaned')
	}
}

/**
 * helper method to update an old user id to a new one
 * @param oldId old user id to update
 * @param newId new user id
 */
function renameUserId(oldId: string, newId: string) {
	getCategories().then(categories => {})
}

/**
 * Get all project portfolio data for specified user
 * @param cdnUser optional. user specified with sunburst cdn
 */
export async function getAllData(cdnUser?: string) {
	// If working with local data
	if (process.env.REACT_APP_USE_LOCAL_DATA) {
		return fetch('/assets/sample-data.json').then(res => res.json())
	}

	userId = cdnUser || (await getUserId())
	console.log('userId: ', userId)
	const allSkills = await getSkills()
	const allTools = await getTools()

	await cleanupDirtyTables(userId, allSkills, allTools)

	const projects = await getProjects()
	const allCategories = await getCategories()

	return { userId, projects, allSkills, allTools, allCategories }
}

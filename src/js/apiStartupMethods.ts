import { Auth } from 'aws-amplify'

import { listProjects, listCategorys, listSkills, listTools, listProjectSkills, getUser } from '../graphql/queries'
import {
	createUser,
	updateProjectSkill,
	deleteProjectSkill,
	updateUser,
	updateCategory,
	updateProject,
	updateSkill,
	updateTool,
	deleteUser,
} from '../graphql/mutations'
import { read, update } from './apiInterface'
import { getSampleData } from './sampleData'

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

const getUserData = () => read(getUser, { id: userId }).then(res => res.data.getUser)

// This method checks to see if dirty tables exist and cleans them
async function cleanupDirtyTables(userId, allSkills, allTools) {
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

/**
 * helper method to update an old user id to a new one
 * @param oldId old user id to update
 * @param newId new user id
 */
function renameUserId(oldId: string, newId: string) {
	userId = oldId

	update(createUser, { id: newId })

	getCategories().then(items => {
		items.forEach(({ id }) => {
			update(updateCategory, { id, userId: newId })
		})
	})
	getSkills().then(items => {
		items.forEach(({ id }) => {
			update(updateSkill, { id, userId: newId })
		})
	})
	getTools().then(items => {
		items.forEach(({ id }) => {
			update(updateTool, { id, userId: newId })
		})
	})
	getProjects().then(items => {
		items.forEach(({ id }) => {
			update(updateProject, { id, userId: newId })
		})
	})
	getProjectSkills().then(items => {
		items.forEach(({ id }) => {
			update(updateProjectSkill, { id, userId: newId })
		})
	})

	update(deleteUser, { id: oldId })

	console.log('done updating user ids')
}

/**
 * Get all project portfolio data for specified user
 */
export async function getAllData() {
	// If working with local data
	if (process.env.REACT_APP_USE_LOCAL_DATA) {
		return { user: { id: 'local' }, ...getSampleData() }
	}

	userId = await getUserId()

	const allSkills = await getSkills()
	const allTools = await getTools()

	const user = (await getUserData()) || (await update(createUser, { id: userId }))
	if (user.dirtyTables) await cleanupDirtyTables(userId, allSkills, allTools)

	const projects = await getProjects()
	const allCategories = await getCategories()

	return { user, projects, allSkills, allTools, allCategories }
}

/**
 * Get all project portfolio data for specified user
 * @param cdnUser user specified with sunburst cdn
 */
export async function getSunburstDataWithApi(cdnUser: string) {
	userId = cdnUser
	let user = null
	try {
		user = await getUserData()
	} catch (err) {
		throw new Error(err.errors) // wrong API or AWS issue
	}

	if (!user) throw new Error('Incorrect user id')

	const allSkills = await getSkills()
	const projects = await getProjects()
	const allCategories = await getCategories()

	return { projects, allSkills, allCategories }
}

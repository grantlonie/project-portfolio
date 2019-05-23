import uniq from 'lodash/uniq'

import {
	updateUser,
	createTool,
	updateTool,
	deleteTool,
	createCategory,
	updateCategory,
	deleteCategory,
	createProjectSkill,
	updateProjectSkill,
	deleteProjectSkill,
	createProject,
	updateProject,
	deleteProject,
	createSkill,
	updateSkill,
	deleteSkill,
} from '../graphql/mutations'
import { update } from './apiInterface'
import { ToolItem, ProjectSkillItem, CategoryItem, SkillItem } from '../types'
import { State } from './reducers'
import { SkillToUpdate } from '../components/EditSkills'
import { CategoryToUpdate } from '../components/EditSkills/CategoriesModal'
import { ToolToUpdate } from '../components/EditTools'

type GetState = () => State

const showSpinner = (show: boolean) => ({ type: 'SHOW_SPINNER', show })

/**
 * TOOL ACTIONS
 */

const addToolToStore = (tool: ToolItem) => ({ type: 'ADD_TOOL', tool })
const updateToolInStore = (tool: ToolItem) => ({ type: 'UPDATE_TOOL', tool })
const deleteToolFromStore = (toolId: ToolItem['id']) => ({ type: 'REMOVE_TOOL', toolId })

export const addTool = (name: string) => (dispatch, getState) => {
	dispatch(showSpinner(true))
	const userId = getState().userId

	update(createTool, { name, userId }).then(({ data: { createTool } }) => {
		dispatch(addToolToStore(createTool))
		dispatch(showSpinner(false))
	})
}

export const updateTools = (tools: ToolToUpdate[]) => dispatch => {
	tools.forEach(tool => {
		if (tool.isUpdated) {
			delete tool.isUpdated
			update(updateTool, tool).then(({ data: { updateTool } }) => {
				dispatch(updateToolInStore(updateTool))
			})
		}
	})
}

export const removeTool = id => (dispatch, getState: GetState) => {
	update(deleteTool, { id }).then(({ data: { deleteTool } }) => {
		dispatch(deleteToolFromStore(deleteTool.id))
		update(updateUser, { id: getState().userId, dirtyTables: true })
	})
}

/**
 * Merge a tool with another existing tool
 * @param fromId tool id to remove
 * @param toId tool id to merge the removed tool with
 */
export const mergeTool = (fromId: string, toId: string) => async (dispatch, getState: GetState) => {
	dispatch(showSpinner(true))

	const { projects } = getState()

	// Find and merge old with new tool in each project
	for (const project of projects) {
		for (const projectSkill of project.skills.items) {
			let { toolIds } = projectSkill
			if (!toolIds) continue

			for (let i = 0; i < toolIds.length; i++) {
				if (toolIds[i] === fromId) {
					// Change tool id to match merge and remove duplicates
					toolIds[i] = toId
					toolIds = uniq(toolIds)

					const data = await update(updateProjectSkill, { id: projectSkill.id, toolIds })

					dispatch(updateProjectSkillInStore(data['data']['updateProjectSkill']))
				}
			}
		}
	}

	dispatch(removeTool(fromId))
	dispatch(showSpinner(false))
}

/**
 * PROJECT SKILL ACTIONS
 */

const updateProjectSkillInStore = (projectSkill: ProjectSkillItem) => ({ type: 'UPDATE_PROJECT_SKILL', projectSkill })

/**
 * CATEGORY ACTIONS
 */

const addCategoryToStore = (category: CategoryItem) => ({ type: 'ADD_CATEGORY', category })
const updateCategoryInStore = (category: CategoryItem) => ({ type: 'UPDATE_CATEGORY', category })
const removeCategoryFromStore = (categoryId: CategoryItem['id']) => ({ type: 'REMOVE_CATEGORY', categoryId })

export const addCategory = (name: string) => (dispatch, getState) => {
	dispatch(showSpinner(true))
	const userId = getState().userId

	update(createCategory, { name, userId }).then(({ data: { createCategory } }) => {
		dispatch(addCategoryToStore(createCategory))
		dispatch(showSpinner(false))
	})
}

export const updateCategories = (categories: CategoryToUpdate[]) => dispatch => {
	categories.forEach(category => {
		const { isUpdated, id, name } = category
		if (isUpdated) {
			update(updateCategory, { id, name }).then(({ data: { updateCategory } }) => {
				dispatch(updateCategoryInStore(updateCategory))
			})
		}
	})
}

export const removeCategory = id => (dispatch, getState: GetState) => {
	update(deleteCategory, { id }).then(({ data: { deleteCategory } }) => {
		dispatch(removeCategoryFromStore(deleteCategory.id))
		update(updateUser, { id: getState().userId, dirtyTables: true })
	})
}

/**
 * SKILL ACTIONS
 */

const addSkillToStore = (skill: SkillItem) => ({ type: 'ADD_SKILL', skill })
const updateSkillInStore = (skill: SkillItem) => ({ type: 'UPDATE_SKILL', skill })
const removeSkillFromStore = (skillId: SkillItem['id']) => ({ type: 'REMOVE_SKILL', skillId })
const addSkillToProject = (skill: SkillItem) => ({ type: 'ADD_SKILL_TO_PROJECT', skill })
const removeSkillFromProject = (skill: SkillItem) => ({ type: 'REMOVE_SKILL_FROM_PROJECT', skill })

export const addSkill = (name: string) => (dispatch, getState) => {
	dispatch(showSpinner(true))
	const userId = getState().userId

	update(createSkill, { name, userId }).then(({ data: { createSkill } }) => {
		dispatch(addSkillToStore(createSkill))
		dispatch(showSpinner(false))
	})
}

export const updateSkills = (skills: SkillToUpdate[], nullCategoryId: string) => dispatch => {
	skills.forEach(skill => {
		const { id, name, skillCategoryId, isUpdated } = skill

		if (isUpdated) {
			const input: any = { id, name }

			if (skillCategoryId) {
				input.skillCategoryId = skillCategoryId === nullCategoryId ? null : skillCategoryId
			}

			update(updateSkill, input).then(({ data: { updateSkill } }) => {
				dispatch(updateSkillInStore(updateSkill))
			})
		}
	})
}

export const removeSkill = id => (dispatch, getState: GetState) => {
	update(deleteSkill, { id }).then(({ data: { deleteSkill } }) => {
		dispatch(removeSkillFromStore(deleteSkill.id))
		update(updateUser, { id: getState().userId, dirtyTables: true })
	})
}

/**
 * Merge a skill with another existing skill
 * @param fromId skill id to remove
 * @param toId skill id to merge the removed skill with
 */
export const mergeSkill = (fromId: string, toId: string) => async (dispatch, getState: GetState) => {
	dispatch(showSpinner(true))

	const { projects } = getState()

	// Find and merge old with new skill in each project
	for (const project of projects) {
		for (const projectSkill of project.skills.items) {
			if (projectSkill.skillId === fromId) {
				const data = await update(updateProjectSkill, { id: projectSkill.id, skillId: toId })
				const skill = data['data']['updateProjectSkill']

				dispatch(addSkillToProject(skill))
				dispatch(removeSkillFromProject(skill))
			}
		}
	}

	dispatch(removeSkill(fromId))
	dispatch(showSpinner(false))
}

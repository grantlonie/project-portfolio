import uniq from 'lodash/uniq'

import { updateUser, createTool, updateTool, deleteTool, updateProjectSkill } from '../graphql/mutations'
import { update } from './apiInterface'
import { ToolItem, ProjectSkillItem } from '../types'
import { State } from './reducers'

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

export const updateTools = tools => dispatch => {
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

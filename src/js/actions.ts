import { createTool, updateTool } from '../graphql/mutations'
import { update } from './apiInterface'
import { ToolItem } from '../types'

const showSpinner = (show: boolean) => ({ type: 'SHOW_SPINNER', show })

const addToolToStore = (tool: ToolItem) => ({ type: 'ADD_TOOL', tool })
const updateToolInStore = (tool: ToolItem) => ({ type: 'UPDATE_TOOL', tool })

export function addTool(name: string) {
	return (dispatch, getState) => {
		const { userId } = getState()

		dispatch(showSpinner(true))

		update(createTool, { userId, name }).then(({ data: { createTool } }) => {
			dispatch(addToolToStore(createTool))
			dispatch(showSpinner(false))
		})
	}
}

export function updateTools(tools) {
	return dispatch => {
		tools.forEach(tool => {
			if (tool.isUpdated) {
				delete tool.isUpdated
				update(updateTool, tool).then(({ data: { updateTool } }) => {
					dispatch(updateToolInStore(updateTool))
				})
			}
		})
	}
}

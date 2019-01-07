import produce from 'immer'

const initialState = {
	userId: null,
	projects: [],
	allCategories: [],
	allSkills: [],
	showSpinner: false, // show the loading spinner
}

const rootReducer = (state = initialState, action) =>
	produce(state, draft => {
		switch (action.type) {
			case 'ADD_CATEGORY':
				draft.allCategories.push(action.category)
				return

			case 'ADD_PROJECT':
				draft.projects.push(action.project)
				return

			case 'ADD_SKILL':
				draft.allSkills.push(action.skill)
				return

			case 'ADD_SKILL_TO_PROJECT':
				draft.projects = draft.projects.map(project => {
					if (project.id === action.skill.project.id) project.skills.items.push(action.skill)
					return project
				})
				return

			case 'ADD_TOOL_TO_SKILL':
				draft.allSkills = draft.allSkills.map(skill => {
					if (skill.id === action.skillId) skill.tools.items.push(action.tool)
					return skill
				})
				return

			case 'REMOVE_CATEGORY':
				draft.allCategories = draft.allCategories
					.map(category => {
						if (category.id === action.categoryId) return null
						return category
					})
					.filter(category => category !== null)

				draft.allSkills = draft.allSkills.map(skill => {
					if (skill.category && skill.category.id === action.categoryId) skill.category = null
					return skill
				})
				return

			case 'REMOVE_SKILL':
				draft.projects = draft.projects.map(project => {
					project.skills.items = project.skills.items
						.map(skill => {
							if (skill && skill.skillId === action.skillId) return null
							return skill
						})
						.filter(skill => skill !== null)

					return project
				})
				return

			case 'REMOVE_SKILL_FROM_PROJECT':
				draft.projects = draft.projects.map(project => {
					if (project.id === action.skill.project.id) {
						project.skills.items = project.skills.items.filter(item => item.id !== action.skill.id)
					}
					return project
				})
				return

			case 'REMOVE_TOOL':
				draft.allSkills = draft.allSkills.map(skill => {
					const toolIndex = skill.tools.items.findIndex(i => i.id === action.toolId)
					if (toolIndex > -1) skill.tools.items.splice(toolIndex, 1)
					return skill
				})
				return

			case 'SHOW_SPINNER':
				draft.showSpinner = action.show
				return

			case 'UPDATE_ALL_DATA':
				draft.userId = action.userId
				draft.projects = action.projects
				draft.allSkills = action.allSkills
				draft.allCategories = action.allCategories
				return

			case 'UPDATE_CATEGORY':
				draft.allCategories = draft.allCategories.map(i => {
					if (i.id === action.category.id) return action.category
					return i
				})

				draft.allSkills = draft.allSkills.map(skill => {
					if (skill.category && skill.category.id === action.category.id)
						skill.category = action.category
					return skill
				})
				return

			case 'UPDATE_PROJECT':
				draft.projects = draft.projects.map(draftProject => {
					if (draftProject.id === action.project.id) return action.project
					else return draftProject
				})
				return

			case 'UPDATE_SKILL':
				draft.allSkills = draft.allSkills.map(skill =>
					skill.id === action.updatedSkill.id ? action.updatedSkill : skill
				)
				return

			case 'UPDATE_TOOL':
				draft.allSkills = draft.allSkills.map(skill => {
					if (skill.id === action.tool.skill.id) {
						const items = skill.tools.items.map(i => (i.id === action.tool.id ? action.tool : i))
						skill.tools.items = items
					}
					return skill
				})
				return

			default:
				return
		}
	})

export default rootReducer

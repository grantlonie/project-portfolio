import produce from 'immer'

import { ProjectItem, CategoryItem, SkillItem, ToolItem } from '../types'

const initialState = {
	userId: null,
	projects: [],
	allCategories: [],
	allSkills: [],
	allTools: [],
	showSpinner: false, // show the loading spinner
}

interface State {
	userId: string
	projects: ProjectItem[]
	allCategories: CategoryItem[]
	allSkills: SkillItem[]
	allTools: ToolItem[]
	showSpinner: boolean
}

const rootReducer = (state: State = initialState, action) =>
	produce(state, (draft: State) => {
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

			case 'ADD_TOOL':
				draft.allTools.push(action.tool)
				return

			case 'ADD_SKILL_TO_PROJECT':
				draft.projects = draft.projects.map(project => {
					if (project.id === action.skill.project.id) project.skills.items.push(action.skill)
					return project
				})
				return

			case 'REMOVE_CATEGORY':
				draft.allCategories = draft.allCategories.filter(
					category => category.id !== action.categoryId
				)

				draft.allSkills = draft.allSkills.map(skill => {
					if (skill.category && skill.category.id === action.categoryId) skill.category = null
					return skill
				})
				return

			case 'REMOVE_PROJECT':
				draft.projects = draft.projects.filter(project => project.id !== action.projectId)
				return

			case 'REMOVE_SKILL':
				draft.allSkills = draft.allSkills.filter(skill => skill.id !== action.skillId)
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
				draft.allTools = draft.allTools.filter(tool => tool.id !== action.toolId)
				return

			case 'SHOW_SPINNER':
				draft.showSpinner = action.show
				return

			case 'UPDATE_ALL_DATA':
				draft.userId = action.userId
				draft.projects = action.projects
				draft.allSkills = action.allSkills
				draft.allCategories = action.allCategories
				draft.allTools = action.allTools.sort((a, b) => (a.name > b.name ? 1 : -1))
				return

			case 'UPDATE_CATEGORY':
				draft.allCategories = draft.allCategories.map(i => {
					if (i.id === action.category.id) return action.category
					return i
				})

				draft.allSkills = draft.allSkills.map(skill => {
					if (skill.category && skill.category.id === action.category.id) {
						skill.category = action.category
					}
					return skill
				})
				return

			case 'UPDATE_PROJECT':
				draft.projects = draft.projects.map(project => {
					if (project.id === action.project.id) return action.project
					else return project
				})
				return

			case 'UPDATE_PROJECT_SKILL':
				draft.projects = draft.projects.map(project => {
					if (project.id === action.projectSkill.project.id) {
						project.skills.items = project.skills.items.map(projectSkill => {
							if (projectSkill.id === action.projectSkill.id) projectSkill = action.projectSkill
							return projectSkill
						})
					}
					return project
				})
				return

			case 'UPDATE_SKILL':
				draft.allSkills = draft.allSkills.map(skill =>
					skill.id === action.updatedSkill.id ? action.updatedSkill : skill
				)
				return

			case 'UPDATE_TOOL':
				draft.allTools = draft.allTools.map(tool =>
					tool.id === action.tool.id ? action.tool : tool
				)
				return

			default:
				return
		}
	})

export default rootReducer

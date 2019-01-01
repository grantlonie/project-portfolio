import produce from 'immer'

const initialState = {
	userId: null,
	projects: [],
	allCategories: [],
	allSkills: [],
	showSpinner: false, // show the loading spinner
}

const rootReducer = produce((draft = initialState, action) => {
	switch (action.type) {
		case 'ADD_CATEGORY':
			return addCategory(draft, action)

		case 'ADD_PROJECT':
			return { ...draft, projects: [...draft.projects, action.project] }

		case 'ADD_SKILL':
			return addSkill(draft, action)

		case 'ADD_SKILL_TO_PROJECT':
			return addSkillToProject(draft, action)

		case 'ADD_TOOL_TO_SKILL':
			return addToolToSkill(draft, action)

		case 'REMOVE_SKILL':
			return removeSkill(draft, action)

		case 'REMOVE_SKILL_FROM_PROJECT':
			return removeSkillFromProject(draft, action)

		case 'REMOVE_CATEGORY':
			return removeCategory(draft, action)

		case 'REMOVE_TOOL':
			return removeTool(draft, action)

		case 'SHOW_SPINNER':
			return { ...draft, showSpinner: action.show }

		case 'UPDATE_ALL_DATA':
			delete action.type
			return { ...draft, ...action }

		case 'UPDATE_PROJECT':
			return updateProject(draft, action)

		case 'UPDATE_CATEGORY':
			return updateCategory(draft, action)

		case 'UPDATE_SKILL':
			return updateSkill(draft, action)

		case 'UPDATE_TOOL':
			return updateTool(draft, action)

		default:
			return draft
	}
})

function removeSkill(draft, { skillId }) {
	const allSkills = draft.allSkills.filter(skill => skill.id !== skillId)

	const projects = JSON.parse(JSON.stringify(draft.projects)).map(project => {
		project.skills.items = project.skills.items
			.map(skill => {
				if (skill && skill.skillId === skillId) return null
				return skill
			})
			.filter(skill => skill !== null)

		return project
	})

	return { ...draft, allSkills, projects }
}

function addSkill(draft, { skill }) {
	const allSkills = JSON.parse(JSON.stringify(draft.allSkills))
	allSkills.push(skill)

	return { ...draft, allSkills }
}

function addCategory(draft, { category }) {
	return { ...draft, allCategories: [...draft.allCategories, category] }
}

function updateCategory(draft, { category }) {
	const allCategories = JSON.parse(JSON.stringify(draft.allCategories)).map(i => {
		if (i.id === category.id) return category
		return i
	})

	const allSkills = JSON.parse(JSON.stringify(draft.allSkills)).map(skill => {
		if (skill.category && skill.category.id === category.id) skill.category = category

		return skill
	})

	return { ...draft, allCategories, allSkills }
}

function removeCategory(draft, { categoryId }) {
	const allCategories = JSON.parse(JSON.stringify(draft.allCategories))
		.map(category => {
			if (category.id === categoryId) return null
			return category
		})
		.filter(category => category !== null)

	const allSkills = JSON.parse(JSON.stringify(draft.allSkills)).map(skill => {
		if (skill.category && skill.category.id === categoryId) skill.category = null
		return skill
	})

	return { ...draft, allCategories, allSkills }
}

function removeTool(draft, { toolId }) {
	const allSkills = JSON.parse(JSON.stringify(draft.allSkills)).map(skill => {
		const toolIndex = skill.tools.items.findIndex(i => i.id === toolId)
		if (toolIndex > -1) skill.tools.items.splice(toolIndex, 1)

		return skill
	})

	return { ...draft, allSkills }
}

function removeSkillFromProject(draft, { skill }) {
	const projects = JSON.parse(JSON.stringify(draft.projects)).map(project => {
		if (project.id === skill.project.id) {
			project.skills.items = project.skills.items.filter(item => item.id !== skill.id)
		}
		return project
	})

	return { ...draft, projects }
}

function addSkillToProject(draft, { skill }) {
	const projects = JSON.parse(JSON.stringify(draft.projects)).map(project => {
		if (project.id === skill.project.id) project.skills.items.push(skill)
		return project
	})

	return { ...draft, projects }
}

function updateTool(draft, { tool }) {
	const allSkills = JSON.parse(JSON.stringify(draft.allSkills)).map(skill => {
		if (skill.id === tool.skill.id) {
			const items = skill.tools.items.map(i => (i.id === tool.id ? tool : i))
			skill.tools.items = items
		}

		return skill
	})

	return { ...draft, allSkills }
}

function updateSkill(draft, { updatedSkill }) {
	const allSkills = JSON.parse(JSON.stringify(draft.allSkills)).map(skill =>
		skill.id === updatedSkill.id ? updatedSkill : skill
	)

	return { ...draft, allSkills }
}

function addToolToSkill(draft, { skillId, tool }) {
	const allSkills = JSON.parse(JSON.stringify(draft.allSkills)).map(skill => {
		if (skill.id === skillId) skill.tools.items.push(tool)
		return skill
	})
	return { ...draft, allSkills }
}

function updateProject(draft, { project }) {
	const projects = [...draft.projects].map(draftProject => {
		if (draftProject.id === project.id) return project
		else return draftProject
	})

	return { ...draft, projects }
}

export default rootReducer

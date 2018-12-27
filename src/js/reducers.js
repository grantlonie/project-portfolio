const initialState = {
	userId: null,
	projects: [],
	allCategories: [],
	allSkills: [],
}

const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'UPDATE_ALL_DATA':
			delete action.type
			return { ...state, ...action }

		case 'ADD_PROJECT':
			return { ...state, projects: [...state.projects, action.project] }

		case 'ADD_SKILL':
			return { ...state, allSkills: [...state.allSkills, action.skill] }

		case 'ADD_SKILL_TO_PROJECT':
			return addSkillToProject(state, action)

		case 'ADD_TOOL_TO_SKILL':
			return addToolToSkill(state, action)

		case 'REMOVE_SKILL_FROM_PROJECT':
			return removeSkillFromProject(state, action)

		case 'UPDATE_PROJECT':
			return updateProject(state, action)

		case 'UPDATE_SKILL':
			return updateSkill(state, action)

		case 'UPDATE_TOOL':
			return updateTool(state, action)

		default:
			return state
	}
}

function removeSkillFromProject(state, { skill }) {
	const projects = JSON.parse(JSON.stringify(state.projects)).map(project => {
		if (project.id === skill.project.id) {
			project.skills.items = project.skills.items.filter(item => item.id !== skill.id)
		}
		return project
	})

	return { ...state, projects }
}

function addSkillToProject(state, { skill }) {
	const projects = JSON.parse(JSON.stringify(state.projects)).map(project => {
		if (project.id === skill.project.id) project.skills.items.push(skill)
		return project
	})

	return { ...state, projects }
}

function updateTool(state, { tool }) {
	const allSkills = JSON.parse(JSON.stringify(state.allSkills)).map(skill => {
		if (skill.id === tool.skill.id) {
			const items = skill.tools.items.map(i => (i.id === tool.id ? tool : i))
			skill.tools.items = items
		}

		return skill
	})

	return { ...state, allSkills }
}

function updateSkill(state, { updatedSkill }) {
	const allSkills = JSON.parse(JSON.stringify(state.allSkills)).map(skill =>
		skill.id === updatedSkill.id ? updatedSkill : skill
	)

	return { ...state, allSkills }
}

function addToolToSkill(state, { skillId, tool }) {
	const allSkills = state.allSkills.map(skill => {
		if (skill.id === skillId) skill.tools.items.push(tool)
		return skill
	})
	return { ...state, allSkills }
}

function updateProject(state, { project }) {
	const projects = [...state.projects].map(stateProject => {
		if (stateProject.id === project.id) return project
		else return stateProject
	})

	return { ...state, projects }
}

export default rootReducer

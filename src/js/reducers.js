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

		case 'ADD_SKILL':
			return { ...state, allSkills: [...state.allSkills, action.skill] }

		case 'UPDATE_PROJECT':
			return updateProject(state, action)

		default:
			return state
	}
}

function updateProject(state, { project }) {
	const projects = [...state.projects].map(stateProject => {
		if (stateProject.id === project.id) return project
		else return stateProject
	})

	return { ...state, projects }
}

export default rootReducer

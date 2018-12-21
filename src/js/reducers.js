const initialState = {
	userId: null,
	accomplishments: [],
	accomplishmentCategories: [],
	categories: [],
}

const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'UPDATE_ALL_DATA':
			delete action.type
			return { ...state, ...action }

		case 'ADD_CATEGORY':
			return { ...state, category: [...state.categories, action.category] }

		case 'UPDATE_ACCOMPLISHMENT':
			return updateAccomplishment(state, action)

		default:
			return state
	}
}

function updateAccomplishment(state, { accomplishment }) {
	const accomplishments = [...state.accomplishments].map(stateAccomplishment => {
		if (stateAccomplishment.id === accomplishment.id) return accomplishment
		else return stateAccomplishment
	})

	return { ...state, accomplishments }
}

export default rootReducer

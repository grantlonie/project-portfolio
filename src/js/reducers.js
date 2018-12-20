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

		default:
			return state
	}
}

export default rootReducer

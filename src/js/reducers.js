const initialState = {
	userId: null,
	accomplishments: [],
}

const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'UPDATE_ALL_DATA':
			return { ...state, userId: action.userId, accomplishments: action.accomplishments }

		default:
			return state
	}
}

export default rootReducer

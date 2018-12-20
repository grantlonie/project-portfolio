import React, { Component } from 'react'
import { connect } from 'react-redux'

class Edit extends Component {
	constructor(props) {
		super(props)
		const {
			match: {
				params: { id },
			},
			accomplishments,
		} = this.props

		let accomplishment
		if (id !== 'new') accomplishment = accomplishments.find(i => i.id === id)

		if (!accomplishment) {
			accomplishment = {
				id: null,
				name: '',
				date: Date.now(),
				company: '',
				description: '',
			}
		}

		this.state = { ...accomplishment }
	}

	render() {
		return <div>Nice!</div>
	}
}

const mapStateToProps = ({ accomplishments }) => ({ accomplishments })

const mapDispatchToProps = dispatch => {
	return {
		doSomething: data => {
			dispatch({ type: 'ACTION', data })
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Edit)

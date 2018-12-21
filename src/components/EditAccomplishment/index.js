import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Typography } from '@material-ui/core'

import MainProps from './MainProps'
import Categories from './Categories'

class Edit extends Component {
	constructor(props) {
		super(props)

		const accomplishment = this.getAccomplishment()

		this.bodyStyle = {
			margin: 'auto',
			maxWidth: '1000px',
			padding: '20px',
		}

		this.contentStyle = {
			display: 'grid',
			justifyContent: 'center',
			gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr)',
			gridGap: '20px 20px',
		}

		this.state = { ...accomplishment }
	}

	getAccomplishment() {
		const {
			match: {
				params: { id },
			},
			accomplishments,
		} = this.props

		let accomplishment
		if (id) accomplishment = accomplishments.find(i => i.id === id)

		if (!accomplishment) {
			accomplishment = {
				id: '',
				name: '',
				date: Date.now(),
				company: '',
				description: '',
				categories: [],
			}
		}

		return accomplishment
	}

	componentDidUpdate(prevProps) {
		// if accomplishments list length changes, update accomplishment
		if (prevProps.accomplishments.length !== this.props.accomplishments.length) {
			this.setState({ ...this.getAccomplishment() })
		}
	}

	handleMainPropChange({ target: { name, value } }) {
		this.setState({ [name]: value })
	}

	addAccomplishmentCategory(category) {
		const categories = [...(this.state.categories || []), category]

		this.setState({ categories })
	}

	render() {
		return (
			<div style={this.bodyStyle}>
				<Typography variant="h3" gutterBottom>
					Edit Accomplishment
				</Typography>

				<div style={this.contentStyle}>
					<MainProps category={this.state} handleChange={this.handleMainPropChange.bind(this)} />

					<Categories
						accomplishmentCategories={this.state.categories}
						addAccomplishmentCategory={this.addAccomplishmentCategory.bind(this)}
					/>
				</div>
			</div>
		)
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

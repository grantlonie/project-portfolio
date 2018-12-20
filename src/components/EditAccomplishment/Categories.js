import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TextField, Typography } from '@material-ui/core'

class Categories extends Component {
	constructor(props) {
		super(props)

		this.state = { categoryFilter: '' }
	}

	handleCategoryFilterChange({ target: { value } }) {
		this.setState({ categoryFilter: value })
	}

	render() {
		const { accomplishmentCategories, categoryFilter } = this.state
		const { categories } = this.props

		if (categories) {
			const categoryGroups = categories.map(category => category.group)
			console.log('categoryGroups: ', categoryGroups)
		}

		return (
			<div>
				<Typography variant="h5" gutterBottom>
					Categories
				</Typography>

				{!categories ? null : categories.map(category => <div>hi</div>)}

				<TextField
					label="Add Category"
					margin="normal"
					value={categoryFilter}
					onChange={this.handleCategoryFilterChange.bind(this)}
				/>
			</div>
		)
	}
}

const mapStateToProps = ({ categories }) => ({ categories })

const mapDispatchToProps = dispatch => {
	return {
		addCategory: data => {
			dispatch({ type: 'ADD_CATEGORY', data })
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Categories)

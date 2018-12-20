import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TextField, Typography, Button } from '@material-ui/core'

import Typeahead from '../Typeahead'

class Categories extends Component {
	constructor(props) {
		super(props)

		this.state = { showAddCategoryButton: false }
	}

	handleAddCategory() {
		const { showAddCategoryButton, categoryFilter } = this.state

		if (showAddCategoryButton) {
			this.props.addCategory(categoryFilter)
		}
	}

	render() {
		const { accomplishmentCategories, showAddCategoryButton } = this.state
		const { categories } = this.props

		const categoryGroups = categories.map(category => category.group)
		console.log('categoryGroups: ', categoryGroups)

		return (
			<div>
				<Typography variant="h5" gutterBottom>
					Categories
				</Typography>

				{!categories ? null : categories.map(category => <div>hi</div>)}

				<div style={{ display: 'flex' }}>
					<Typeahead list={categories.map(i => i.name)} />
					<Button
						style={{ opacity: showAddCategoryButton ? '1' : '0' }}
						disabled={!showAddCategoryButton}
						size="small"
						variant="contained"
						color="primary"
						onClick={this.handleAddCategory.bind(this)}>
						Create
					</Button>
				</div>
			</div>
		)
	}
}

const mapStateToProps = ({ categories }) => ({ categories })

const mapDispatchToProps = dispatch => {
	return {
		addCategory: category => {
			dispatch({ type: 'ADD_CATEGORY', category })
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Categories)

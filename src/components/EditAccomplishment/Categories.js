import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Typography, TextField } from '@material-ui/core'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import API, { graphqlOperation } from '@aws-amplify/api'

import { createCategory } from '../../graphql/mutations'

class Categories extends Component {
	constructor(props) {
		super(props)

		this.typeaheadRef = React.createRef()
	}

	handleSelectedCategory(categoryName) {
		const { userId, addAccomplishmentCategory, addCategoryToStore, categories } = this.props

		// New category created
		if (categoryName[0].customOption) {
			API.graphql(
				graphqlOperation(createCategory, { input: { userId, name: categoryName[0].label } })
			).then(({ data: { createCategory } }) => {
				addCategoryToStore(createCategory)
				addAccomplishmentCategory(createCategory)
			})
		} else {
			const category = categories.find(category => category.name === categoryName[0])
			addAccomplishmentCategory(category)
		}

		// clear typeahead input
		this.typeaheadRef.current.instanceRef.clear()
	}

	render() {
		const { categories, accomplishmentCategories, handleDescriptionChange } = this.props

		const unusedCategories = categories.filter(
			category =>
				(accomplishmentCategories || []).findIndex(
					accCategory => accCategory.name === category.name
				) === -1
		)

		const categoryGroups = categories.map(category => category.group)

		const categoryData =
			!accomplishmentCategories || accomplishmentCategories.length === 0 ? null : (
				<div style={{ marginBottom: '30px' }}>
					{accomplishmentCategories.map((category, categoryI) => (
						<div key={category.name}>
							<Typography variant="h6">{category.name}</Typography>

							<TextField
								fullWidth
								multiline
								variant="outlined"
								label="Description"
								style={{ margin: '5px 0 20px 0' }}
								name="description"
								value={category.description}
								onChange={({ target: { value } }) => handleDescriptionChange(categoryI, value)}
							/>
						</div>
					))}
				</div>
			)

		return (
			<div>
				<Typography variant="h5" gutterBottom>
					Categories
				</Typography>

				{categoryData}

				<Typeahead
					options={unusedCategories.map(i => i.name)}
					onChange={selected => this.handleSelectedCategory(selected)}
					ref={this.typeaheadRef}
					placeholder="Add a category..."
					allowNew
					clearButton
				/>
			</div>
		)
	}
}

const mapStateToProps = ({ categories, userId }) => ({ categories, userId })

const mapDispatchToProps = dispatch => {
	return {
		addCategoryToStore: category => {
			dispatch({ type: 'ADD_CATEGORY', category })
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Categories)

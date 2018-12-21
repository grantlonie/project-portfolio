import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Typography } from '@material-ui/core'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import API, { graphqlOperation } from '@aws-amplify/api'

import { createCategory } from '../../graphql/mutations'

class Categories extends Component {
	constructor(props) {
		super(props)

		this.typeaheadRef = React.createRef()
	}

	handleAddCategory() {
		const { showAddCategoryButton, categoryFilter } = this.state

		if (showAddCategoryButton) {
			this.props.addCategory(categoryFilter)
		}
	}

	handleSelectedCategory(category) {
		const { userId, addAccomplishmentCategory } = this.props

		// New category created
		if (category[0].customOption) {
			API.graphql(
				graphqlOperation(createCategory, { input: { userId, name: category[0].label } })
			).then(({ data }) => {
				addAccomplishmentCategory(data.createCategory.name)
			})
		} else {
			addAccomplishmentCategory(category[0])
		}

		// clear typeahead input
		this.typeaheadRef.current.instanceRef.clear()
	}

	render() {
		const { categories, accomplishmentCategories } = this.props

		const categoryGroups = categories.map(category => category.group)

		return (
			<div>
				<Typography variant="h5" gutterBottom>
					Categories
				</Typography>

				{!accomplishmentCategories
					? null
					: accomplishmentCategories.map(category => <div key={category}>{category}</div>)}

				<div style={{ display: 'flex' }}>
					<Typeahead
						options={categories.map(i => i.name)}
						onChange={selected => this.handleSelectedCategory(selected)}
						ref={this.typeaheadRef}
						allowNew
						clearButton
					/>
				</div>
			</div>
		)
	}
}

const mapStateToProps = ({ categories, userId }) => ({ categories, userId })

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

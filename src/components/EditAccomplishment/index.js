import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Typography, Button } from '@material-ui/core'
import API, { graphqlOperation } from '@aws-amplify/api'

import MainProps from './MainProps'
import Categories from './Categories'
import { updateAccomplishment, updateCategory } from '../../graphql/mutations'

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

		this.state = { ...accomplishment, mainPropsAreUpdated: false, categoriesAreUpdated: false }
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
		this.setState({ [name]: value, mainPropsAreUpdated: true })
	}

	addAccomplishmentCategory(category) {
		const categories = [...(this.state.categories || []), category]

		this.setState({ categories, categoriesAreUpdated: true })
	}

	handleCategoryDescriptionChange(index, value) {
		const newCategories = [...this.state.categories]
		newCategories[index].description = value

		this.setState({ categories: newCategories, categoriesAreUpdated: true })
	}

	handleUpdateAccomplishment() {
		const {
			id,
			name,
			date,
			company,
			description,
			categories,
			mainPropsAreUpdated,
			categoriesAreUpdated,
		} = this.state
		const { userId, updateAccomplishmentInStore } = this.props

		if (mainPropsAreUpdated) {
			console.log('mainPropsAreUpdated: ', mainPropsAreUpdated)
			API.graphql(
				graphqlOperation(updateAccomplishment, {
					input: { id, userId, name, company, date, description },
				})
			).then(({ data: { updateAccomplishment } }) => {
				updateAccomplishmentInStore(updateAccomplishment)
			})
		}

		if (categoriesAreUpdated) {
			console.log('categoriesAreUpdated: ', categoriesAreUpdated)
			categories.forEach(category => {
				console.log(
					'message:',
					graphqlOperation(updateAccomplishment, {
						input: { id, categories: { userId, description, category: { id: category.id } } },
					})
				)
				API.graphql(
					graphqlOperation(updateAccomplishment, {
						input: { id, categories: { userId, description, category: { id: category.id } } },
					})
				).then(data => {
					console.log('data: ', data)
					// updateAccomplishmentInStore(updateAccomplishment)
				})
			})
		} else {
		}
	}

	render() {
		const { mainPropsAreUpdated, categoriesAreUpdated, categories } = this.state

		return (
			<div style={this.bodyStyle}>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Typography variant="h4" gutterBottom>
						Edit Accomplishment
					</Typography>

					<Button
						variant="contained"
						color="secondary"
						disabled={!mainPropsAreUpdated && !categoriesAreUpdated}
						onClick={this.handleUpdateAccomplishment.bind(this)}>
						Update
					</Button>
				</div>

				<div style={this.contentStyle}>
					<MainProps category={this.state} handleChange={this.handleMainPropChange.bind(this)} />

					<Categories
						accomplishmentCategories={categories}
						addAccomplishmentCategory={this.addAccomplishmentCategory.bind(this)}
						handleDescriptionChange={this.handleCategoryDescriptionChange.bind(this)}
					/>
				</div>
			</div>
		)
	}
}

const mapStateToProps = ({ accomplishments, userId }) => ({ accomplishments, userId })

const mapDispatchToProps = dispatch => {
	return {
		updateAccomplishmentInStore: accomplishment => {
			dispatch({ type: 'UPDATE_ACCOMPLISHMENT', accomplishment })
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Edit)

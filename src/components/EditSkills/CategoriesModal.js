import React, { Component } from 'react'
import { connect } from 'react-redux'
import API, { graphqlOperation } from '@aws-amplify/api'
import {
	Modal,
	Typography,
	Paper,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	TextField,
	Button,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import { createCategory, updateCategory, deleteCategory, updateUser } from '../../graphql/mutations'

class CategoriesModal extends Component {
	constructor(props) {
		super(props)

		this.modalStyle = {
			position: 'absolute',
			left: '0%',
			right: '0%',
			top: '0%',
			bottom: '0%',
			margin: 'auto',
			width: '95%',
			maxWidth: '600px',
			maxHeight: '80vh',
			padding: '20px',
			overflowY: 'scroll',
		}

		this.state = { categories: props.categories }
	}

	componentDidUpdate(prevProps) {
		// if skills change in parent component, update state
		if (prevProps.categories.length !== this.props.categories.length) {
			this.setState({ categories: this.props.categories })
		}
	}

	handleNameChange(id, { target }) {
		const categories = this.state.categories.map(category => {
			if (category.id === id) {
				category.name = target.value
				category.isUpdated = true
			}
			return category
		})

		this.setState({ categories })
	}

	handleRemoveCategory(categoryId) {
		const categories = this.state.categories.filter(category => category.id !== categoryId)
		this.setState({ categories })

		API.graphql(graphqlOperation(deleteCategory, { input: { id: categoryId } })).then(() => {
			API.graphql(
				graphqlOperation(updateUser, { input: { id: this.props.userId, dirtyTables: true } })
			)
		})
	}

	handleNewCategory() {
		const { showSpinner, userId, addCategoryToStore } = this.props

		showSpinner()

		API.graphql(
			graphqlOperation(createCategory, {
				input: { userId, name: 'New Category' },
			})
		).then(({ data: { createCategory } }) => {
			const { id, name, userId } = createCategory
			const newCategory = { id, name, userId }

			addCategoryToStore(newCategory)
		})
	}

	closeModal() {
		const { close, updateCategoryInStore } = this.props

		this.state.categories.forEach(category => {
			if (category.isUpdated) {
				const { id, name } = category
				API.graphql(graphqlOperation(updateCategory, { input: { id, name } })).then(({ data }) => {
					updateCategoryInStore(data.updateCategory)
				})
			}
		})

		close()
	}

	render() {
		const { categories } = this.state

		return (
			<Modal open onClose={this.closeModal.bind(this)}>
				<Paper style={this.modalStyle} elevation={1}>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<Typography variant="h6" gutterBottom>
							Categories
						</Typography>
						<Button color="primary" onClick={this.handleNewCategory.bind(this)}>
							New
						</Button>
					</div>

					<Table aria-labelledby="tableTitle">
						<TableHead>
							<TableRow>
								<TableCell />
								<TableCell>ID</TableCell>
								<TableCell>Name</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{categories.map(category => {
								return (
									<TableRow hover key={category.id}>
										<TableCell>
											<DeleteIcon onClick={this.handleRemoveCategory.bind(this, category.id)} />
										</TableCell>
										<TableCell>{category.id}</TableCell>
										<TableCell>
											<TextField
												value={category.name}
												onChange={this.handleNameChange.bind(this, category.id)}
											/>
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</Paper>
			</Modal>
		)
	}
}

const mapStateToProps = ({ userId }) => ({ userId })

const mapDispatchToProps = dispatch => {
	return {
		showSpinner: () => {
			dispatch({ type: 'SHOW_SPINNER', show: true })
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CategoriesModal)

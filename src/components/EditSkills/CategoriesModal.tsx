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
	Tooltip,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import ValidationPopover from './ValidationPopover'

import { CategoryItem } from '../../types'
import { createCategory, updateCategory, deleteCategory, updateUser } from '../../graphql/mutations'

interface Props {
	categories: CategoryItem[]
	userId: string
	nullCategory: CategoryItem
	removeCategory: (categoryId: string) => null
	showSpinner: (show: boolean) => null
	updateCategoryInStore: (category: CategoryItem) => null
	addCategoryToStore: (category: { id: string; name: string; userId: string }) => null
	close: () => null
}

interface State {
	categories: (CategoryItem & { isUpdated?: boolean })[]
	newCategory: string
	popoverElement: any
	popoverContent: string
}

class CategoriesModal extends Component<Props, State> {
	private modalStyle: React.CSSProperties = {
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
		overflow: 'auto',
	}

	state: State = {
		categories: this.props.categories,
		newCategory: '',
		popoverElement: null,
		popoverContent: '',
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
		;(API.graphql(graphqlOperation(deleteCategory, { input: { id: categoryId } })) as Promise<
			any
		>).then(({ data }) => {
			this.props.removeCategory(data.deleteCategory.id)

			API.graphql(
				graphqlOperation(updateUser, { input: { id: this.props.userId, dirtyTables: true } })
			)
		})
	}

	handleNewCategory(e) {
		const { categories, showSpinner, userId, addCategoryToStore, nullCategory } = this.props
		const { newCategory } = this.state

		if (newCategory === nullCategory.name) {
			this.setState({
				popoverElement: e.currentTarget,
				popoverContent: `Category cannot have the name: "${nullCategory.name}"`,
			})
		} else if (categories.findIndex(category => category.name === newCategory) !== -1) {
			this.setState({
				popoverElement: e.currentTarget,
				popoverContent: `Category name ${newCategory} is already used. Choose another..`,
			})
		} else {
			showSpinner(true)
			;(API.graphql(
				graphqlOperation(createCategory, {
					input: { userId, name: newCategory },
				})
			) as Promise<any>).then(({ data: { createCategory } }) => {
				const { id, name, userId } = createCategory
				const newCategory = { id, name, userId }

				addCategoryToStore(newCategory)
				showSpinner(false)
				this.setState({ newCategory: '' })
			})
		}
	}

	closeModal() {
		const { close, updateCategoryInStore } = this.props

		this.state.categories.forEach(category => {
			if (category.isUpdated) {
				const { id, name } = category
				;(API.graphql(graphqlOperation(updateCategory, { input: { id, name } })) as Promise<
					any
				>).then(({ data }) => {
					updateCategoryInStore(data.updateCategory)
				})
			}
		})

		close()
	}

	handleNewCategoryChange({ target }) {
		this.setState({ newCategory: target.value })
	}

	handleNewCategoryKeyPress(e) {
		// check for enter key
		if (e.key === 'Enter') this.handleNewCategory(e)
	}

	handleClosePopover() {
		this.setState({ popoverElement: null })
	}

	render() {
		const { categories, newCategory, popoverElement, popoverContent } = this.state

		return (
			<Modal open onClose={this.closeModal.bind(this)}>
				<Paper style={this.modalStyle} elevation={1}>
					<Typography variant="h6" gutterBottom>
						Categories
					</Typography>

					<Table aria-labelledby="tableTitle">
						<TableHead>
							<TableRow>
								<TableCell />
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
										<TableCell>
											<TextField
												value={category.name}
												onChange={this.handleNameChange.bind(this, category.id)}
											/>
										</TableCell>
									</TableRow>
								)
							})}

							<TableRow>
								<TableCell />
								<TableCell>
									<Tooltip title="Press Enter when done">
										<TextField
											value={newCategory}
											placeholder="New Category"
											onChange={this.handleNewCategoryChange.bind(this)}
											onKeyUp={this.handleNewCategoryKeyPress.bind(this)}
										/>
									</Tooltip>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>

					<ValidationPopover
						element={popoverElement}
						content={popoverContent}
						close={this.handleClosePopover.bind(this)}
					/>
				</Paper>
			</Modal>
		)
	}
}

const mapStateToProps = ({ userId }) => ({ userId })

const mapDispatchToProps = dispatch => {
	return {
		showSpinner: show => {
			dispatch({ type: 'SHOW_SPINNER', show })
		},
		updateCategoryInStore: category => {
			dispatch({ type: 'UPDATE_CATEGORY', category })
		},
		addCategoryToStore: category => {
			dispatch({ type: 'ADD_CATEGORY', category })
		},
		removeCategory: categoryId => {
			dispatch({ type: 'REMOVE_CATEGORY', categoryId })
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CategoriesModal)

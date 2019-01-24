import React, { Component } from 'react'
import { connect } from 'react-redux'
import API, { graphqlOperation } from '@aws-amplify/api'
import {
	Typography,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	MenuItem,
	Button,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import { createSkill, updateSkill } from '../../graphql/mutations'
import CategoriesModal from './CategoriesModal'
import DeleteSkillConfirmationModal from './DeleteSkillConfirmationModal'
import { SkillItem, CategoryItem } from '../../types'

const headers = [{ id: 'name', label: 'Name' }, { id: 'category', label: 'Category' }]

const nullCategory = { id: '_null', name: 'General' }

let updateTimeout // used for timeout to edit project database and redux
const updateCheckTime = 5000 // [ms] how long to wait after editting to update the component

interface Props {
	allCategories: CategoryItem[]
	allSkills: SkillItem[]
	userId: string
	showSpinner: (show: boolean) => null
	addSkillToStore: (skill: SkillItem) => null
	updateSkillInStore: (skill: SkillItem) => null
}

interface State {
	modalSkill: SkillItem
	skills: (SkillItem & { isUpdated?: boolean; skillCategoryId: '' })[]
	newSkill: string
	modal: string
}

class EditSkills extends Component<Props, State> {
	constructor(props) {
		super(props)

		this.state = {
			skills: this.sortedSkills(),
			newSkill: '',
			modal: '',
			modalSkill: null,
		}
	}

	sortedSkills() {
		return JSON.parse(JSON.stringify(this.props.allSkills))
			.map(skill => {
				// add nullCategory if none
				if (!skill.category) skill.category = nullCategory
				return skill
			})
			.sort((a, b) => (a.category.name > b.category.name ? 1 : -1))
	}

	componentDidUpdate(prevProps) {
		// if skills change in redux, update state
		if (JSON.stringify(prevProps.allSkills) !== JSON.stringify(this.props.allSkills)) {
			let modalSkill = this.state.modalSkill
				? this.props.allSkills.find(i => i.id === this.state.modalSkill.id)
				: null

			this.setState({ skills: this.sortedSkills(), modalSkill })
		}
	}

	componentWillUnmount() {
		this.updateSkills()
	}

	handleAddSkill() {
		const { userId, showSpinner, addSkillToStore } = this.props

		showSpinner(true)
		;(API.graphql(
			graphqlOperation(createSkill, {
				input: { userId, name: this.state.newSkill },
			})
		) as Promise<any>).then(({ data: { createSkill } }) => {
			addSkillToStore(createSkill)
			showSpinner(false)
		})

		this.setState({ newSkill: '' })
	}

	updateSkills() {
		clearTimeout(updateTimeout)

		this.state.skills.forEach(skill => {
			const { id, name, skillCategoryId, isUpdated } = skill

			if (isUpdated) {
				delete skill.isUpdated

				const input: any = { id, name }
				if (skillCategoryId) {
					input.skillCategoryId = skillCategoryId === nullCategory.id ? null : skillCategoryId
				}

				;(API.graphql(graphqlOperation(updateSkill, { input })) as Promise<any>).then(
					({ data }) => {
						this.props.updateSkillInStore(data.updateSkill)
					}
				)
			}
		})
	}

	handleChangeCategory(id, { target }) {
		const skills = JSON.parse(JSON.stringify(this.state.skills)).map(skill => {
			if (skill.id === id) {
				skill.skillCategoryId = target.value
				skill.isUpdated = true
			}
			return skill
		})

		clearTimeout(updateTimeout)
		updateTimeout = setTimeout(() => this.updateSkills(), updateCheckTime)

		this.setState({ skills })
	}

	handleNameChange(id, { target }) {
		const skills = JSON.parse(JSON.stringify(this.state.skills)).map(skill => {
			if (skill.id === id) {
				skill.name = target.value
				skill.isUpdated = true
			}
			return skill
		})

		clearTimeout(updateTimeout)
		updateTimeout = setTimeout(() => this.updateSkills(), updateCheckTime)

		this.setState({ skills })
	}

	handleEditTools(skill: SkillItem) {
		this.setState({ modalSkill: skill, modal: 'tools' })
	}

	closeModal() {
		this.setState({ modalSkill: null, modal: '' })
	}

	handleOpenCategoryModal() {
		this.setState({ modal: 'categories' })
	}

	handleNewSkillChange({ target }) {
		this.setState({ newSkill: target.value })
	}

	handleOpenDeleteModal(skill) {
		this.setState({ modalSkill: skill, modal: 'delete' })
	}

	removeSkill(skillId) {
		const skills = this.state.skills.filter(skill => skill.id !== skillId)
		this.setState({ skills })
	}

	render() {
		const { allCategories } = this.props
		const { skills, modalSkill, modal, newSkill } = this.state

		// Add nullCategory to category list
		const adjCategories = JSON.parse(JSON.stringify(allCategories))
		adjCategories.push(nullCategory)

		// Render a modal
		let renderedModal
		switch (modal) {
			case 'categories':
				renderedModal = (
					<CategoriesModal
						categories={allCategories}
						nullCategory={nullCategory}
						close={this.closeModal.bind(this)}
					/>
				)
				break

			case 'delete':
				renderedModal = (
					<DeleteSkillConfirmationModal
						skills={skills}
						skill={modalSkill}
						removeSkill={this.removeSkill.bind(this)}
						close={this.closeModal.bind(this)}
					/>
				)
				break

			default:
				renderedModal = null
		}

		return (
			<div>
				{renderedModal}

				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Typography variant="h4" gutterBottom>
						Edit Skills
					</Typography>
					<Button color="primary" onClick={this.handleOpenCategoryModal.bind(this)}>
						Update Categories
					</Button>
				</div>

				<Table aria-labelledby="tableTitle">
					<TableHead>
						<TableRow>
							<TableCell />
							{headers.map(header => {
								return <TableCell key={header.id}>{header.label}</TableCell>
							})}
						</TableRow>
					</TableHead>

					<TableBody>
						{skills.map(skill => {
							return (
								<TableRow hover key={skill.id}>
									<TableCell padding="dense">
										<DeleteIcon onClick={this.handleOpenDeleteModal.bind(this, skill)} />
									</TableCell>
									<TableCell padding="dense">
										<TextField
											value={skill.name}
											onChange={this.handleNameChange.bind(this, skill.id)}
										/>
									</TableCell>

									<TableCell padding="dense">
										<TextField
											select
											value={skill.skillCategoryId || skill.category.id}
											onChange={this.handleChangeCategory.bind(this, skill.id)}
											style={{ width: '100%' }}>
											>
											{adjCategories.map(category => {
												return (
													<MenuItem key={category.id} value={category.id}>
														{category.name}
													</MenuItem>
												)
											})}
										</TextField>
									</TableCell>
								</TableRow>
							)
						})}

						<TableRow>
							<TableCell />
							<TableCell />
							<TableCell padding="dense">
								<TextField
									value={newSkill}
									placeholder="New Skill"
									onChange={this.handleNewSkillChange.bind(this)}
								/>
							</TableCell>
							<TableCell>
								<Button
									color="secondary"
									variant="contained"
									disabled={!Boolean(this.state.newSkill)}
									onClick={this.handleAddSkill.bind(this)}>
									Create
								</Button>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		)
	}
}

const mapStateToProps = ({ allCategories, allSkills, userId }) => ({
	allCategories,
	allSkills,
	userId,
})

const mapDispatchToProps = dispatch => {
	return {
		updateSkillInStore: updatedSkill => {
			dispatch({ type: 'UPDATE_SKILL', updatedSkill })
		},
		addSkillToStore: skill => {
			dispatch({ type: 'ADD_SKILL', skill })
		},
		showSpinner: show => {
			dispatch({ type: 'SHOW_SPINNER', show })
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditSkills)

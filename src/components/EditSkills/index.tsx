import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, TextField, MenuItem, Button } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import CategoriesModal from './CategoriesModal'
import DeleteSkillConfirmationModal from './DeleteSkillConfirmationModal'
import { SkillItem, CategoryItem } from '../../types'
import { addSkill, updateSkills } from '../../js/actions'

const headers = [{ id: 'name', label: 'Name' }, { id: 'category', label: 'Category' }]

const nullCategory = { id: '_null', name: 'General' }

let updateTimeout // used for timeout to edit project database and redux
const updateCheckTime = 5000 // [ms] how long to wait after editting to update the component

export interface SkillToUpdate extends SkillItem {
	isUpdated?: boolean
	skillCategoryId: string
}

interface Props {
	allCategories: CategoryItem[]
	allSkills: SkillItem[]
	addSkill: (name: string) => void
	updateSkills: (skills: SkillToUpdate[], nullCategoryId: string) => void
}

interface State {
	modalSkill: SkillItem
	skills: SkillToUpdate[]
	newSkill: string
	modal: string
	hideAddSkillButton: boolean
}

class EditSkills extends Component<Props, State> {
	constructor(props) {
		super(props)

		this.state = {
			skills: this.sortedSkills(),
			newSkill: '',
			modal: '',
			modalSkill: null,
			hideAddSkillButton: true,
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
			let modalSkill = this.state.modalSkill ? this.props.allSkills.find(i => i.id === this.state.modalSkill.id) : null

			this.setState({ skills: this.sortedSkills(), modalSkill })
		}
	}

	componentWillUnmount() {
		this.updateSkills()
	}

	handleAddSkill() {
		this.props.addSkill(this.state.newSkill)
		this.setState({ newSkill: '', hideAddSkillButton: true })
	}

	updateSkills() {
		clearTimeout(updateTimeout)
		this.props.updateSkills(this.state.skills, nullCategory.id)
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
		let hideAddSkillButton = true

		if (target.value) {
			// prevent creating skill with same name
			const alreadyASkill = this.props.allSkills.findIndex(skill => skill.name === target.value)
			if (alreadyASkill === -1) hideAddSkillButton = false
		}

		this.setState({ newSkill: target.value, hideAddSkillButton })
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
					<CategoriesModal categories={allCategories} nullCategory={nullCategory} close={this.closeModal.bind(this)} />
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
										<TextField value={skill.name} onChange={this.handleNameChange.bind(this, skill.id)} />
									</TableCell>

									<TableCell padding="dense">
										<TextField
											select
											value={skill.skillCategoryId || skill.category.id}
											onChange={this.handleChangeCategory.bind(this, skill.id)}
											style={{ width: '100%' }}
										>
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
							<TableCell padding="dense">
								<TextField value={newSkill} placeholder="New Skill" onChange={this.handleNewSkillChange.bind(this)} />
							</TableCell>
							<TableCell>
								<Button
									color="secondary"
									variant="contained"
									disabled={this.state.hideAddSkillButton}
									onClick={this.handleAddSkill.bind(this)}
								>
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

const mapStateToProps = ({ allCategories, allSkills }) => ({
	allCategories,
	allSkills,
})

const mapDispatchToProps = dispatch => ({
	addSkill: name => dispatch(addSkill(name)),
	updateSkills: (skills, nullCategoryId) => dispatch(updateSkills(skills, nullCategoryId)),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditSkills)

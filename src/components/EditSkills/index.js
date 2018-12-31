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

import { createSkill, updateSkill } from '../../graphql/mutations'
import ToolsModal from './ToolsModal'
import CategoriesModal from './CategoriesModal'

const headers = [
	{ id: 'id', label: 'ID' },
	{ id: 'name', label: 'Name' },
	{ id: 'category', label: 'Category' },
	{ id: 'tools', label: 'Edit Tools' },
]

const nullCategory = { id: '_null', name: 'General' }

let updateTimeout // used for timeout to edit project database and redux
const updateCheckTime = 5000 // [ms] how long to wait after editting to update the component

class EditSkills extends Component {
	constructor(props) {
		super(props)

		this.state = {
			skills: this.sortedSkills(),
			newSkill: '',
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

	async handleAddSkill() {
		const { userId, showSpinner, addSkillToStore } = this.props

		showSpinner()

		API.graphql(
			graphqlOperation(createSkill, {
				input: { userId, name: this.state.newSkill },
			})
		).then(({ data: { createSkill } }) => {
			addSkillToStore(createSkill)
		})

		this.setState({ newSkill: '' })
	}

	updateSkills() {
		clearTimeout(updateTimeout)

		this.state.skills.forEach(skill => {
			const { id, name, skillCategoryId, isUpdated } = skill

			if (isUpdated) {
				delete skill.isUpdated

				const input = { id, name }
				if (skillCategoryId) {
					input.skillCategoryId = skillCategoryId === nullCategory.id ? null : skillCategoryId
				}

				API.graphql(graphqlOperation(updateSkill, { input })).then(({ data }) => {
					this.props.updateSkillInStore(data.updateSkill)
				})
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

	handleEditTools(skill) {
		this.setState({ modalSkill: skill })
	}

	closeModal() {
		this.setState({ modalSkill: null, showCategoryModal: null })
	}

	handleOpenCategoryModal() {
		this.setState({ showCategoryModal: true })
	}

	handleNewSkillChange({ target }) {
		this.setState({ newSkill: target.value })
	}

	render() {
		const { allCategories } = this.props
		const { skills, modalSkill, showCategoryModal, newSkill } = this.state

		// Add nullCategory to category list
		const adjCategories = JSON.parse(JSON.stringify(allCategories))
		adjCategories.push(nullCategory)

		return (
			<div>
				{modalSkill ? <ToolsModal skill={modalSkill} close={this.closeModal.bind(this)} /> : null}

				{showCategoryModal ? (
					<CategoriesModal categories={allCategories} close={this.closeModal.bind(this)} />
				) : null}

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
							{headers.map(header => {
								return <TableCell key={header.id}>{header.label}</TableCell>
							}, this)}
						</TableRow>
					</TableHead>

					<TableBody>
						{skills.map(skill => {
							return (
								<TableRow hover key={skill.id}>
									<TableCell>{skill.id}</TableCell>
									<TableCell>
										<TextField
											value={skill.name}
											onChange={this.handleNameChange.bind(this, skill.id)}
										/>
									</TableCell>
									<TableCell>
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
									<TableCell>
										<Button color="primary" onClick={this.handleEditTools.bind(this, skill)}>
											Tools
										</Button>
									</TableCell>
								</TableRow>
							)
						})}

						<TableRow>
							<TableCell />
							<TableCell>
								<TextField value={newSkill} onChange={this.handleNewSkillChange.bind(this)} />
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
							<TableCell />
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
		showSpinner: () => {
			dispatch({ type: 'SHOW_SPINNER', show: true })
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditSkills)

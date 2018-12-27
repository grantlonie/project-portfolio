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

import { updateSkill } from '../../graphql/mutations'
import ToolsModal from './ToolsModal'

const headers = [
	{ id: 'id', label: 'ID' },
	{ id: 'name', label: 'Name' },
	{ id: 'category', label: 'Category' },
	{ id: 'tools', label: 'Edit Tools' },
]

let updateTimeout // used for timeout to edit project database and redux
const updateCheckTime = 5000 // [ms] how long to wait after editting to update the component

class EditSkills extends Component {
	constructor(props) {
		super(props)

		this.state = {
			skills: this.sortedSkills(),
		}
	}

	sortedSkills() {
		return JSON.parse(JSON.stringify(this.props.allSkills)).sort((a, b) =>
			a.category.name > b.category.name ? 1 : -1
		)
	}

	componentDidUpdate(prevProps) {
		const { allSkills } = this.props

		// if projects list length changes, update project
		if (prevProps.allSkills.length !== allSkills.length) {
			this.setState({ skills: this.sortedSkills() })
		}
	}

	componentWillUnmount() {
		this.updateSkills()
	}

	async handleAddSkill() {
		const { userId, addSkill } = this.props

		// const { data } = await API.graphql(
		// 	graphqlOperation(createSkill, { input: {} })
		// )
		// addSkill(data.createSkill)
	}

	updateSkills() {
		clearTimeout(updateTimeout)

		this.state.skills.forEach(skill => {
			const { id, name, skillCategoryId, isUpdated } = skill

			if (isUpdated) {
				delete skill.isUpdated

				const input = { id, name }
				if (skillCategoryId) input.skillCategoryId = skillCategoryId

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
		this.setState({ modalSkill: null })
	}

	render() {
		const { allCategories } = this.props
		const { skills, modalSkill } = this.state

		return (
			<div>
				{modalSkill ? <ToolsModal skill={modalSkill} close={this.closeModal.bind(this)} /> : null}

				<Typography variant="h4" gutterBottom>
					Edit Skills
				</Typography>

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
											{allCategories.map(category => {
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
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditSkills)

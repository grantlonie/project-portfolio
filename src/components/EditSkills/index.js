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

class EditSkills extends Component {
	constructor(props) {
		super(props)

		this.bodyStyle = {
			margin: 'auto',
			maxWidth: '1000px',
			padding: '20px',
		}

		this.state = {
			skills: this.sortedSkills(),
			updateSkills: false,
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

	handleClickRow(id) {
		this.setState({ redirect: id })
	}

	async handleAddSkill() {
		const { userId, addSkill } = this.props

		// const { data } = await API.graphql(
		// 	graphqlOperation(createSkill, { input: {} })
		// )
		// addSkill(data.createSkill)
	}

	handleUpdateSkills() {
		this.state.skills.forEach(skill => {
			const { id, name, skillCategoryId, shouldUpdate } = skill

			if (shouldUpdate) {
				const input = { id, name }
				if (skillCategoryId) input.skillCategoryId = skillCategoryId

				API.graphql(graphqlOperation(updateSkill, { input })).then(({ data }) => {
					this.props.updateSkillInStore(data.updateSkill)
				})
			}
		})

		this.setState({ updateSkills: false })
	}

	handleChangeCategory(id, { target }) {
		const skills = JSON.parse(JSON.stringify(this.state.skills)).map(skill => {
			if (skill.id === id) {
				skill.skillCategoryId = target.value
				skill.shouldUpdate = true
			}
			return skill
		})

		this.setState({ skills, updateSkills: true })
	}

	handleNameChange(id, { target }) {
		const skills = JSON.parse(JSON.stringify(this.state.skills)).map(skill => {
			if (skill.id === id) {
				skill.name = target.value
				skill.shouldUpdate = true
			}
			return skill
		})
		this.setState({ skills, updateSkills: true })
	}

	handleEditTools(skill) {
		this.setState({ modalSkill: skill })
	}

	closeModal() {
		this.setState({ modalSkill: null })
	}

	render() {
		const { allCategories } = this.props
		const { skills, updateSkills, modalSkill } = this.state

		return (
			<div style={this.bodyStyle}>
				{modalSkill ? <ToolsModal skill={modalSkill} close={this.closeModal.bind(this)} /> : null}

				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Typography variant="h4" gutterBottom>
						Edit Skills
					</Typography>

					<Button
						variant="contained"
						color="secondary"
						disabled={!updateSkills}
						onClick={this.handleUpdateSkills.bind(this)}>
						Update
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
								<TableRow hover key={skill.id} onClick={this.handleClickRow.bind(this, skill.id)}>
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

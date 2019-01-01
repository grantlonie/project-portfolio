import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateTool, updateProjectSkill, deleteSkill, updateUser } from '../../graphql/mutations'
import API, { graphqlOperation } from '@aws-amplify/api'
import {
	Modal,
	Typography,
	TextField,
	Paper,
	Button,
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
	Select,
	MenuItem,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

class ConfirmationModal extends Component {
	constructor(props) {
		super(props)

		this.modalStyle = {
			position: 'absolute',
			width: '95%',
			maxWidth: '600px',
			padding: '20px',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			margin: '20px',
		}

		// Array of skills the user can merge existing skill with
		this.mergeSkills = props.skills.filter(skill => skill.id !== props.skill.id)

		this.state = { deleteTextValue: '', mergeSkillId: this.mergeSkills[0].id }
	}

	deleteSkill() {
		const { removeSkillFromStore, removeSkill, userId, skill, close } = this.props

		removeSkill(skill.id)
		close()

		API.graphql(graphqlOperation(deleteSkill, { input: { id: skill.id } })).then(({ data }) => {
			removeSkillFromStore(data.deleteSkill.id)
			API.graphql(graphqlOperation(updateUser, { input: { id: userId, dirtyTables: true } }))
		})
	}

	// Method merges skill with the selected skill
	async mergeSkill() {
		const {
			skill,
			projects,
			removeTool,
			addToolToAllSkills,
			removeSkillFromProject,
			addProjectSkillToStore,
			showSpinner,
		} = this.props
		const { mergeSkillId } = this.state

		showSpinner(true)

		// Link tools to new skill
		for (const tool of skill.tools.items) {
			const {
				data: { updateTool: updatedTool },
			} = await API.graphql(
				graphqlOperation(updateTool, {
					input: { id: tool.id, toolSkillId: mergeSkillId },
				})
			)

			// Update redux
			removeTool(updatedTool.id)
			addToolToAllSkills(mergeSkillId, updatedTool)
		}

		// Link ProjectSkill to new skillId
		for (const project of projects) {
			for (const projectSkill of project.skills.items) {
				if (projectSkill.skillId === skill.id) {
					const {
						data: { updateProjectSkill: updatedSkill },
					} = await API.graphql(
						graphqlOperation(updateProjectSkill, {
							input: { id: projectSkill.id, skillId: mergeSkillId },
						})
					)

					// Update redux
					removeSkillFromProject(updatedSkill)
					addProjectSkillToStore(updatedSkill)
				}
			}
		}

		showSpinner(false)

		// Delete Skill
		this.deleteSkill()
	}

	handleDeleteTextChange({ target }) {
		this.setState({ deleteTextValue: target.value })
	}

	handleMergeSkillChange({ target }) {
		this.setState({
			mergeSkillId: this.mergeSkills.find(skill => skill.id === target.value).id,
		})
	}

	render() {
		const { close, skill } = this.props
		const { deleteTextValue, mergeSkillId } = this.state

		return (
			<Modal open onClose={() => close()}>
				<Paper style={this.modalStyle} elevation={1}>
					<Typography variant="h6" gutterBottom>
						What would you like to do with <em>{skill.name}</em>?
					</Typography>

					<ExpansionPanel>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<Typography>
								Merge <em>{skill.name}</em> with another skill
							</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							{mergeSkillId ? (
								<div>
									<Select value={mergeSkillId} onChange={this.handleMergeSkillChange.bind(this)}>
										{this.mergeSkills.map(skill => (
											<MenuItem key={skill.id} value={skill.id}>
												{skill.name}
											</MenuItem>
										))}
									</Select>

									<Button
										color="primary"
										style={{ marginLeft: '20px' }}
										onClick={this.mergeSkill.bind(this)}>
										Merge
									</Button>
								</div>
							) : (
								<Typography>No other skills to merge with</Typography>
							)}
						</ExpansionPanelDetails>
					</ExpansionPanel>

					<ExpansionPanel>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<Typography>
								Delete <em>{skill.name}</em> and all associated tools and relations within a project
								(not recommended)
							</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails style={{ display: 'block' }}>
							<Typography>
								Type <em>{skill.name}</em> and delete.
							</Typography>
							<TextField
								value={deleteTextValue}
								onChange={this.handleDeleteTextChange.bind(this)}
							/>
							<Button
								color="primary"
								style={{ marginLeft: '20px' }}
								disabled={deleteTextValue !== skill.name}
								onClick={this.deleteSkill.bind(this)}>
								Delete
							</Button>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				</Paper>
			</Modal>
		)
	}
}

const mapStateToProps = ({ allSkills, projects, userId }) => ({ allSkills, projects, userId })

const mapDispatchToProps = dispatch => {
	return {
		removeSkillFromStore: skillId => {
			dispatch({ type: 'REMOVE_SKILL', skillId })
		},
		removeTool: toolId => {
			dispatch({ type: 'REMOVE_TOOL', toolId })
		},
		showSpinner: show => {
			dispatch({ type: 'SHOW_SPINNER', show })
		},
		addToolToAllSkills: (skillId, tool) => {
			dispatch({ type: 'ADD_TOOL_TO_SKILL', skillId, tool })
		},
		addProjectSkillToStore: skill => {
			dispatch({ type: 'ADD_SKILL_TO_PROJECT', skill })
		},
		removeSkillFromProject: skill => {
			dispatch({ type: 'REMOVE_SKILL_FROM_PROJECT', skill })
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ConfirmationModal)

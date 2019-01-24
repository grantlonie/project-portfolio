import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal, Typography, TextField, Paper, Button } from '@material-ui/core'

import { ProjectItem } from '../types'

interface Props {
	project: ProjectItem
	close: (confirm: boolean) => null
}

interface State {
	deleteTextValue: string
}

class ConfirmationModal extends Component<Props, State> {
	private modalStyle: React.CSSProperties = {
		position: 'absolute',
		width: '95%',
		maxWidth: '350px',
		padding: '20px',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		margin: '20px',
	}

	state: State = { deleteTextValue: '' }

	deleteSkill() {
		this.props.close(true)
	}

	handleDeleteTextChange({ target }) {
		this.setState({ deleteTextValue: target.value })
	}

	render() {
		const { close, project } = this.props
		const { deleteTextValue } = this.state

		// Blank project and disabling delete button logic
		let projectName = 'Blank Project'
		let disableButton = false
		if (project.name) {
			projectName = project.name
			if (deleteTextValue !== project.name) disableButton = true
		}

		return (
			<Modal open onClose={() => close(false)}>
				<Paper style={this.modalStyle} elevation={1}>
					<Typography>
						Delete <em>{projectName}</em> and all associated skills?
					</Typography>

					{project.name ? (
						<>
							<br />
							<Typography>
								Type <em>{projectName}</em> and delete.
							</Typography>

							<TextField
								value={deleteTextValue}
								onChange={this.handleDeleteTextChange.bind(this)}
							/>
						</>
					) : null}

					<Button
						color="primary"
						style={{ marginLeft: '20px' }}
						disabled={disableButton}
						onClick={this.deleteSkill.bind(this)}>
						Delete
					</Button>
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
		showSpinner: show => {
			dispatch({ type: 'SHOW_SPINNER', show })
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

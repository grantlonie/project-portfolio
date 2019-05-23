import React, { Component } from 'react'
import { connect } from 'react-redux'
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

import { SkillItem } from '../../types'
import { removeSkill, mergeSkill } from '../../js/actions'

interface Props {
	skill: SkillItem
	removeSkill: (skillId: string) => null
	mergeSkill: (fromId: string, toId: string) => null
	close: () => null
}

interface State {
	deleteTextValue: string
	mergeSkillId: string
}

class ConfirmationModal extends Component<Props, State> {
	private mergeSkills: SkillItem[]
	private modalStyle: React.CSSProperties

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
		const mergeSkillId = this.mergeSkills.length > 0 ? this.mergeSkills[0].id : null

		this.state = { deleteTextValue: '', mergeSkillId }
	}

	removeSkill() {
		const { removeSkill, skill, close } = this.props
		removeSkill(skill.id)
		close()
	}

	// Method merges skill with the selected skill
	mergeSkill() {
		const { close, skill, mergeSkill } = this.props
		mergeSkill(skill.id, this.state.mergeSkillId)
		close()
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

									<Button color="primary" style={{ marginLeft: '20px' }} onClick={this.mergeSkill.bind(this)}>
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
								Delete <em>{skill.name}</em> and all associated tools and relations within a project (not recommended)
							</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails style={{ display: 'block' }}>
							<Typography>
								Type <em>{skill.name}</em> and delete.
							</Typography>
							<TextField value={deleteTextValue} onChange={this.handleDeleteTextChange.bind(this)} />
							<Button
								color="primary"
								style={{ marginLeft: '20px' }}
								disabled={deleteTextValue !== skill.name}
								onClick={this.removeSkill.bind(this)}
							>
								Delete
							</Button>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				</Paper>
			</Modal>
		)
	}
}

const mapDispatchToProps = dispatch => ({
	removeSkill: skillId => dispatch(removeSkill(skillId)),
	mergeSkill: (fromId, toId) => dispatch(mergeSkill(fromId, toId)),
})

export default connect(
	null,
	mapDispatchToProps
)(ConfirmationModal)

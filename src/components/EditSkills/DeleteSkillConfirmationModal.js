import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateSkill, deleteSkill, updateUser } from '../../graphql/mutations'
import API, { graphqlOperation } from '@aws-amplify/api'
import {
	Modal,
	Typography,
	Paper,
	Button,
	RadioGroup,
	Radio,
	FormControlLabel,
} from '@material-ui/core'

class ConfirmationModal extends Component {
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

		this.state = {}
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

	handleRadioChange() {
		console.log('change')
	}

	render() {
		return (
			<Modal open onClose={() => this.props.close()}>
				<Paper style={this.modalStyle} elevation={1}>
					<RadioGroup
						aria-label="Gender"
						name="gender1"
						value={this.state.value}
						onChange={this.handleRadioChange.bind(this)}>
						<FormControlLabel value="merge" control={<Radio />} label="Merge with another Skill" />
						<p>create list of skills to merge with selected one</p>
						<FormControlLabel value="delete" control={<Radio />} label="Delete Skill" />
						<p>make user type skill name before deleting allow</p>
						<Button onClick={this.deleteSkill.bind(this)}>Delete</Button>
					</RadioGroup>
				</Paper>
			</Modal>
		)
	}
}

const mapStateToProps = ({ allSkills, userId }) => ({ allSkills, userId })

const mapDispatchToProps = dispatch => {
	return {
		removeSkillFromStore: skillId => {
			dispatch({ type: 'REMOVE_SKILL', skillId })
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ConfirmationModal)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Typography, Button } from '@material-ui/core'
import API, { graphqlOperation } from '@aws-amplify/api'

import MainProps from './MainProps'
import Skills from './Skills'
import { updateAccomplishment } from '../../graphql/mutations'

class Edit extends Component {
	constructor(props) {
		super(props)

		const accomplishment = this.getAccomplishment()

		this.bodyStyle = {
			margin: 'auto',
			maxWidth: '1000px',
			padding: '20px',
		}

		this.contentStyle = {
			display: 'grid',
			justifyContent: 'center',
			gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr)',
			gridGap: '20px 20px',
		}

		this.state = { ...accomplishment, mainPropsAreUpdated: false, skillsAreUpdated: false }
	}

	getAccomplishment() {
		const {
			match: {
				params: { id },
			},
			accomplishments,
		} = this.props

		let accomplishment
		if (id) accomplishment = accomplishments.find(i => i.id === id)

		if (accomplishment) {
			// adjust skills array structure
			accomplishment.skills = accomplishment.skills.items
		} else {
			accomplishment = {
				id: '',
				name: '',
				date: Date.now(),
				company: '',
				description: '',
				skills: [],
			}
		}

		return accomplishment
	}

	componentDidUpdate(prevProps) {
		// if accomplishments list length changes, update accomplishment
		if (prevProps.accomplishments.length !== this.props.accomplishments.length) {
			this.setState({ ...this.getAccomplishment() })
		}
	}

	handleMainPropChange({ target: { name, value } }) {
		this.setState({ [name]: value, mainPropsAreUpdated: true })
	}

	addSkill(skillId) {
		const skills = [...(this.state.skills || []), { id: skillId, description: '' }]

		this.setState({ skills, skillsAreUpdated: true })
	}

	addTool(skillId, toolId) {
		const skills = JSON.parse(JSON.stringify(this.state.skills)).map(skill => {
			if (skill.id === skillId) {
				if (!skill.hasOwnProperty('toolIds')) skill.toolIds = []
				skill.toolIds.push(toolId)
			}

			return skill
		})

		this.setState({ skills, skillsAreUpdated: true })
	}

	handleSkillDescriptionChange(skillId, value) {
		const newSkills = this.state.skills.map(skill => {
			if (skill.id === skillId) skill.description = value
			return skill
		})

		this.setState({ skills: newSkills, skillsAreUpdated: true })
	}

	handleUpdateAccomplishment() {
		const {
			id,
			name,
			date,
			company,
			description,
			skills,
			mainPropsAreUpdated,
			skillsAreUpdated,
		} = this.state
		const { userId, updateAccomplishmentInStore } = this.props

		if (mainPropsAreUpdated) {
			API.graphql(
				graphqlOperation(updateAccomplishment, {
					input: { id, userId, name, company, date, description },
				})
			).then(({ data: { updateAccomplishment } }) => {
				updateAccomplishmentInStore(updateAccomplishment)
			})
		}

		if (skillsAreUpdated) {
			skills.forEach(skill => {
				console.log(
					'message:',
					graphqlOperation(updateAccomplishment, {
						input: { id, skills: { userId, description, skill: { id: skill.id } } },
					})
				)
				API.graphql(
					graphqlOperation(updateAccomplishment, {
						input: { id, skills: { userId, description, skill: { id: skill.id } } },
					})
				).then(data => {
					// updateAccomplishmentInStore(updateAccomplishment)
				})
			})
		} else {
		}
	}

	render() {
		const { mainPropsAreUpdated, skillsAreUpdated, skills } = this.state

		return (
			<div style={this.bodyStyle}>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Typography variant="h4" gutterBottom>
						Edit Accomplishment
					</Typography>

					<Button
						variant="contained"
						color="secondary"
						disabled={!mainPropsAreUpdated && !skillsAreUpdated}
						onClick={this.handleUpdateAccomplishment.bind(this)}>
						Update
					</Button>
				</div>

				<div style={this.contentStyle}>
					<MainProps
						accomplishment={this.state}
						handleChange={this.handleMainPropChange.bind(this)}
					/>

					<Skills
						skills={skills}
						addSkill={this.addSkill.bind(this)}
						addTool={this.addTool.bind(this)}
						handleDescriptionChange={this.handleSkillDescriptionChange.bind(this)}
					/>
				</div>
			</div>
		)
	}
}

const mapStateToProps = ({ accomplishments, userId }) => ({ accomplishments, userId })

const mapDispatchToProps = dispatch => {
	return {
		updateAccomplishmentInStore: accomplishment => {
			dispatch({ type: 'UPDATE_ACCOMPLISHMENT', accomplishment })
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Edit)

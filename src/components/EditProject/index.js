import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Typography, Button } from '@material-ui/core'
import API, { graphqlOperation } from '@aws-amplify/api'

import MainProps from './MainProps'
import Skills from './Skills'
import { getProject } from '../../graphql/queries'
import { updateProject, updateProjectSkill, createProjectSkill } from '../../graphql/mutations'

class Edit extends Component {
	constructor(props) {
		super(props)

		const project = this.getProject()

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

		this.state = { ...project, mainPropsAreUpdated: false, skillsAreUpdated: false }
	}

	getProject() {
		const {
			match: {
				params: { id },
			},
			projects,
		} = this.props

		let project
		if (id) {
			const foundProject = projects.find(i => i.id === id)
			if (foundProject) project = JSON.parse(JSON.stringify(foundProject))
		}

		if (project) {
			// adjust skills array structure
			project.skills = project.skills.items
		} else {
			project = {
				id: '',
				name: '',
				date: '',
				company: '',
				description: '',
				skills: [],
			}
		}

		return project
	}

	componentDidUpdate(prevProps) {
		// if projects list length changes, update project
		if (prevProps.projects.length !== this.props.projects.length) {
			this.setState({ ...this.getProject() })
		}
	}

	handleMainPropChange({ target: { name, value } }) {
		this.setState({ [name]: value, mainPropsAreUpdated: true })
	}

	addProjectSkill(skillId) {
		const { userId } = this.props

		API.graphql(
			graphqlOperation(createProjectSkill, {
				input: { userId, skillId, projectSkillProjectId: this.state.id },
			})
		).then(({ data: { createProjectSkill: { id } } }) => {
			const skills = [...(this.state.skills || []), { id, skillId }]
			this.setState({ skills })
		})
	}

	updateTools(skillId, tools) {
		const skills = JSON.parse(JSON.stringify(this.state.skills)).map(skill => {
			if (skill.id === skillId) {
				skill.toolIds = tools.map(tool => tool.id)
				skill.isUpdated = true
				console.log('skill: ', skill)
			}

			return skill
		})

		this.setState({ skills, skillsAreUpdated: true })
	}

	handleSkillDescriptionChange(id, value) {
		const newSkills = this.state.skills.map(skill => {
			if (skill.id === id) {
				skill.description = value
				skill.isUpdated = true
			}
			return skill
		})

		this.setState({ skills: newSkills, skillsAreUpdated: true })
	}

	handleUpdateProject() {
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
		const { userId, updateProjectInStore } = this.props

		if (mainPropsAreUpdated) {
			API.graphql(
				graphqlOperation(updateProject, {
					input: { id, userId, name, company, date, description },
				})
			).then(({ data: { updateProject } }) => {
				updateProjectInStore(updateProject)
			})
		}

		if (skillsAreUpdated) {
			// loop through each skill and for each one that has been updated update database and redux
			skills.forEach(skill => {
				const { id, description, toolIds, isUpdated } = skill

				if (isUpdated) {
					API.graphql(
						graphqlOperation(updateProjectSkill, {
							input: { id, description, toolIds },
						})
					).then(({ data: { updateProjectSkill } }) => {
						const { id } = updateProjectSkill.project

						API.graphql(graphqlOperation(getProject, { id })).then(({ data }) => {
							updateProjectInStore(data.getProject)
						})
					})
				}
			})
		}

		this.setState({ mainPropsAreUpdated: false, skillsAreUpdated: false })
	}

	render() {
		const { mainPropsAreUpdated, skillsAreUpdated, skills } = this.state

		return (
			<div style={this.bodyStyle}>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Typography variant="h4" gutterBottom>
						Edit Project
					</Typography>

					<Button
						variant="contained"
						color="secondary"
						disabled={!mainPropsAreUpdated && !skillsAreUpdated}
						onClick={this.handleUpdateProject.bind(this)}>
						Update
					</Button>
				</div>

				<div style={this.contentStyle}>
					<MainProps project={this.state} handleChange={this.handleMainPropChange.bind(this)} />

					<Skills
						skills={skills}
						addProjectSkill={this.addProjectSkill.bind(this)}
						updateTools={this.updateTools.bind(this)}
						handleDescriptionChange={this.handleSkillDescriptionChange.bind(this)}
					/>
				</div>
			</div>
		)
	}
}

const mapStateToProps = ({ projects, userId }) => ({ projects, userId })

const mapDispatchToProps = dispatch => {
	return {
		updateProjectInStore: project => {
			dispatch({ type: 'UPDATE_PROJECT', project })
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Edit)

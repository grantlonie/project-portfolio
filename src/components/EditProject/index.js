import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Typography, Button } from '@material-ui/core'
import API, { graphqlOperation } from '@aws-amplify/api'

import MainProps from './MainProps'
import Skills from './Skills'
import { getProject } from '../../graphql/queries'
import {
	updateProject,
	updateProjectSkill,
	createProjectSkill,
	deleteProjectSkill,
} from '../../graphql/mutations'

let updateTimeout // used for timeout to edit project database and redux
const updateCheckTime = 5000 // [ms] how long to wait after editting to update the component

class Edit extends Component {
	constructor(props) {
		super(props)

		const project = this.getProject()

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

	componentWillUnmount() {
		this.updateProject()
	}

	handleMainPropChange({ target: { name, value } }) {
		clearTimeout(updateTimeout)
		updateTimeout = setTimeout(() => this.updateProject(), updateCheckTime)

		this.setState({ [name]: value, mainPropsAreUpdated: true })
	}

	addProjectSkill(skillId) {
		const { userId, addProjectSkillToStore } = this.props

		API.graphql(
			graphqlOperation(createProjectSkill, {
				input: { userId, skillId, projectSkillProjectId: this.state.id },
			})
		).then(({ data: { createProjectSkill } }) => {
			const skills = [...(this.state.skills || []), { id: createProjectSkill.id, skillId }]
			this.setState({ skills })
			addProjectSkillToStore(createProjectSkill)
		})
	}

	removeProjectSkill(id) {
		API.graphql(
			graphqlOperation(deleteProjectSkill, {
				input: { id },
			})
		).then(({ data: { deleteProjectSkill } }) => {
			const skills = [...this.state.skills].filter(skill => skill.id !== deleteProjectSkill.id)
			this.setState({ skills })
			this.props.removeProjectSkillToStore(deleteProjectSkill)
		})
	}

	updateTools(skillId, tools) {
		const skills = JSON.parse(JSON.stringify(this.state.skills)).map(skill => {
			if (skill.id === skillId) {
				skill.toolIds = tools.map(tool => tool.id)
				skill.isUpdated = true
			}

			return skill
		})

		clearTimeout(updateTimeout)
		updateTimeout = setTimeout(() => this.updateProject(), updateCheckTime)

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

		clearTimeout(updateTimeout)
		updateTimeout = setTimeout(() => this.updateProject(), updateCheckTime)

		this.setState({ skills: newSkills, skillsAreUpdated: true })
	}

	updateProject() {
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

		clearTimeout(updateTimeout)

		if (mainPropsAreUpdated) {
			API.graphql(
				graphqlOperation(updateProject, {
					input: { id, userId, name, company, date, description },
				})
			).then(({ data: { updateProject } }) => {
				updateProjectInStore(updateProject)
			})

			this.setState({ mainPropsAreUpdated: false })
		}

		if (skillsAreUpdated) {
			// loop through each skill and for each one that has been updated update database and redux
			const cleanedSkills = JSON.parse(JSON.stringify(skills)).map(skill => {
				const { id, description, toolIds, isUpdated } = skill

				if (isUpdated) {
					delete skill.isUpdated

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

				return skill
			})

			this.setState({ skillsAreUpdated: false, skills: cleanedSkills })
		}
	}

	render() {
		const { skills } = this.state

		return (
			<div>
				<Typography variant="h3" gutterBottom>
					Edit Project
				</Typography>

				<div style={this.contentStyle}>
					<MainProps project={this.state} handleChange={this.handleMainPropChange.bind(this)} />

					<Skills
						skills={skills}
						addProjectSkill={this.addProjectSkill.bind(this)}
						removeProjectSkill={this.removeProjectSkill.bind(this)}
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
		addProjectSkillToStore: skill => {
			dispatch({ type: 'ADD_SKILL_TO_PROJECT', skill })
		},
		removeProjectSkillToStore: skill => {
			dispatch({ type: 'REMOVE_SKILL_FROM_PROJECT', skill })
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Edit)

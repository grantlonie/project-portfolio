import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Typography } from '@material-ui/core'
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
import { ProjectItem } from '../../types'
import { addProject } from '../../js/helpers'

let updateTimeout // used for timeout to edit project database and redux
const updateCheckTime = 5000 // [ms] how long to wait after editting to update the component

const contentStyle: any = {
	display: 'grid',
	justifyContent: 'center',
	gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr)',
	gridGap: '20px 20px',
}

interface Props {
	match: any
	history: any
	projects: ProjectItem[]
	userId: string
	addProjectSkillToStore: (skill: any) => null
	removeSkillFromProject: (skill: any) => null
	updateProjectInStore: (project: any) => null
	showSpinner: (show: boolean) => null
}

type SkillItem = ProjectItem['skills']['items'][0] & { isUpdated?: boolean }

interface State {
	id: string
	name: string
	date: string
	company: string
	description: string
	skills: SkillItem[]
	mainPropsAreUpdated: boolean
	skillsAreUpdated: boolean
}

class Edit extends Component<Props, State> {
	state: State = this.freshState()

	freshState() {
		const {
			match: {
				params: { id },
			},
			projects,
			history,
		} = this.props

		let project: any = {}
		const foundProject = projects.find(i => i.id === id)

		if (foundProject) {
			project = JSON.parse(JSON.stringify(foundProject))
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

			// if project not found, go back to projects
			if (projects.length > 0) history.replace('/projects')
		}

		return {
			...project,
			mainPropsAreUpdated: false,
			skillsAreUpdated: false,
		}
	}

	componentDidUpdate(prevProps: Props) {
		// if project data comes in or new id parameter, update state to the new project id
		if (
			prevProps.userId !== this.props.userId ||
			prevProps.match.params.id !== this.props.match.params.id
		) {
			this.setState(this.freshState())
		}
	}

	componentWillUnmount() {
		this.updateProject()
	}

	handleMainPropChange({ target: { name, value } }) {
		clearTimeout(updateTimeout)
		updateTimeout = setTimeout(() => this.updateProject(), updateCheckTime)
		//@ts-ignore
		this.setState({ [name]: value, mainPropsAreUpdated: true })
	}

	addProjectSkill(skillId) {
		const { userId, addProjectSkillToStore } = this.props
		;(API.graphql(
			graphqlOperation(createProjectSkill, {
				input: { userId, skillId, projectSkillProjectId: this.state.id },
			})
		) as Promise<any>).then(({ data: { createProjectSkill } }) => {
			const skills: any = [...(this.state.skills || []), { id: createProjectSkill.id, skillId }]
			this.setState({ skills })
			addProjectSkillToStore(createProjectSkill)
		})
	}

	removeProjectSkill(id) {
		const { showSpinner, removeSkillFromProject } = this.props

		showSpinner(true)
		;(API.graphql(
			graphqlOperation(deleteProjectSkill, {
				input: { id },
			})
		) as Promise<any>).then(({ data: { deleteProjectSkill } }) => {
			const skills = [...this.state.skills].filter(skill => skill.id !== deleteProjectSkill.id)

			this.setState({ skills })
			removeSkillFromProject(deleteProjectSkill)
			showSpinner(false)
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
			;(API.graphql(
				graphqlOperation(updateProject, {
					input: { id, userId, name, company, date, description },
				})
			) as Promise<any>).then(({ data: { updateProject } }) => {
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
					;(API.graphql(
						graphqlOperation(updateProjectSkill, {
							input: { id, description, toolIds },
						})
					) as Promise<any>).then(({ data: { updateProjectSkill } }) => {
						const { id } = updateProjectSkill.project
						;(API.graphql(graphqlOperation(getProject, { id })) as Promise<any>).then(
							({ data }) => {
								updateProjectInStore(data.getProject)
							}
						)
					})
				}

				return skill
			})

			this.setState({ skillsAreUpdated: false, skills: cleanedSkills })
		}
	}

	async addAnotherProject() {
		const projectId = await addProject()
		this.props.history.replace(`/editProject/${projectId}/true`)
	}

	render() {
		return (
			<div>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Typography variant="h3" gutterBottom>
						Edit Project
					</Typography>

					{this.props.match.params.isNew ? (
						<span onClick={this.addAnotherProject.bind(this)} style={{ cursor: 'pointer' }}>
							<img
								style={{ margin: '0 10px 0 30px', height: '30px' }}
								src="/assets/img/baseline-add_circle-24px.svg"
								draggable={false}
								alt="Add another project"
							/>
							<em>Add another project</em>
						</span>
					) : null}
				</div>

				<div style={contentStyle}>
					<MainProps project={this.state} handleChange={this.handleMainPropChange.bind(this)} />

					<Skills
						skills={this.state.skills}
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
		removeSkillFromProject: skill => {
			dispatch({ type: 'REMOVE_SKILL_FROM_PROJECT', skill })
		},
		showSpinner: show => {
			dispatch({ type: 'SHOW_SPINNER', show })
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Edit)

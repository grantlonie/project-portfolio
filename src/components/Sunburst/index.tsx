import React, { Component } from 'react'
import { connect } from 'react-redux'

import Circle from './Circle'
import { ProjectItem, CategoryItem, SkillItem } from '../../types'

const colors = ['#6ff5fc', 'orange', 'gray', '#ff5959']

interface Props {
	projects: ProjectItem[]
	allCategories: CategoryItem[]
	allSkills: SkillItem[]
}

interface State {
	/** Project the user is hovering over */
	hoveringProjectId: string
	/** Array of projectSkills that are selected to show more detail */
	selectedProjectSkills?: { id: string; name: string }[]
}

interface SunburstData {
	id: string
	name: string
	fill: string
	phi: number
	projectCount: number
	skills: {
		id: string
		name: string
		fill: string
		phi: number
		projectCount: number
		projects: {
			id: string
			name: string
			skillId: string
			fill: string
			phi: number
		}[]
	}[]
}

class Sunburst extends Component<Props> {
	state: State = { hoveringProjectId: null, selectedProjectSkills: [] }

	// this method creates the sunburst data by looping through categories, skills and projects
	createData() {
		const { projects, allCategories } = this.props

		let data = allCategories.map((category, categoryI) => {
			const skills = category.skills.items
				.map(skill => {
					// find projects associated with skill
					const associatedProjects = projects
						.map(({ id, name, skills }) => {
							const projectSkill = skills.items.find(projectSkill => {
								return projectSkill.skillId === skill.id
							})
							if (!projectSkill) return null
							return { id, name, skillId: projectSkill.id, phi: null, fill: colors[categoryI] }
						})
						.filter(project => project !== null)

					// If no projects are associated with skill
					if (associatedProjects.length === 0) return null

					return {
						...skill,
						projects: associatedProjects,
						projectCount: associatedProjects.length,
						phi: null,
						fill: colors[categoryI],
					}
				})
				.filter(skill => skill !== null)

			// Number of total projects in skills
			const projectCount = skills.reduce((acc, cur) => acc + cur.projectCount, 0)

			return { ...category, skills, projectCount, phi: null, fill: colors[categoryI] }
		})

		// Count total projects and calculate rotation angle for each category, skill and project
		const totalProjects = data.reduce((acc, cur) => acc + cur.projectCount, 0)
		data = data.map(category => {
			const skills = category.skills.map(skill => {
				const projects = skill.projects.map(project => ({ ...project, phi: 360 / totalProjects }))

				return { ...skill, projects, phi: (skill.projectCount * 360) / totalProjects }
			})

			return { ...category, skills, phi: (category.projectCount * 360) / totalProjects }
		})

		return data
	}

	hoverNode(type, id) {
		if (type === 'project') this.setState({ hoveringProjectId: id })
	}

	/**
	 * Method called after user clicks a node
	 * @param type - Type of node - category, skill or project
	 * @param id - Node id
	 */
	selectNode(type: string, id: string) {
		if (type !== 'project') return

		const projectSkillIds = this.props.projects
			.find(project => project.id === id)
			.skills.items.map(projectSkill => {
				const name = this.props.allSkills.find(skill => skill.id === projectSkill.skillId).name
				return { id: projectSkill.id, name }
			})

		let selectedProjectSkills: State['selectedProjectSkills'] = []
		selectedProjectSkills.push(projectSkillIds[0])

		this.setState({ selectedProjectSkills, hoveringProjectId: null })

		if (projectSkillIds.length < 2) return

		let i = 1
		let projectSkillInterval = setInterval(() => {
			selectedProjectSkills.push(projectSkillIds[i])
			this.setState({ selectedProjectSkills })
			i++
			if (i === projectSkillIds.length) clearInterval(projectSkillInterval)
		}, 100)
	}

	render() {
		const { hoveringProjectId, selectedProjectSkills } = this.state
		const data: SunburstData[] = this.createData()

		if (data.length === 0) return <h3>Loading...</h3>

		let categoryRotation = 0

		return (
			<div>
				<div
					style={{
						position: 'absolute',
						transform: `translate(${300}px, ${400}px)`,
					}}>
					<Circle
						data={data}
						radius={50}
						length={75}
						itemRotation={0}
						fontSize={14}
						hoveringProjectId={this.state.hoveringProjectId}
						hoverNode={this.hoverNode.bind(this, 'category')}
						selectNode={this.selectNode.bind(this, 'category')}
					/>

					{data.map((category, categoryI) => {
						// Rotation logic for skills
						if (categoryI > 0) categoryRotation += data[categoryI - 1].phi / 2 + category.phi / 2
						let skillRotation = categoryRotation - category.phi / 2 + category.skills[0].phi / 2

						return (
							<React.Fragment key={category.id}>
								<Circle
									data={category.skills}
									radius={125}
									length={75}
									itemRotation={skillRotation}
									fontSize={12}
									hoveringProjectId={this.state.hoveringProjectId}
									hoverNode={this.hoverNode.bind(this, 'skill')}
									selectNode={this.selectNode.bind(this, 'skill')}
								/>

								{category.skills.map((skill, skillI) => {
									// Rotation logic for projects
									if (skillI > 0)
										skillRotation += category.skills[skillI - 1].phi / 2 + skill.phi / 2
									const projectRotation = skillRotation - skill.phi / 2 + skill.projects[0].phi / 2

									return (
										<React.Fragment key={skill.id}>
											<Circle
												data={skill.projects}
												radius={200}
												length={50}
												itemRotation={projectRotation}
												fontSize={10}
												hoveringProjectId={hoveringProjectId}
												hoverNode={this.hoverNode.bind(this, 'project')}
												selectNode={this.selectNode.bind(this, 'project')}
												selectedProjectSkills={selectedProjectSkills}
												projectDetailsListStart={{ x: 400, y: -200 }}
											/>
										</React.Fragment>
									)
								})}
							</React.Fragment>
						)
					})}
				</div>

				<div
					style={{
						position: 'absolute',
						transform: `translate(${400}px, ${200}px)`,
					}}
				/>
			</div>
		)
	}
}

const mapStateToProps = ({ projects, allCategories, allSkills }) => ({
	projects,
	allCategories,
	allSkills,
})

export default connect(mapStateToProps)(Sunburst)
